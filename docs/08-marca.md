# Marca

Regra curta: **nunca invente logo, nunca escreva "Informatiza" como texto, nunca
use placeholder.** Os arquivos oficiais estão em `starter/public/` e são os
únicos que podem representar a marca.

---

## Arquivos

| Arquivo | Uso |
| --- | --- |
| `logo-informatiza.svg` | logo do header — **tema claro** |
| `logo-informatiza-dark.svg` | logo do header — **tema escuro** |
| `favicon.ico` | ícone da aba (16/32/48/64/128/256 em um arquivo) |
| `favicon-32.png` | ícone da aba, PNG |
| `favicon-192.png` | Android / PWA |
| `apple-touch-icon.png` | iOS, 180×180 |

O logo é o brasão de Goiás mais o texto "Informatiza 3.0". O favicon é apenas o
brasão, recortado em quadrado transparente.

---

## Header

Já está implementado em `core/layout/app-shell.ts`. Não reescreva:

```html
<a routerLink="/" class="flex items-center no-underline" aria-label="Informatiza 3.0 - inicio">
    <img
        [src]="theme.mode() === 'dark' ? 'logo-informatiza-dark.svg' : 'logo-informatiza.svg'"
        alt="Informatiza 3.0"
        width="139"
        height="30"
        class="h-7 w-auto"
    />
</a>
```

Sempre `width` e `height` no elemento, mais `h-7 w-auto` no Tailwind: os
atributos reservam o espaço e evitam o pulo de layout durante o carregamento.

---

## Por que dois arquivos, e não um com currentColor

Porque **`currentColor` não atravessa `<img>`**. Um SVG carregado por `<img>` é
um documento isolado: não herda `color` da página, e `currentColor` cai no valor
inicial, preto.

Isso foi verificado na prática — um SVG com `fill="currentColor"` dentro de um
contexto `color: rgb(255,0,0)` renderizou `rgb(0,0,0)`.

Consequência: no tema escuro o texto ficaria preto sobre fundo quase preto. Por
isso cada variante traz a cor gravada — `#020617` no claro, `#fafafa` no escuro —
e a troca é feita pelo `ThemeService`, não por CSS.

As alternativas foram descartadas de propósito:

- `filter: invert()` inverteria também as cores do brasão;
- `@media (prefers-color-scheme)` dentro do SVG ignoraria o botão manual de tema;
- SVG inline no template resolveria, mas jogaria 20 KB dentro do componente.

---

## Se precisar regenerar os arquivos

Os originais vieram do Figma com o brasão embutido como **imagem raster em
base64 dentro de um `<pattern>`** — por isso pesavam 630 KB cada. O raster
original tem 1200×1606.

O processo aplicado foi: extrair o raster do base64, reduzir para 48 px de
largura no logo (3× o tamanho de exibição, suficiente para telas retina), montar
um SVG novo com esse raster mais o traçado vetorial do texto, e gerar os
favicons por reamostragem Lanczos a partir do original em resolução cheia.

Resultado: 630 KB → 19,6 KB por variante.

Se um dia chegar um logo novo do time de design, refaça esse caminho em vez de
usar o export bruto do Figma direto.

---

## Proibido

- Substituir o logo por texto, inicial, ou quadrado colorido com "I"
- Aplicar `filter`, `opacity` ou recolorir o logo
- Distorcer a proporção (use `w-auto` com altura fixa, nunca as duas travadas)
- Usar o logo do tema claro sobre fundo escuro, ou o contrário
- Recriar o brasão como ícone de biblioteca (`pi pi-*` ou qualquer outro)
