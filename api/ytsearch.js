// Função do Vercel: busca vídeos no YouTube (usada para clipes de música oficiais).
// Uso: /api/ytsearch?q=sertanejo+clipe+oficial
// Resposta: { items: [{ id, title, channel, length, views, official }] }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const txt = o => !o ? '' : (o.simpleText || (o.runs || []).map(r => r.text).join('') || '');

function collect(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 40 || out.length >= 60) return;
  if (Array.isArray(node)) { for (const n of node) collect(n, out, depth + 1); return; }
  if (node.videoRenderer && node.videoRenderer.videoId) out.push(node.videoRenderer);
  for (const k in node) if (k !== 'videoRenderer') collect(node[k], out, depth + 1);
}

function parseSearch(html) {
  const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/) || html.match(/window\["ytInitialData"\] = (\{[\s\S]*?\});/);
  if (!m) return [];
  let data; try { data = JSON.parse(m[1]); } catch { return []; }
  const vids = []; collect(data, vids);
  const seen = new Set();
  return vids.filter(v => !seen.has(v.videoId) && seen.add(v.videoId)).map(v => {
    const channel = txt(v.ownerText || v.longBylineText);
    const badges = JSON.stringify(v.ownerBadges || []);
    return {
      id: v.videoId,
      title: txt(v.title),
      channel,
      length: txt(v.lengthText),
      views: txt(v.shortViewCountText || v.viewCountText),
      official: /VERIFIED_ARTIST|OFFICIAL_ARTIST/.test(badges) || /VEVO$/i.test(channel) || / - Topic$/.test(channel)
    };
  }).filter(v => v.length); // sem duração = live ou item especial
}

module.exports = async (req, res) => {
  const q = String((req.query || {}).q || '').trim().slice(0, 120);
  if (q.length < 2) { res.status(400).json({ error: 'busca vazia' }); return; }
  try {
    const r = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=pt-BR&gl=BR`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9', 'Cookie': 'CONSENT=YES+1; SOCS=CAI' }
    });
    const items = parseSearch(await r.text());
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ items });
  } catch (e) {
    res.status(502).json({ items: [], error: 'falha na busca' });
  }
};
module.exports.parseSearch = parseSearch;
