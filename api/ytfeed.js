// Função do Vercel: últimos vídeos publicados por um canal do YouTube (feed RSS oficial do YouTube).
// Uso: /api/ytfeed?channel=UCxxxxxxxxxxxxxxxxxxxxxx
// Resposta: { channel: "Nome", items: [{ id, title, published, thumb, views }] }  (sem os Shorts)
const dec = s => String(s || '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

function parseFeed(xml) {
  const channel = dec((xml.match(/<title>([^<]*)<\/title>/) || [])[1]);
  const items = [];
  for (const e of xml.split('<entry>').slice(1)) {
    const id = (e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1];
    if (!id) continue;
    const link = (e.match(/<link rel="alternate" href="([^"]+)"/) || [])[1] || '';
    items.push({
      id,
      short: /\/shorts\//.test(link) || /#shorts?\b/i.test(e),
      title: dec((e.match(/<title>([^<]*)<\/title>/) || [])[1]),
      published: (e.match(/<published>([^<]*)<\/published>/) || [])[1] || '',
      thumb: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      views: +((e.match(/<media:statistics views="(\d+)"/) || [])[1] || 0)
    });
  }
  return { channel, items };
}

// O YouTube responde 200 em /shorts/ID só quando o vídeo é um Short; vídeos normais redirecionam.
async function isShort(id) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual', signal: ctl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 AntenaLivre/1.0', 'Cookie': 'CONSENT=YES+1; SOCS=CAI' } });
    clearTimeout(t);
    return r.status === 200;
  } catch { return false; }
}

module.exports = async (req, res) => {
  const { channel = '' } = req.query || {};
  if (!/^UC[\w-]{22}$/.test(channel)) { res.status(400).json({ error: 'canal inválido' }); return; }
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 AntenaLivre/1.0' }
    });
    if (!r.ok) throw new Error('feed ' + r.status);
    const out = parseFeed(await r.text());
    const checks = await Promise.all(out.items.map(v => v.short ? true : isShort(v.id)));
    out.items = out.items.filter((v, i) => !checks[i]).map(({ short, ...v }) => v);
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ channel: '', items: [], error: 'falha ao ler o canal' });
  }
};
module.exports.parseFeed = parseFeed;
