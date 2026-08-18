# Toast

Alertas rápidos que **não interrompem** a navegação. Galeria interativa em
`/components/toast`.

> Nunca injete `MessageService` numa tela. Use sempre o `NotificacaoService`
> (`core/ui/notificacao.service.ts`) — é ele que garante estrutura, duração e
> limites de texto.

---

## Quando usar

Confirmações e avisos rápidos: "Cliente criado com sucesso", "Erro ao carregar
dados", "Campos obrigatórios não preenchidos".

Não use para decisão do usuário — isso é `ConfirmationService`. Nem para
mensagem que precisa permanecer na tela — isso é `<p-message>`.

---

## Como usar

```ts
private readonly notificacao = inject(NotificacaoService);

// Mensagens padronizadas
this.notificacao.criado('Cliente');      // "Cliente criado com sucesso."
this.notificacao.atualizado('Cliente');  // "Cliente atualizado com sucesso."
this.notificacao.excluido('Cliente');    // "Cliente excluído com sucesso."

// Texto próprio, com o título padrão da severidade
this.notificacao.sucesso('O relatório foi gerado e enviado por e-mail.');
this.notificacao.informacao('Os dados de demonstração foram restaurados.');
this.notificacao.atencao('Existem campos obrigatórios não preenchidos.');
this.notificacao.erro('Não foi possível salvar. Tente novamente.');

// Título personalizado, quando o padrão não serve
this.notificacao.informacao('Você será desconectado em 5 minutos.', 'Sessão expirando');
```

### Mensagens padronizadas

Sempre que o requisito **não** especificar o texto, use os três métodos de
padronização. Isso agiliza prototipação e desenvolvimento, e mantém o sistema
coerente.

| Ação | Método | Resultado |
| --- | --- | --- |
| Criação | `criado('Usuário')` | Usuário criado com sucesso. |
| Edição | `atualizado('Usuário')` | Usuário atualizado com sucesso. |
| Exclusão | `excluido('Usuário')` | Usuário excluído com sucesso. |

---

## Severidades

| Severidade | Título padrão | Quando |
| --- | --- | --- |
| `success` | Sucesso | Confirmação de ação bem-sucedida |
| `info` | Informação | Informações e avisos neutros |
| `warn` | Atenção | Atenção antes de ação, ou possível problema |
| `error` | Erro | Erros, falhas ou ações bloqueadas |

São **quatro**. O PrimeNG também aceita `secondary` e `contrast`, mas eles não
fazem parte das diretrizes deste design system.

---

## Regras do componente

**Duração:** 3000ms. Pode ser maior, nunca menor. Aplicada automaticamente.

**Largura:** fixa em 350px, com quebra de linha. A altura é adaptativa.
Configurada no `<p-toast>` do shell, não por tela.

**Estrutura: título + descrição, ambos obrigatórios.** Nunca dispare só com
título. O `NotificacaoService` recebe a descrição como primeiro argumento
justamente para tornar o esquecimento impossível.

**Título:** 1 linha, máximo 34 caracteres. Sem personalização, mantenha o padrão
da severidade.

**Descrição:** no máximo 2 linhas, 34 caracteres — na prática, até 81.

**Interação:** o toast não bloqueia. O usuário continua navegando com ele em tela.

**Posição:** canto superior direito. O `<p-toast>` é declarado **uma única vez**,
no `AppShell` e no `AuthLayout`. Declarar de novo numa tela duplica a notificação.

### Limites são verificados em desenvolvimento

Passar do limite não quebra o layout, porque a altura é adaptativa — mas
descaracteriza o componente. Por isso o service emite aviso no console quando o
texto estoura:

```
[Informatiza DS] Titulo do toast com 57 caracteres, acima do limite de 34: "..."
```

O aviso só roda em `isDevMode()`, sem custo em produção.

---

## Erros comuns

- Disparar só com título, sem descrição.
- Usar `MessageService` direto, o que ignora duração e limites.
- Declarar `<p-toast>` na tela, gerando notificação duplicada.
- Escrever "Cliente cadastrado" em vez de "Cliente criado com sucesso."
- Usar toast onde cabia `<p-message>`, para erro que precisa permanecer visível.
