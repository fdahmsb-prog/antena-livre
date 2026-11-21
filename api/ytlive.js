// Função do Vercel: descobre o vídeo da transmissão ao vivo atual de um canal do YouTube.
// Uso: /api/ytlive?channel=UCxxxxxxxxxxxxxxxxxxxxxx   ou   /api/ytlive?handle=@tvcultura
// Resposta: { videoId: "xxxxxxxxxxx" | null, live: true|false, embeddable: true|false }
module.exports = async (req, res) => {
  const { channel = '', handle = '' } = req.query || {};
  let path = '';
  if (/^UC[\w-]{22}$/.test(channel)) path = `channel/${channel}`;
  else if (/^@[\w.\-]{2,60}$/.test(handle)) path = handle;
  else { res.status(400).json({ error: 'canal inválido' }); return; }

  try {
    const r = await fetch(`https://www.youtube.com/${path}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Cookie': 'CONSENT=YES+1'
      }
    });
    const html = await r.text();
    const canon = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/);
    const live = /"isLive":true|hlsManifestUrl|itemprop="isLiveBroadcast" content="True"/.test(html) &&
                 !/itemprop="endDate"/.test(html);
    const embeddable = !/"playableInEmbed":false/.test(html);
    const videoId = canon ? canon[1] : null;
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ videoId: live ? videoId : null, live: !!(live && videoId), embeddable });
  } catch (e) {
    res.status(502).json({ videoId: null, live: false, error: 'falha ao consultar o YouTube' });
  }
};
