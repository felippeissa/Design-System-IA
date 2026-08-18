# Layout e estrutura de tela

Referência viva: `starter/src/app/core/layout/app-shell.ts`.

---

## O shell

Toda tela é filha de `AppShell` e renderiza no `<router-outlet>` dele. Isso dá
de graça: topbar, navegação, alternador de tema, `<p-toast>` e
`<p-confirmdialog>`.

`<p-toast>` e `<p-confirmdialog>` são declarados **uma única vez**, no shell.
Declarar de novo numa tela causa notificação duplicada.

O shell é: topbar fixa de 64px, navegação lateral de 240px (vira `<p-drawer>`
abaixo de `lg`), e `<main class="flex-1 min-w-0 p-4 sm:p-6">`.

`min-w-0` no `<main>` não é decoração — sem ele, uma tabela larga estoura o
layout em vez de rolar.

---

## Cabeçalho de página

Primeiro bloco de toda tela:

```html
<div class="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
        <h1 class="text-2xl font-semibold text-color m-0">Clientes</h1>
        <p class="text-muted-color mt-1 mb-0">24 registros cadastrados</p>
    </div>
    <p-button label="Novo cliente" icon="pi pi-plus" routerLink="/clientes/novo" />
</div>
```

`flex-wrap` para o botão descer no celular em vez de espremer o título.
Uma única ação primária por tela.

Em tela de detalhe/formulário, o cabeçalho leva botão de voltar:

```html
<div class="flex items-center gap-3 mb-6">
    <p-button icon="pi pi-arrow-left" severity="secondary" [text]="true"
              [rounded]="true" routerLink="/clientes"
              ariaLabel="Voltar para a listagem" />
    <div>
        <h1 class="text-2xl font-semibold text-color m-0">{{ titulo() }}</h1>
    </div>
</div>
```

---

## Breakpoints

Tailwind padrão, sempre mobile-first:

| Prefixo | A partir de | Uso típico |
| --- | --- | --- |
| (nenhum) | 0 | celular — tudo empilhado |
| `sm:` | 640px | celular deitado |
| `md:` | 768px | tablet — grid começa |
| `lg:` | 1024px | desktop — menu lateral fixo |
| `xl:` | 1280px | telas largas |

**375px é o piso.** Toda tela precisa funcionar nessa largura.

---

## Grid

```html
<!-- Cards de indicador -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

<!-- Formulário: 12 colunas -->
<div class="grid grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-8">...</div>
    <div class="col-span-12 md:col-span-4">...</div>
</div>

<!-- Conteúdo principal + barra lateral -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2">...</div>
    <div>...</div>
</div>
```

---

## Tabela responsiva

Não existe tabela de 8 colunas legível em 375px. A estratégia é **esconder
colunas secundárias por breakpoint**, mantendo identificação e ação sempre
visíveis:

```html
<th>Nome</th>                              <!-- sempre -->
<th class="hidden md:table-cell">CNPJ</th>
<th class="hidden lg:table-cell">Cidade</th>
<th class="hidden xl:table-cell">Cadastro</th>
<th>Situacao</th>                          <!-- sempre -->
<th class="w-28 text-center">Acoes</th>    <!-- sempre -->
```

Use `hidden md:table-cell` (não `md:block`) — `block` quebra a tabela.

O que some da coluna pode voltar como linha secundária na coluna principal:

```html
<td>
    <div class="font-medium text-color">{{ cliente.nome }}</div>
    <div class="text-sm text-muted-color">{{ cliente.email }}</div>
</td>
```

---

## Estados obrigatórios

Toda tela que carrega dados precisa dos três.

**Carregando** — esqueleto, não spinner:

```html
@if (service.loading() && service.total() === 0) {
    <div class="flex flex-col gap-2">
        @for (linha of [1, 2, 3, 4, 5]; track linha) {
            <p-skeleton height="3rem" />
        }
    </div>
} @else {
    <!-- conteúdo -->
}
```

**Vazio** — dentro de `#emptymessage`, com orientação do que fazer:

```html
<ng-template #emptymessage>
    <tr>
        <td colspan="7">
            <div class="flex flex-col items-center gap-3 py-12 text-center">
                <i class="pi pi-inbox text-4xl text-muted-color"></i>
                <div>
                    <p class="font-medium text-color m-0">Nenhum cliente encontrado</p>
                    <p class="text-muted-color text-sm mt-1 mb-0">
                        Ajuste os filtros ou cadastre um novo cliente.
                    </p>
                </div>
            </div>
        </td>
    </tr>
</ng-template>
```

O `colspan` precisa bater com o número de colunas.

**Erro** — `<p-message severity="error">` no lugar do conteúdo, ou toast se for
falha de ação pontual.

---

## Card padrão

```html
<div class="p-4 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
```

Use `<p-card>` quando precisar de header/footer estruturados; a `<div>` acima
quando for só um bloco com moldura.

---

## Barra de filtros

`<p-toolbar>` logo abaixo do cabeçalho, busca à esquerda, ações à direita:

```html
<p-toolbar styleClass="mb-4 border-surface">
    <ng-template #start>
        <div class="flex flex-wrap gap-3">
            <p-iconfield>
                <p-inputicon class="pi pi-search" />
                <input pInputText type="text" placeholder="Buscar..." class="w-72"
                       [ngModel]="busca()" (ngModelChange)="busca.set($event)" />
            </p-iconfield>
        </div>
    </ng-template>
    <ng-template #end>
        <p-button icon="pi pi-refresh" severity="secondary" [outlined]="true"
                  ariaLabel="Atualizar" />
    </ng-template>
</p-toolbar>
```

`flex-wrap` para os filtros quebrarem linha no celular.

Este é o **único** caso em que `ngModel` é aceito: filtro de tela, fora de
formulário. Em formulário, sempre reactive forms.

---

## Adicionando uma tela ao menu

Duas edições, nunca só uma:

```ts
// core/layout/app-shell.ts
protected readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
    { label: 'Clientes', icon: 'pi pi-users', route: '/clientes' },
    { label: 'Pedidos', icon: 'pi pi-shopping-cart', route: '/pedidos' }
];
```

```ts
// app.routes.ts
{
    path: 'pedidos',
    title: 'Pedidos | Informatiza',
    loadComponent: () => import('./features/pedidos/pedidos-lista').then((m) => m.PedidosLista)
}
```

O `title` da rota alimenta o título da aba do navegador.
