# Antena Livre

App web para assistir **canais de TV ao vivo** (nacionais e internacionais), **filmes** e **séries** clássicos, com filtros por ano, década e categoria.

## Recursos

- **TV ao vivo**: canais de 18 países (Brasil por padrão) e um grupo internacional, organizados por categoria (Notícias, Esportes, Infantil, Música…).
- **Filmes e Séries**: acervo de domínio público do Internet Archive, com filtro por década, ano exato e 17 categorias, ordenável por popularidade, ano ou título.
- **Minha lista**: favoritos guardados no navegador.
- **Importar M3U**: carregue a lista do seu provedor de TV (por URL ou arquivo).
- Busca, layout responsivo (celular e computador) e player HLS (hls.js).

## Fontes de conteúdo

- Canais: listas públicas do projeto aberto [iptv-org](https://github.com/iptv-org/iptv), com sinais que as próprias emissoras disponibilizam na internet. Alguns podem estar fora do ar ou bloqueados por região.
- Filmes e séries: [Internet Archive](https://archive.org), acervo de domínio público.

O app não hospeda nenhum vídeo; ele só exibe conteúdo de fontes públicas.

## Rodar localmente

Abra o `index.html` no navegador. Para evitar bloqueios de alguns sinais, prefira servir por HTTP:

```bash
npx serve .
```

## Publicar no Vercel

1. Suba este repositório no GitHub.
2. No Vercel: **Add New → Project → Import** o repositório.
3. Framework Preset: **Other**. Sem comando de build. Clique em **Deploy**.
