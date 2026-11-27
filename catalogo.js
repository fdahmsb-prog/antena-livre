// Cada entrada indica a categoria e a página oficial. O vídeo é opcional.
const CATALOGO = [
  {id:'tv-alerr', categoria:'tv', titulo:'TV Assembleia de Roraima', fonte:'ALE-RR', detalhe:'Boa Vista, RR · sessões e programação local', url:'https://www.youtube.com/@assembleiarr/live'},
  {id:'tv-brasil', categoria:'tv', titulo:'TV Brasil', fonte:'EBC', detalhe:'Programação pública ao vivo', url:'https://tvbrasil.ebc.com.br/webtv/'},
  {id:'tv-cultura', categoria:'tv', titulo:'TV Cultura', fonte:'Fundação Padre Anchieta', detalhe:'Programação ao vivo e Cultura Fast', url:'https://cultura.uol.com.br/aovivo/'},
  {id:'cinema-itau', categoria:'filmes', titulo:'Itaú Cultural Play', fonte:'Itaú Cultural', detalhe:'Cinema brasileiro, animação e documentários', url:'https://www.itauculturalplay.com.br/'},
  {id:'cinema-libreflix', categoria:'filmes', titulo:'Libreflix', fonte:'Libreflix', detalhe:'Filmes e produções independentes', url:'https://libreflix.org/'},
  {id:'serie-brasil', categoria:'series', titulo:'Meu Pedaço do Brasil', fonte:'TV Brasil', detalhe:'Série documental sobre lugares e histórias brasileiras', url:'https://tvbrasil.ebc.com.br/meupedacodobrasil'},
  {id:'serie-tv-brasil', categoria:'series', titulo:'Séries e programas da TV Brasil', fonte:'EBC', detalhe:'Produções nacionais e programas sob demanda', url:'https://tvbrasil.ebc.com.br/'},
  {id:'novela-sbt', categoria:'novelas', titulo:'Novelas e canais do +SBT', fonte:'SBT', detalhe:'Catálogo da emissora', url:'https://mais.sbt.com.br/'},
  {id:'novela-vix', categoria:'novelas', titulo:'Novelas latinas no ViX', fonte:'TelevisaUnivision', detalhe:'Novelas e séries. A disponibilidade varia por região.', url:'https://vix.com/'},
  {id:'dorama-true-beauty', categoria:'doramas', titulo:'True Beauty', fonte:'Rakuten Viki', detalhe:'Dorama sul-coreano · romance e comédia', url:'https://www.viki.com/tv/37374c-true-beauty'},
  {id:'doramas-viki', categoria:'doramas', titulo:'Doramas no Viki', fonte:'Rakuten Viki', detalhe:'Séries da Coreia, China e outros países asiáticos', url:'https://www.viki.com/'},
  {id:'classico-train', categoria:'classicos', titulo:'The Great Train Robbery', fonte:'Library of Congress', detalhe:'1903 · curta-metragem mudo · faroeste', url:'https://www.loc.gov/item/00694220/'},
  {id:'classicos-loc', categoria:'classicos', titulo:'Clássicos do National Film Registry', fonte:'Library of Congress', detalhe:'Seleção de filmes históricos disponíveis na internet', url:'https://www.loc.gov/programs/national-film-preservation-board/film-registry/watch-films-on-the-national-film-registry/'},
  {id:'classico-toku', categoria:'classicos', titulo:'Toei Tokusatsu World', fonte:'Toei', detalhe:'Seriados clássicos japoneses no canal oficial da produtora', url:'https://www.youtube.com/@toeitokusatsuworldofficial239'},
  {id:'clipe-okgo', categoria:'musica', titulo:'OK Go — Here It Goes Again', fonte:'OK Go', detalhe:'Videoclipe oficial', url:'https://www.youtube.com/watch?v=dTAAsCNK7RA', video:'dTAAsCNK7RA'},
  {id:'clipe-npr', categoria:'musica', titulo:'Anderson .Paak & The Free Nationals', fonte:'NPR Music', detalhe:'Apresentação ao vivo no Tiny Desk Concert', url:'https://www.youtube.com/watch?v=ferZnZ0_rSM', video:'ferZnZ0_rSM'},
  {id:'clipe-sugar', categoria:'musica', titulo:'Maroon 5 — Sugar', fonte:'Maroon 5', detalhe:'Videoclipe oficial', url:'https://www.youtube.com/watch?v=09R8_2nJtjg', video:'09R8_2nJtjg'},
  {id:'clipe-counting', categoria:'musica', titulo:'OneRepublic — Counting Stars', fonte:'OneRepublic', detalhe:'Videoclipe oficial', url:'https://www.youtube.com/watch?v=hT_nvWreIhg', video:'hT_nvWreIhg'},
  {id:'radio-alerr', categoria:'radios', titulo:'Rádio Assembleia 98,3 FM', fonte:'ALE-RR', detalhe:'Boa Vista, RR · notícias, entrevistas e música', url:'https://al.rr.leg.br/radio-ale/'},
  {id:'radio-amazonia', categoria:'radios', titulo:'Rádio Nacional da Amazônia', fonte:'EBC Rádios', detalhe:'Programação e notícias da região amazônica', url:'https://radios.ebc.com.br/nacionalamazonia/'},
  {id:'radio-cultura', categoria:'radios', titulo:'Rádios Cultura FM e Cultura Brasil', fonte:'Fundação Padre Anchieta', detalhe:'Música e programação cultural ao vivo', url:'https://cultura.uol.com.br/aovivo/'}
];
