// Função do Vercel: descobre o vídeo da transmissão ao vivo atual de um canal do YouTube.
// Uso: /api/ytlive?channel=UCxxxxxxxxxxxxxxxxxxxxxx   ou   /api/ytlive?handle=@tvcultura
// Resposta: { videoId: "xxxxxxxxxxx" | null, live: true|false, embeddable: true|false }
// Acrescente &debug=1 para ver detalhes da página recebida.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function getPage(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8', 'Cookie': 'CONSENT=YES+1; SOCS=CAI' },
    redirect: 'follow'
  });
  return { status: r.status, finalUrl: r.url, html: await r.text() };
}

function findVideoId(html, finalUrl) {
  const m = (finalUrl || '').match(/[?&]v=([\w-]{11})/);
  if (m) return m[1];
  const pats = [
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/,
    /<meta property="og:url" content="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/,
    /"videoDetails":\{"videoId":"([\w-]{11})"/
  ];
  for (const p of pats) { const x = html.match(p); if (x) return x[1]; }
  return null;
}

module.exports = async (req, res) => {
  const { channel = '', handle = '', debug = '' } = req.query || {};
  let path = '';
  if (/^UC[\w-]{22}$/.test(channel)) path = `channel/${channel}`;
  else if (/^@[\w.\-]{2,60}$/.test(handle)) path = handle;
  else { res.status(400).json({ error: 'canal inválido' }); return; }

  try {
    const page = await getPage(`https://www.youtube.com/${path}/live`);
    let videoId = findVideoId(page.html, page.finalUrl);
    let via = videoId ? 'live' : null;
    // plano B: aba "Ao vivo" do canal (transmissões em andamento)
    if (!videoId) {
      const alt = await getPage(`https://www.youtube.com/${path}/streams`);
      const m = alt.html.match(/i\.ytimg\.com\/vi\/([\w-]{11})\/(?:(?!i\.ytimg\.com\/vi\/)[\s\S]){0,6000}?THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE/) ||
                alt.html.match(/"videoId":"([\w-]{11})"(?:(?!"videoId":)[\s\S]){0,3000}?BADGE_STYLE_TYPE_LIVE_NOW/);
      if (m) { videoId = m[1]; via = 'streams'; }
    }
    const html = page.html;
    const ended = via === 'live' && /itemprop="endDate"/.test(html);
    const live = !!videoId && !ended;
    const embeddable = via !== 'live' || !/"playableInEmbed":false/.test(html);
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const out = { videoId: live ? videoId : null, live, embeddable };
    if (debug) Object.assign(out, {
      via, status: page.status, finalUrl: page.finalUrl, size: page.html.length,
      title: (page.html.match(/<title>([^<]*)<\/title>/) || [])[1] || null,
      hasCanonical: /rel="canonical"/.test(page.html),
      consent: /consent\.(youtube|google)/.test(page.finalUrl + page.html.slice(0, 5000))
    });
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ videoId: null, live: false, error: 'falha ao consultar o YouTube' });
  }
};
