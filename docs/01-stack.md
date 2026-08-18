# Stack e convenções

## Versões

Verificadas com build real em 18/08/2026.

| Pacote | Versão |
| --- | --- |
| `@angular/core` | 21.2 |
| `@angular/cdk` | 21.x |
| `primeng` | 21.1.9 |
| `@primeuix/themes` | 3.0 |
| `primeicons` | 8.0 |
| `tailwindcss` | 4.3 |
| `@tailwindcss/postcss` | 4.3 |
| `tailwindcss-primeui` | 0.6 |
| `typescript` | 5.9 |

## Licença — por que a versão 21

O PrimeNG tem duas licenças. A **versão corrente é sempre MIT e gratuita**; as
versões antigas viram `-lts` e passam a exigir **licença comercial paga**.

| Versão | Status |
| --- | --- |
| v21 | STS — open source, MIT |
| v20, v19 | LTS — comercial |
| v18 e anteriores | Legacy — comercial |

Ou seja: **v21 é a escolha livre de custo.** Descer para v19 ou v20 criaria a
obrigação de licença. Texto integral em `referencia/primeng/LICENSE-PRIMENG.md`.

## Comandos

```bash
cd starter
npm install
npm start        # http://localhost:4200
npm run build    # build de produção — precisa passar antes de entregar
```

---

## Decisões de arquitetura

**Zoneless.** O Angular 21 dispensa `zone.js`. Por isso o estado é todo em
signals — sem eles a tela não atualiza. Não instale `zone.js`.

**Sem `@angular/animations`.** O PrimeNG 21 migrou para `@primeuix/motion`.
Vários tutoriais ainda mandam chamar `provideAnimationsAsync()`; aqui isso
**quebra o build**. Não adicione.

**Locale pt-BR global.** Registrado em `app.config.ts` via `registerLocaleData`
mais `LOCALE_ID`. Por isso `| currency: 'BRL'` e `| date: 'dd/MM/yyyy'` bastam,
sem repetir o locale em cada pipe.

**CSS puro, não SCSS.** O Tailwind v4 processa via PostCSS; passar por Sass
quebra os `@import` do Tailwind e do `tailwindcss-primeui`. O arquivo global é
`src/styles.css`.

**Cascade layers.** `order: 'theme, base, primeng, utilities'` em
`app.config.ts` faz utilitário Tailwind vencer estilo de componente sem
`!important`.

---

## Estrutura de pastas

```
starter/src/app/
├── app.ts               raiz mínima, só <router-outlet>
├── app.config.ts        providers: tema, locale, router, PrimeNG
├── app.routes.ts        todas as rotas, sempre lazy
├── core/
│   ├── theme/           preset + serviço de tema claro/escuro
│   ├── data/            models, seeds, services (MockCollection)
│   └── layout/          app-shell (topbar, menu, toast, confirm)
└── features/
    └── <entidade>/      uma pasta por entidade
        ├── <entidade>-lista.ts
        └── <entidade>-form.ts
```

`core/` é infraestrutura compartilhada. `features/` são as telas. Uma feature
**nunca** importa de outra feature — o que for comum sobe para `core/`.

---

## Nomenclatura

| Item | Padrão | Exemplo |
| --- | --- | --- |
| Arquivo | kebab-case | `pedido-form.ts` |
| Classe | PascalCase, **sem** sufixo `Component` | `PedidoForm` |
| Service | PascalCase + `Service` | `PedidosService` |
| Selector | `app-` + kebab-case | `app-pedido-form` |
| Signal | camelCase, sem prefixo | `busca`, `salvando` |
| Signal privado de escrita | `_` + camelCase | `_items` |
| Rota | plural, kebab-case | `/pedidos`, `/pedidos/novo` |
| Chave localStorage | `informatiza:` + plural | `informatiza:pedidos` |

Código, variáveis e comentários em **português**. Palavras-chave de framework
(`signal`, `computed`, `input`) permanecem em inglês, naturalmente.

---

## Visibilidade de membros

- `protected` — usado no template
- `private` — só dentro da classe
- `readonly` — em tudo que não é reatribuído (praticamente todos os signals)

```ts
protected readonly service = inject(ClientesService);  // usado no template
private readonly router = inject(Router);              // só na classe
protected readonly busca = signal('');
```

---

## Servidor MCP do PrimeNG (opcional, recomendado)

O PrimeNG publica um servidor MCP que dá à IA acesso direto à documentação dos
componentes. Em ferramentas que suportam MCP, vale configurar:

```json
{
  "mcpServers": {
    "primeng": { "command": "npx", "args": ["-y", "@primeng/mcp@latest"] }
  }
}
```

Com ele, a pasta `referencia/primeng/` vira apenas plano B.
