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

// Título com hashtag ou emoji: nesses canais, é sempre Short ou divulgação, nunca filme/episódio.
const looksShort = t => /(^|\s)#\w/u.test(t) || /\p{Extended_Pictographic}/u.test(t);

async function getFeed(qs) {
  const r = await fetch(`https://www.youtube.com/feeds/videos.xml?${qs}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 AntenaLivre/1.0' }
  });
  if (!r.ok) return null;
  return parseFeed(await r.text());
}

module.exports = async (req, res) => {
  const { channel = '', debug = '' } = req.query || {};
  if (!/^UC[\w-]{22}$/.test(channel)) { res.status(400).json({ error: 'canal inválido' }); return; }
  try {
    // 1º: lista oficial do canal só com vídeos longos (UULF = uploads sem Shorts)
    let source = 'longos';
    let out = await getFeed(`playlist_id=UULF${channel.slice(2)}`);
    // 2º: feed normal do canal
    if (!out || !out.items.length) {
      source = 'canal';
      out = await getFeed(`channel_id=${channel}`);
      if (!out) throw new Error('feed');
    }
    const before = out.items.length;
    out.items = out.items.filter(v => !v.short && (source === 'longos' || !looksShort(v.title))).map(({ short, ...v }) => v);
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (debug) Object.assign(out, { source, before, after: out.items.length });
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ channel: '', items: [], error: 'falha ao ler o canal' });
  }
};
module.exports.parseFeed = parseFeed;
