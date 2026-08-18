# Informatiza DS

Design system e base de código para gerar telas **Angular 21 + PrimeNG 21** com
assistentes de IA (Claude, GPT, Gemini) a partir de um documento de requisitos.

O objetivo é simples: você entrega o link deste repositório mais um requisito, e
a IA produz uma tela que já segue os padrões da casa — sem backend, rodando com
dados simulados.

---

## Como usar

**1.** Escreva o requisito usando [`requisitos/TEMPLATE.md`](requisitos/TEMPLATE.md).

**2.** Abra a IA e mande algo como:

> Leia o repositório https://github.com/<org>/informatiza-ds, começando pelo
> arquivo `AGENTS.md`, e siga as regras dele.
> Depois gere a tela descrita no requisito abaixo.
>
> [cole o requisito]

**3.** Cole os arquivos gerados no projeto e rode:

```bash
cd starter
npm install
npm start
```

Abra http://localhost:4200.

---

## Estrutura

| Pasta | O que é |
| --- | --- |
| `AGENTS.md` | **O contrato.** Regras que a IA deve seguir. Comece por aqui. |
| `docs/` | Detalhamento: stack, tokens, componentes, layout, formulários, dados |
| `starter/` | Aplicação Angular funcional com as telas de referência |
| `referencia/primeng/` | Documentação oficial do PrimeNG otimizada para LLM |
| `requisitos/` | Modelo de documento de requisitos |

### Documentação

| Arquivo | Assunto |
| --- | --- |
| [`docs/01-stack.md`](docs/01-stack.md) | versões, licença, arquitetura, nomenclatura |
| [`docs/02-tokens.md`](docs/02-tokens.md) | cores, tema claro/escuro, tipografia |
| [`docs/03-componentes.md`](docs/03-componentes.md) | qual componente usar em cada caso |
| [`docs/04-layout.md`](docs/04-layout.md) | shell, grid, responsividade, estados |
| [`docs/05-formularios.md`](docs/05-formularios.md) | reactive forms, validação, máscaras |
| [`docs/06-dados-mock.md`](docs/06-dados-mock.md) | persistência sem backend |
| [`docs/07-checklist.md`](docs/07-checklist.md) | verificação antes de entregar |
| [`docs/08-marca.md`](docs/08-marca.md) | logo, favicon e regras de uso da marca |
| [`docs/09-fluxo-login.md`](docs/09-fluxo-login.md) | telas públicas, barra de acessibilidade, fluxo de acesso |

### Telas de referência

São o material que a IA copia. Estão em `starter/src/app/`:

| Tela | Arquivo |
| --- | --- |
| Listagem CRUD | `features/clientes/clientes-lista.ts` |
| Formulário | `features/clientes/cliente-form.ts` |
| Dashboard | `features/dashboard/dashboard.ts` |
| Shell da aplicação | `core/layout/app-shell.ts` |
| Layout público + barra gov.br | `core/layout/auth-layout.ts` |
| Fluxo de login (5 telas) | `features/login/` |

---

## Stack

Angular 21.2 (zoneless) · PrimeNG 21.1 · PrimeIcons 8 · Tailwind CSS 4 ·
TypeScript 5.9 · tema Aura customizado.

Sem backend: os dados vivem em `localStorage` através de `MockCollection`, com
uma API assíncrona que imita um service HTTP. Quando existir backend de verdade,
troca-se a implementação do service e as telas não mudam.

---

## Licença

O PrimeNG mantém a **versão corrente sob MIT**; versões antigas viram `-lts` e
exigem licença comercial. Por isso este projeto usa a **v21**, que é a livre de
custo. Descer para v19 ou v20 criaria obrigação de licenciamento.

A documentação em `referencia/primeng/` é redistribuída sob a licença MIT do
PrimeNG (© PrimeTek), preservada em
[`referencia/primeng/LICENSE-PRIMENG.md`](referencia/primeng/LICENSE-PRIMENG.md).

Componentes do **PrimeUI Pro** (Scheduler, TextEditor, TaskBoard, Charts Pro)
são produto comercial à parte e **não** estão cobertos aqui.

---

## Personalizando a marca

As cores são placeholder. Para aplicar a identidade da Informatiza, edite apenas
o bloco `primary` em
`starter/src/app/core/theme/informatiza-preset.ts` — está marcado com
`TODO(marca)`. Nenhuma tela precisa ser tocada, porque nenhuma tela tem cor fixa.
