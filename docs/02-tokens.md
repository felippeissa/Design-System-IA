# Tokens de design

O tema é definido em `starter/src/app/core/theme/informatiza-preset.ts`, um
`definePreset` sobre o Aura. Cada token vira uma variável CSS `--p-*` e, graças
ao plugin `tailwindcss-primeui`, também um utilitário Tailwind.

**A regra que mais importa:** nunca escreva cor fixa numa tela. Nem `#0ea5e9`,
nem `rgb(...)`, nem `text-blue-500`. Sempre um token. É isso que permite trocar a
identidade visual inteira mexendo em um arquivo só.

---

## Cores — utilitários que você deve usar

### Marca

| Utilitário | Uso |
| --- | --- |
| `bg-primary` | fundo de elemento primário |
| `text-primary` | texto/ícone na cor da marca |
| `text-primary-contrast` | texto sobre fundo primário |
| `bg-primary-50` … `bg-primary-950` | escala completa (fundos tonais) |

### Superfícies

| Utilitário | Uso |
| --- | --- |
| `bg-surface-0` | fundo de card/painel no tema claro |
| `bg-surface-50` | fundo da página no tema claro |
| `bg-surface-900` | fundo de card/painel no tema escuro |
| `bg-surface-950` | fundo da página no tema escuro |
| `border-surface` | **toda** borda |
| `bg-emphasis` | fundo de hover |
| `bg-highlight` | fundo de item selecionado |

### Texto

| Utilitário | Uso |
| --- | --- |
| `text-color` | texto principal |
| `text-muted-color` | texto secundário, legendas, placeholders |

### Formato

| Utilitário | Uso |
| --- | --- |
| `rounded-border` | raio padrão — use este, não `rounded-lg` |

---

## O par claro/escuro é obrigatório

Todo elemento que pinta fundo precisa declarar os dois modos:

```html
<!-- Certo -->
<div class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-border p-4">

<!-- Errado: some no tema escuro -->
<div class="bg-white border border-gray-200 rounded-lg p-4">
```

`text-color`, `text-muted-color`, `border-surface`, `bg-emphasis` e
`bg-highlight` **já se adaptam sozinhos** — não coloque variante `dark:` neles.

Para fundos tonais coloridos, o padrão é opacidade no escuro:

```html
<span class="bg-primary-50 text-primary dark:bg-primary-400/10">
<span class="bg-green-50 text-green-600 dark:bg-green-400/10 dark:text-green-400">
```

Cores semânticas de estado (verde para sucesso, vermelho para erro, amarelo para
alerta) são a **única** exceção à proibição de cores Tailwind diretas.

---

## Como o tema escuro é acionado

Pela classe `informatiza-dark` no `<html>`, gerenciada por
`core/theme/theme.service.ts`, com a preferência salva em `localStorage`.

Os três pontos precisam continuar alinhados — se mudar um, mude os três:

1. `darkModeSelector: '.informatiza-dark'` em `app.config.ts`
2. `@custom-variant dark (&:where(.informatiza-dark, .informatiza-dark *))` em `styles.css`
3. `DARK_CLASS` em `theme.service.ts`

---

## Trocando a paleta da marca

Abra `informatiza-preset.ts` e substitua **apenas** os valores de `primary`:

```ts
primary: {
    50:  '#f0f9ff',
    // ... 100 a 900
    950: '#082f49'
}
```

Aceita hex direto ou referência a primitivo do PrimeNG (`'{sky.500}'`,
`'{indigo.500}'`). Não renomeie tokens e não remova degraus da escala — os
componentes dependem dos onze valores.

Para gerar a escala 50–950 a partir de uma cor, use a ferramenta em
https://primeng.org/theming/styled.

O preset atual usa **sky** como placeholder. Está marcado com `TODO(marca)`.

---

## Ordem das cascade layers

Declarada em `app.config.ts`:

```ts
cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' }
```

É isso que faz `class="w-72"` sobrescrever a largura padrão de um `<p-select>`
sem `!important`. **Se você precisou de `!important`, algo está errado** — quase
sempre é o `styleClass` sendo aplicado no elemento errado.

Em componentes PrimeNG, classes utilitárias vão em **`styleClass`**, não em
`class`, quando o alvo é o elemento raiz interno do componente.

---

## Tipografia e espaçamento

Fonte **Inter**, carregada no `index.html`, aplicada no `body`.

| Uso | Classes |
| --- | --- |
| Título de página (`h1`) | `text-2xl font-semibold text-color` |
| Título de seção (`h2`) | `text-lg font-medium text-color` |
| Rótulo de campo | `font-medium text-color` |
| Texto de apoio | `text-sm text-muted-color` |

Espaçamento: escala Tailwind padrão. Convenções do DS —
`gap-4` entre campos de formulário, `gap-2` entre rótulo e campo,
`mb-6` após o cabeçalho da página, `p-4` interno de card.
