# Informatiza DS — Contrato para agentes de IA

Você vai gerar **telas Angular** para a Informatiza a partir de um documento de
requisitos. Este arquivo é a fonte da verdade. Em caso de conflito entre este
documento e qualquer outra referência, **este documento vence**.

---

## 1. Ordem de leitura obrigatória

Leia nesta ordem, antes de escrever qualquer código:

1. Este arquivo, inteiro.
2. `docs/03-componentes.md` — qual componente usar para cada necessidade.
3. O template de referência mais próximo da tela pedida (seção 4 abaixo).
4. Só então o documento de requisitos do usuário.

Se precisar da API detalhada de um componente PrimeNG, consulte
`referencia/primeng/components/<componente>.md`. **Não invente propriedades.**

---

## 2. Stack — versões fixas, não substitua

| Item | Versão | Observação |
| --- | --- | --- |
| Angular | 21.2 | **zoneless** — sem `zone.js` |
| PrimeNG | 21.1 | licença MIT |
| @primeuix/themes | 3.0 | preset Aura customizado |
| PrimeIcons | 8.0 | classes `pi pi-*` |
| Tailwind CSS | 4.3 | via `@tailwindcss/postcss` |
| tailwindcss-primeui | 0.6 | utilitários `bg-primary`, `text-muted-color` |
| TypeScript | 5.9 | `strict` ligado |

**Proibido adicionar:** Angular Material, Bootstrap, PrimeFlex, styled-components,
qualquer biblioteca de ícones que não seja PrimeIcons, qualquer lib de estado
(NgRx, Akita) e `@angular/animations` (o PrimeNG 21 usa `@primeuix/motion`).

---

## 3. Regras invioláveis

Cada regra abaixo já está aplicada nos templates. Se sua tela violar alguma,
ela está errada.

### Angular

1. **Standalone sempre.** Nunca gere `NgModule`.
2. **Signals para estado.** `signal()` para estado próprio, `computed()` para
   qualquer valor derivado. Nunca chame método no template para derivar dado.
3. **`inject()`**, nunca injeção por construtor.
4. **Control flow novo:** `@if`, `@for`, `@switch`. Nunca `*ngIf` / `*ngFor`.
5. **`@for` sempre com `track`.**
6. **Rotas com `loadComponent`** (lazy). Nunca import estático de tela.
7. Parâmetros de rota chegam por **`input()`**, não por `ActivatedRoute`.
8. Um componente por arquivo, **template inline** com backticks.
9. Nomes de arquivo em `kebab-case.ts`; classe em `PascalCase` sem sufixo
   `Component` (padrão do Angular 21).

### Estilo

10. **Layout com utilitários Tailwind.** Não escreva `styleUrl` nem bloco
    `styles` a menos que seja realmente impossível.
11. **Nunca cor fixa.** Nada de `#hex`, `rgb()` ou `text-blue-500` para cores de
    marca. Use os tokens: `bg-primary`, `text-primary`, `text-color`,
    `text-muted-color`, `bg-surface-0`, `border-surface`, `rounded-border`.
12. **Todo bloco com fundo precisa do par claro/escuro:**
    `bg-surface-0 dark:bg-surface-900`.
13. **Mobile-first.** Sempre `grid-cols-1` subindo para `sm:` / `md:` / `lg:`.
    Colunas secundárias de tabela escondem com `hidden md:table-cell`.

### UX obrigatória

14. **Todo formulário** usa `ReactiveFormsModule` tipado
    (`fb.nonNullable.group`). Nunca `ngModel` solto em formulário.
15. **Todo campo** tem `<label for="...">` ligado ao `id` / `inputId` do controle.
16. **Toda tabela** implementa `#emptymessage` (estado vazio).
17. **Toda ação destrutiva** passa por `ConfirmationService`.
18. **Todo resultado de ação** (sucesso ou erro) emite toast via `MessageService`.
19. **Todo botão só com ícone** tem `ariaLabel` e `pTooltip`.
20. **Todo texto visível em português do Brasil.** Código, nomes de variáveis e
    comentários também em português.

---

## 4. Templates de referência — copie, não invente

Antes de criar uma tela, identifique o tipo e **copie a estrutura** do arquivo
correspondente. Eles existem para serem clonados.

| Tela pedida | Copie de |
| --- | --- |
| Listagem, consulta, grid, pesquisa | `starter/src/app/features/clientes/clientes-lista.ts` |
| Cadastro, edição, formulário | `starter/src/app/features/clientes/cliente-form.ts` |
| Dashboard, painel, indicadores, KPIs | `starter/src/app/features/dashboard/dashboard.ts` |
| Menu, topbar, navegação | `starter/src/app/core/layout/app-shell.ts` |

---

## 5. Dados: não existe backend

Toda persistência é **`MockCollection` + `localStorage`**
(`starter/src/app/core/data/mock-collection.ts`).

Para cada entidade nova, gere **exatamente estes quatro arquivos**, seguindo
`core/data/cliente*` como modelo:

```
core/data/<entidade>.model.ts    → interface + rótulos/severidades + options
core/data/<entidade>.seed.ts     → 20 a 30 registros realistas em português
core/data/<entidade>s.service.ts → extends MockCollection, chave própria
```

Regras:

- A chave de `localStorage` é sempre `informatiza:<entidade>`.
- Toda entidade estende `Entity` (tem `id: string`).
- O service é `@Injectable({ providedIn: 'root' })` e **estende** `MockCollection`.
- As telas injetam o service. **Nunca** instanciam `MockCollection` direto.
- **Nunca** use `HttpClient`, `fetch` ou qualquer chamada de rede.

Dados de seed precisam ser plausíveis: nomes de empresas e pessoas brasileiras,
CNPJ/CPF formatados, cidades reais, datas coerentes. Não gere "Item 1", "Teste".

---

## 6. Como interpretar o documento de requisitos

Extraia, nesta ordem:

1. **Entidade e campos** → gere o `model.ts` e o `seed.ts`.
2. **Tipo de tela** → escolha o template na tabela da seção 4.
3. **Ações** (criar, editar, excluir, exportar, aprovar) → botões e rotas.
4. **Regras de validação** → validators no formulário.
5. **Filtros e buscas** → signals + `computed`.

Quando o requisito for omisso, **assuma o padrão do template** e siga em frente.
Não pare para perguntar sobre detalhe cosmético. Ao final da resposta, liste em
"Premissas adotadas" o que você decidiu por conta própria.

Pare e pergunte **apenas** se a entidade principal ou o objetivo da tela
estiverem ambíguos a ponto de tornar o trabalho inútil se você errar.

---

## 7. Onde colocar os arquivos gerados

```
starter/src/app/features/<entidade>/<entidade>-lista.ts
starter/src/app/features/<entidade>/<entidade>-form.ts
starter/src/app/core/data/<entidade>.model.ts
starter/src/app/core/data/<entidade>.seed.ts
starter/src/app/core/data/<entidade>s.service.ts
```

Depois **sempre**:

1. registre as rotas em `starter/src/app/app.routes.ts` (com `loadComponent`);
2. adicione o item de menu no array `nav` de `core/layout/app-shell.ts`.

Uma tela que não está no menu e na rota está incompleta.

---

## 8. Antes de entregar

Rode mentalmente o `docs/07-checklist.md`. O mínimo:

- [ ] Compila sem erro de tipo (`npm run build` em `starter/`)
- [ ] Zero `*ngIf` / `*ngFor` / `NgModule` / injeção por construtor
- [ ] Zero cor fixa em hex
- [ ] Funciona em claro e escuro
- [ ] Funciona em 375px de largura
- [ ] Tabela tem estado vazio; formulário tem validação e mensagens
- [ ] Rota registrada e item no menu
- [ ] Todo texto em português
