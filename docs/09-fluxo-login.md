# Fluxo de autenticação

Cinco telas públicas, fora da aplicação logada, seguindo o padrão dos portais do
Governo de Goiás.

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
Não tem menu nem topbar de aplicação — apenas a barra gov.br e um card
centralizado.

Toda tela nova que ficar **fora** da área logada (recuperação de senha, política
de privacidade, erro 403) entra como filha dele.

O card vem de `features/login/auth-card.ts`, que já traz logo e moldura. O
conteúdo entra por projeção:

```html
<app-auth-card largura="max-w-[52rem]">
    <!-- conteúdo da tela -->
</app-auth-card>
```

O padrão é `max-w-[26rem]`. Telas de texto longo usam mais largura.

---

## Barra de acessibilidade

Os controles são **funcionais**, não decorativos. Ficam em
`core/a11y/acessibilidade.service.ts`.

**A− / A / A+** alteram o `font-size` do `<html>` entre 14 e 22px. Como PrimeNG e
Tailwind medem tudo em `rem`, a interface inteira acompanha — componentes,
espaçamentos e bordas. Não existe CSS por tela para isso.

**Alto contraste** liga a classe `informatiza-contraste` no `<html>`. O CSS
correspondente, no fim de `styles.css`, sobrescreve os **tokens semânticos** em
vez de estilizar componente por componente: como tudo consome as mesmas
variáveis, a interface responde inteira.

Ambas as preferências persistem em `localStorage`.

Abaixo de `sm`, os rótulos "Alto contraste" e "Acessibilidade" colapsam em ícone.
Os cinco controles com texto não cabem em 360px e faziam a barra transbordar; o
`aria-label` preserva o significado.

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
altura fixa e as duas ações no rodapé, recusar como secundária.

**Escolha de contexto** (`organization-profile.ts`): selects com validação,
lembrete de preferência e par cancelar/continuar em largura igual (`flex-1`).

---

## Pendências conhecidas

As marcas **ID Goiás** e **gov.br** não foram fornecidas como asset. Os botões de
provedor externo estão só com o rótulo. Quando os arquivos chegarem, entram como
`<img>` antes do texto, seguindo `docs/08-marca.md`.

Os links de rodapé de `signin` (`/login/recuperar-senha`,
`/login/politica-de-cookie`, `/login/politica-de-privacidade`) apontam para rotas
**ainda não criadas** — hoje caem no redirecionamento curinga. São o próximo
passo natural do fluxo.
