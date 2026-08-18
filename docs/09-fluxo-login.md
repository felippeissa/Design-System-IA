# Fluxo de autenticação

Cinco telas públicas, fora da aplicação logada.

| Rota | Tela |
| --- | --- |
| `/login/signin` | entrada: usuário, senha e provedores externos |
| `/login/terms-of-use` | aceite dos termos de uso |
| `/login/consent` | consentimento de compartilhamento de dados |
| `/login/profile` | escolha de perfil |
| `/login/organization-profile` | escolha de órgão e perfil |

Encadeamento: `signin` → `terms-of-use` → `consent` → `organization-profile` → `/`.
A tela `profile` é a variante de um nível, para quando o usuário pertence a um
único órgão.

---

## Layout público

`core/layout/auth-layout.ts` é o equivalente do `AppShell` para telas públicas.
Não tem menu nem topbar — apenas o fundo e um card centralizado. Declara o
`<p-toast>` uma única vez.

Toda tela nova que ficar **fora** da área logada (recuperação de senha, política
de privacidade, erro 403) entra como filha dele.

### Centralização: use `flex-col justify-center`

O container é `min-h-screen flex flex-col justify-center`. A escolha da direção
não é estética:

- **`flex flex-col justify-center`** centraliza na vertical e mantém o eixo
  horizontal em `align-items: stretch`. O card ocupa a largura disponível e o
  `max-w` dele define o tamanho final. **Correto.**
- `flex items-center justify-center` transforma o card em item flex no eixo
  horizontal, e ele encolhe conforme o conteúdo. Duas telas com o mesmo `max-w`
  acabam com larguras diferentes. **Errado** — foi exatamente o que aconteceu:
  `profile` renderizava 387px e `organization-profile` 416px com a mesma classe.

---

## O card

`features/login/auth-card.ts` traz logo e moldura. O conteúdo entra por projeção:

```html
<app-auth-card largura="max-w-[28rem]">
    <!-- conteúdo da tela -->
</app-auth-card>
```

O host declara `class: 'block w-full'`. Sem isso o elemento fica inline e
encolhe, e o `max-w` da `<section>` nunca governa.

Larguras em uso: `26rem` para escolha simples, `28rem` para login e
consentimento, `47rem` para os termos.

---

## Botões que dividem a largura igualmente

O padrão é `flex-1` no **host** `<p-button>` e `w-full` no `<button>` interno:

```html
<div class="flex gap-3">
    <p-button label="Cancelar" [outlined]="true" class="flex-1" styleClass="w-full" />
    <p-button label="Continuar" class="flex-1" styleClass="w-full" />
</div>
```

Só um dos dois não basta. `styleClass` aplica a classe no `<button>`, que **não**
é o filho flex do container — o filho é o host `<p-button>`. Por isso `flex-1`
precisa ir em `class`.

Quando o rótulo é longo, a largura do card tem que comportar o **maior** deles,
já que `flex-1` iguala os dois. Nos termos, o botão "Li e não concordo com os
termos de uso" pede 332px; em `44rem` cada um recebia 313px e o texto quebrava em
duas linhas. Daí `47rem` mais `whitespace-nowrap`.

---

## Estado do fluxo

`core/data/login.service.ts` guarda o que foi escolhido em cada etapa, em
`localStorage`, sob a chave `informatiza:login`.

**Não é autenticação.** Não há backend, não há validação de credencial e nada
protege rota nenhuma. Não existem guardas de rota, de propósito: qualquer tela do
fluxo é acessível diretamente pela URL, o que facilita revisar o visual.

Quando houver provedor de identidade real, troque a implementação dos métodos
mantendo a mesma superfície pública — as telas não mudam.

---

## Padrões que estas telas estabelecem

**Lista de permissões com "selecionar todas"** (`consent.ts`): o estado do
checkbox mestre é **derivado** dos filhos via `computed`, com `indeterminate`
para o caso parcial. Nunca guarde o estado do mestre em paralelo — as duas
fontes divergem. Itens obrigatórios ficam marcados, desabilitados e com `*`; ao
desmarcar tudo, eles permanecem.

**Texto longo com decisão binária** (`terms-of-use.ts`): `<p-scrollpanel>` de
altura fixa, com a área de texto e a linha de ações na mesma largura.

**Escolha de contexto** (`organization-profile.ts`): selects com validação,
lembrete de preferência e par cancelar/continuar dividindo a largura.

**Par de itens numa linha só** (`signin.ts`): "Mantenha-me conectado" e
"Recuperar senha" não usam `flex-wrap`. O rótulo da esquerda recebe `truncate`
com `min-w-0`, e o link da direita `whitespace-nowrap shrink-0` — assim o texto
longo encolhe antes de a linha quebrar.

---

## Pendências conhecidas

As marcas **ID Goiás** e **gov.br** não foram fornecidas como asset. Os botões de
provedor externo estão só com o rótulo. Quando os arquivos chegarem, entram como
`<img>` antes do texto, seguindo `docs/08-marca.md`.

Os links de rodapé de `signin` (`/login/recuperar-senha`,
`/login/politica-de-cookie`, `/login/politica-de-privacidade`) apontam para rotas
**ainda não criadas** — hoje caem no redirecionamento curinga.

A barra de acessibilidade gov.br (A− / A / A+, alto contraste) foi implementada e
depois removida a pedido. O código está no histórico, no commit `dc1a41a`, caso
precise voltar.
