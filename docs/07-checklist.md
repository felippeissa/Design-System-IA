# Checklist de entrega

Percorra antes de considerar a tela pronta. Cada item corresponde a um erro que
IAs cometem com frequência neste stack.

---

## Compilação

- [ ] `npm run build` passa sem erro em `starter/`
- [ ] Zero erro de tipo — nenhum `any` para calar o TypeScript
- [ ] Todo componente/diretiva usado está no array `imports` do `@Component`
- [ ] Todo pipe usado está importado (`CurrencyPipe`, `DatePipe`, …)

`imports` faltando é a causa nº 1 de falha. `<p-tag>` precisa de `TagModule`,
`pTooltip` precisa de `TooltipModule`, `routerLink` precisa de `RouterLink`.

---

## Angular moderno

- [ ] `@if` / `@for` / `@switch` — nenhum `*ngIf` ou `*ngFor`
- [ ] Todo `@for` tem `track`
- [ ] Componente standalone — nenhum `NgModule`
- [ ] `inject()` — nenhuma injeção por construtor
- [ ] Estado em `signal()`, derivados em `computed()`
- [ ] Nenhum método chamado no template para derivar dado
- [ ] Rota com `loadComponent`
- [ ] Parâmetro de rota via `input()`, não `ActivatedRoute`
- [ ] Nenhum `zone.js`, nenhum `provideAnimationsAsync()`

---

## Estilo

- [ ] Nenhuma cor em hex ou `rgb()`
- [ ] Nenhuma cor de marca via classe Tailwind crua (`bg-blue-500`)
- [ ] Todo fundo tem par claro/escuro (`bg-surface-0 dark:bg-surface-900`)
- [ ] Bordas com `border-surface`
- [ ] Raio com `rounded-border`
- [ ] Nenhum `!important`
- [ ] Nenhum `styleUrl` / bloco `styles` desnecessário
- [ ] Nenhum `::ng-deep`

Precisou de `!important` ou `::ng-deep`? Provavelmente o `styleClass` está no
elemento errado, ou existe um token/`dt` que resolve.

---

## Responsividade

- [ ] Funciona em **375px** sem rolagem horizontal
- [ ] Grid começa em `grid-cols-1` e cresce com `md:` / `lg:`
- [ ] Colunas secundárias de tabela com `hidden md:table-cell`
- [ ] Botão do cabeçalho não espreme o título (`flex-wrap`)
- [ ] Menu lateral vira drawer abaixo de `lg`

---

## Estados

- [ ] Carregamento inicial com `<p-skeleton>`
- [ ] Tabela tem `#emptymessage` com `colspan` correto
- [ ] Estado vazio orienta o próximo passo
- [ ] Erro tratado com toast ou `<p-message>`
- [ ] Botão de submit usa `[loading]`
- [ ] Registro inexistente tratado no formulário de edição
- [ ] Tela de leitura usa `<app-campo-exibicao>`, nunca `<input disabled>`
- [ ] Campo sem valor mostra "Não informado"

---

## Formulários

- [ ] `ReactiveFormsModule` tipado, `fb.nonNullable.group`
- [ ] Todo campo tem `<label for>` ligado a `id` / `inputId`
- [ ] Obrigatórios marcados com `*` no rótulo
- [ ] Erro só após tocar o campo ou tentar enviar
- [ ] `[invalid]` no controle quando há erro
- [ ] Mensagem de erro diz **como corrigir**, não só "campo inválido"
- [ ] `<form>` com `(ngSubmit)` e `novalidate`
- [ ] Submit inválido faz `markAllAsTouched()` e avisa
- [ ] Cancelar volta sem salvar
- [ ] Máscaras de CPF/CNPJ/CEP/telefone aplicadas

---

## Acessibilidade

- [ ] Botão só com ícone tem `ariaLabel` **e** `pTooltip`
- [ ] Hierarquia de títulos correta (um `h1` por tela)
- [ ] Informação não depende só de cor (tag tem texto, não só cor)
- [ ] Navegável por teclado
- [ ] Ícone decorativo não é a única fonte de significado

---

## Dados

- [ ] Nenhum `HttpClient`, `fetch` ou chamada de rede
- [ ] Service estende `MockCollection` com chave `informatiza:<entidade>`
- [ ] Seed com 20 a 30 registros **realistas em português**
- [ ] Sem "Item 1", "Teste", "Lorem ipsum"
- [ ] Telas leem de `service.items()`, sem copiar para signal próprio
- [ ] Escrita/exclusão emite toast via `NotificacaoService`
- [ ] Toast tem título E descrição; mensagens de sucesso usam o padrão
      `criado` / `atualizado` / `excluido`
- [ ] Exclusão passa por `ConfirmationService`

---

## Integração

- [ ] Rota registrada em `app.routes.ts` com `title`
- [ ] Item adicionado ao `nav` do `app-shell.ts`
- [ ] Arquivos nos caminhos corretos (`features/<entidade>/`, `core/data/`)
- [ ] Nenhuma feature importando de outra feature

---

## Marca

- [ ] Logo vem de `starter/public/`, nunca de texto ou placeholder
- [ ] Variante correta para o tema (clara/escura)
- [ ] Proporção preservada (`h-7 w-auto`)

---

## Idioma

- [ ] Todo texto visível em português do Brasil
- [ ] Datas `dd/MM/yyyy`, moeda `R$ 0.000,00`
- [ ] Nomes de variáveis, métodos e comentários em português

---

## Resposta ao usuário

- [ ] Lista os arquivos criados/alterados
- [ ] Seção **"Premissas adotadas"** com o que foi decidido sem o requisito dizer
- [ ] Aponta o que ficou fora do escopo, se houver
