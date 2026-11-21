# Antena Livre

App web para assistir **canais de TV ao vivo** (nacionais e internacionais), **filmes** e **séries** clássicos, com filtros por ano, década e categoria.

## Recursos

- **TV ao vivo**: canais de todos os países da lista iptv-org (ou o mundo inteiro de uma vez), organizados por categoria (Notícias, Esportes, Infantil, Música…).
- **YouTube ao vivo**: transmissões oficiais de emissoras no YouTube (CNN Brasil, Jovem Pan News, Record News, SBT News, Band Jornalismo, TV Brasil, TV Senado, Câmara, CNN Portugal, Al Jazeera, DW, France 24, Sky News, euronews, ABC, CBS, Bloomberg, NHK, NASA…), tocando dentro do app, e busca de outras lives no YouTube.
- **Filmes e Séries**: acervo de domínio público do Internet Archive, com filtro por década, ano exato e 17 categorias, ordenável por popularidade, ano ou título.
- **Novelas**: canais de novela 24h ao vivo, buscados nas listas de 14 países e filtráveis por país, novelas turcas dubladas completas de canais oficiais do YouTube (Noverama TV), tocando no app, e atalhos para plataformas oficiais (+SBT, ViX, Pluto TV, Samsung TV Plus, Telemundo, Univision, Canela.TV, Globoplay, PlayPlus).
- **Doramas**: filmes asiáticos em domínio público (Coreia, Japão, China, Hong Kong, Taiwan, Tailândia) com filtro por país, década e ano; canais de dorama ao vivo; e atalhos para plataformas oficiais (Rakuten Viki, Korean Classic Film no YouTube, KOCOWA+).
- **Clássicos**:
  - *Desenhos antigos* em domínio público (Popeye, Superman da Fleischer, Betty Boop, Pernalonga, Pica-Pau, Gasparzinho…), com filtro por personagem, década e ano;
  - *Seriados antigos* em domínio público (As Aventuras do Super-Homem, Lone Ranger, Bonanza, Três Patetas, Flash Gordon…);
  - *Tokusatsu*: onde assistir oficialmente Jaspion, Jiraiya, Changeman, Flashman, Jiban, Kamen Rider Black RX, Gavan, National Kid e outros (TokuSato, Toei Tokusatsu World, Pluto TV, Sato+, Mercado Play, Prime Video);
  - canais retrô, de desenhos e de tokusatsu ao vivo.
- **Minha lista**: favoritos guardados no navegador.
- **Importar M3U**: carregue a lista do seu provedor de TV (por URL ou arquivo).
- Busca, layout responsivo (celular e computador) e player HLS (hls.js).

## Fontes de conteúdo

- Canais: listas públicas do projeto aberto [iptv-org](https://github.com/iptv-org/iptv), com sinais que as próprias emissoras disponibilizam na internet. Alguns podem estar fora do ar ou bloqueados por região.
- Filmes e séries: [Internet Archive](https://archive.org), acervo de domínio público.

O app não hospeda nenhum vídeo; ele só exibe conteúdo de fontes públicas.

## Instalar como app

O Antena Livre é um PWA: depois de publicado no Vercel (HTTPS), dá para instalar.

- **Android (Chrome)**: botão **Instalar app** no topo, ou menu ⋮ → *Instalar app*.
- **iPhone/iPad (Safari)**: Compartilhar → *Adicionar à Tela de Início*.
- **Computador (Chrome ou Edge)**: botão **Instalar app** no topo, ou o ícone de instalar na barra de endereço.

## Modo TV

Liga sozinho em TVs (Google TV, Android TV, Fire TV, webOS, Tizen) e também pelo botão **Modo TV** no topo.
Setas do controle para navegar, **OK** para abrir, **OK no vídeo** para tela cheia e **Voltar** para sair.
Na TV TCL com Google TV: instale um navegador como o TV Bro pela Play Store e abra o endereço do app.

## Rodar localmente

Abra o `index.html` no navegador. Para evitar bloqueios de alguns sinais, prefira servir por HTTP:

```bash
npx serve .
```

## Publicar no Vercel

1. Suba este repositório no GitHub.
2. No Vercel: **Add New → Project → Import** o repositório.
3. Framework Preset: **Other**. Sem comando de build. Clique em **Deploy**.
