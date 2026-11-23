// Função do Vercel: últimos vídeos publicados por um canal do YouTube (feed RSS oficial do YouTube).
// Uso: /api/ytfeed?channel=UCxxxxxxxxxxxxxxxxxxxxxx
// Resposta: { channel: "Nome", items: [{ id, title, published, thumb, views }] }
const dec = s => String(s || '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

function parseFeed(xml) {
  const channel = dec((xml.match(/<title>([^<]*)<\/title>/) || [])[1]);
  const items = [];
  for (const e of xml.split('<entry>').slice(1)) {
    const id = (e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1];
    if (!id) continue;
    items.push({
      id,
      title: dec((e.match(/<title>([^<]*)<\/title>/) || [])[1]),
      published: (e.match(/<published>([^<]*)<\/published>/) || [])[1] || '',
      thumb: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      views: +((e.match(/<media:statistics views="(\d+)"/) || [])[1] || 0)
    });
  }
  return { channel, items };
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
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ channel: '', items: [], error: 'falha ao ler o canal' });
  }
};
module.exports.parseFeed = parseFeed;
