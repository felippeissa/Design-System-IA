# Registro de versões

Log dos deploys do Informatiza DS. Cada versão corresponde a uma tag anotada no
Git — use `git tag -n99` para ler as descrições no terminal.

---

## v0.1.0 — "Fundação" · 18/08/2026

Primeiro deploy. Entrega a base do design system e o fluxo de autenticação
completo, com o projeto compilando e todas as telas verificadas no navegador.

### Contrato para IA

- `AGENTS.md` com 21 regras invioláveis, stack travada por versão, tabela de
  "tipo de tela → template a copiar" e instruções de leitura de requisitos.
  Replicado em `CLAUDE.md`, `.cursorrules` e `.github/copilot-instructions.md`,
  que são os arquivos que cada ferramenta lê nativamente.
- `llms.txt` como índice no padrão llms.txt.
- Nove documentos em `docs/`: stack, tokens, catálogo de componentes, layout,
  formulários, dados mock, checklist de entrega, marca e fluxo de login.
- `requisitos/TEMPLATE.md`, o formato de entrada esperado, com exemplo
  preenchido.
- `referencia/primeng/`: 98 arquivos de documentação por componente mais 16
  guias, redistribuídos sob a licença MIT do PrimeNG.

O núcleo lido a cada execução soma cerca de 55 KB, o que cabe folgado no contexto
de qualquer modelo. A documentação de componente é consultada sob demanda.

### Aplicação

- Angular 21.2 **zoneless**, PrimeNG 21.1, Tailwind CSS 4.3, TypeScript 5.9.
- Tema Aura customizado com primária **emerald**, claro e escuro, trocáveis em
  um único arquivo.
- Locale pt-BR registrado globalmente.
- `MockCollection`: persistência em `localStorage` com API assíncrona que
  espelha um service HTTP, para que a troca por backend real não altere as telas.

### Telas de referência

Listagem CRUD, formulário criar/editar, dashboard com indicadores, shell da
aplicação, layout público e as cinco telas do fluxo de login: `signin`,
`terms-of-use`, `consent`, `profile` e `organization-profile`.

### Identidade visual

Favicon com o brasão de Goiás gerado a partir do original em 1200×1606, em `ico`
multi-resolução mais PNG 32/192 e apple-touch-icon. Logo do header em duas
variantes, clara e escura.

Os SVGs exportados do Figma pesavam 630 KB cada porque traziam o brasão como
raster base64 dentro de um `<pattern>`. Extraindo o raster, reduzindo para 3× o
tamanho de exibição e remontando o SVG com o traçado vetorial do texto, cada
variante caiu para **19,6 KB**.

### Correções feitas durante a verificação no navegador

Nenhuma destas apareceria sem executar de fato:

- `provideAnimationsAsync()` quebra o build no PrimeNG 21, que migrou para
  `@primeuix/motion`. A documentação oficial de instalação ainda o recomenda.
- SCSS quebra o Tailwind v4; o projeto passou a usar CSS puro.
- `NG0701` em runtime: `CurrencyPipe` e `DatePipe` exigem `registerLocaleData`.
- `borderRadius` é token primitivo, não semântico, no `definePreset`.
- `currentColor` não atravessa `<img>` — verificado renderizando um SVG com
  `fill="currentColor"` em contexto vermelho, que saiu preto. Daí as duas
  variantes do logo em vez de uma adaptativa.
- Centralização com `flex items-center justify-center` fazia o card encolher
  conforme o conteúdo: `profile` renderizava 387px e `organization-profile`
  416px com o mesmo `max-w`. Corrigido com `flex-col justify-center`.
- `styleClass="flex-1"` não faz o botão preencher: a classe cai no `<button>`,
  que não é o filho flex do container. Precisa de `class="flex-1"` no host.
- A linha "Mantenha-me conectado" / "Recuperar senha" somava 355px num espaço de
  352px e quebrava por 3px.
- `bg-surface-950` resolve para slate-950, azul-marinho, deixando a barra
  superior azulada no tema claro.

### Removido antes do deploy

A barra de acessibilidade gov.br (A− / A / A+, alto contraste e diálogo de
ajuda) foi implementada e removida a pedido. O código permanece no histórico,
no commit `dc1a41a`.

### Pendências

- Marcas **ID Goiás** e **gov.br** não fornecidas como asset; os botões de
  provedor externo estão apenas com o rótulo.
- Rotas `recuperar-senha`, `politica-de-cookie` e `politica-de-privacidade`
  ainda não existem; os links do rodapé caem no curinga.
- Sem guarda de rota, porque não há autenticação real.
