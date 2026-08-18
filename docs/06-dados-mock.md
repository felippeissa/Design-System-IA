# Camada de dados (sem backend)

Não existe servidor. Toda persistência é `MockCollection` + `localStorage`.

A API de `MockCollection` foi desenhada para **espelhar um service HTTP real**:
métodos assíncronos que retornam `Promise`, estado de carregamento e de erro.
Quando existir backend, troca-se a implementação interna e **nenhuma tela muda**.

---

## Os três arquivos por entidade

Para cada entidade, sempre estes três — nem mais, nem menos:

```
core/data/<entidade>.model.ts      interface + rótulos + options
core/data/<entidade>.seed.ts       20 a 30 registros realistas
core/data/<entidade>s.service.ts   extends MockCollection
```

### 1. Model

```ts
import { Entity } from './mock-collection';

export type SituacaoPedido = 'rascunho' | 'aprovado' | 'cancelado';

export interface Pedido extends Entity {
    numero: string;
    cliente: string;
    valor: number;
    situacao: SituacaoPedido;
    emitidoEm: string;
}

/** Rótulo e severidade para <p-tag>. Evita @if encadeado no template. */
export const SITUACAO_PEDIDO: Record<
    SituacaoPedido,
    { label: string; severity: 'success' | 'danger' | 'warn' }
> = {
    rascunho: { label: 'Rascunho', severity: 'warn' },
    aprovado: { label: 'Aprovado', severity: 'success' },
    cancelado: { label: 'Cancelado', severity: 'danger' }
};

/** Pronto para <p-select> e <p-selectbutton>. */
export const SITUACAO_PEDIDO_OPTIONS = (
    Object.keys(SITUACAO_PEDIDO) as SituacaoPedido[]
).map((value) => ({ label: SITUACAO_PEDIDO[value].label, value }));
```

### 2. Seed

```ts
import { Pedido } from './pedido.model';

export const PEDIDOS_SEED: Pedido[] = [
    { id: 'ped-001', numero: '2024/0001', cliente: 'Aurora Tecnologia',
      valor: 12450.9, situacao: 'aprovado', emitidoEm: '2024-03-14' }
    // ... 20 a 30 registros
];
```

Dados precisam ser **plausíveis**: empresas e pessoas brasileiras, documentos
formatados, cidades reais, datas coerentes e distribuídas, valores variados.
Nunca "Item 1", "Teste", "Lorem ipsum".

### 3. Service

```ts
import { Injectable } from '@angular/core';
import { MockCollection } from './mock-collection';
import { Pedido } from './pedido.model';
import { PEDIDOS_SEED } from './pedido.seed';

@Injectable({ providedIn: 'root' })
export class PedidosService extends MockCollection<Pedido> {
    constructor() {
        super({ key: 'informatiza:pedidos', seed: PEDIDOS_SEED, latency: 300 });
    }

    restaurarSeed(): void {
        this.reset(PEDIDOS_SEED);
    }
}
```

A chave é sempre `informatiza:<entidade>`, no plural.

---

## API disponível

### Estado reativo (signals)

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `items()` | `T[]` | lista completa |
| `loading()` | `boolean` | operação em curso |
| `error()` | `string \| null` | mensagem do último erro |
| `total()` | `number` | quantidade de registros |

### Operações (Promise)

| Método | Retorno |
| --- | --- |
| `list()` | `Promise<T[]>` |
| `getById(id)` | `Promise<T \| undefined>` |
| `create(dados)` | `Promise<T>` — id gerado com `crypto.randomUUID()` |
| `update(id, mudancas)` | `Promise<T>` |
| `remove(id)` | `Promise<void>` |
| `reset(seed)` | `void` — descarta alterações locais |

---

## Como usar na tela

Injete o service e **derive** com `computed`. Nunca copie os dados para um signal
próprio — isso cria duas fontes da verdade e a tela para de atualizar sozinha.

```ts
export class PedidosLista {
    protected readonly service = inject(PedidosService);

    protected readonly busca = signal('');

    // Recalcula sozinho quando busca OU dados mudam.
    protected readonly filtrados = computed(() => {
        const termo = this.busca().trim().toLowerCase();
        return this.service.items().filter(
            (p) => !termo || p.numero.toLowerCase().includes(termo)
        );
    });
}
```

```html
<p-table [value]="filtrados()">
```

**Errado:**

```ts
// Não faça isso: congela os dados no momento da carga.
pedidos: Pedido[] = [];
async ngOnInit() { this.pedidos = await this.service.list(); }
```

---

## Ações que modificam dados

Sempre com feedback ao usuário:

```ts
protected async salvar(): Promise<void> {
    this.salvando.set(true);
    try {
        await this.service.create(this.form.getRawValue());
        this.messages.add({ severity: 'success', summary: 'Pedido criado' });
        void this.router.navigate(['/pedidos']);
    } catch {
        this.messages.add({
            severity: 'error',
            summary: 'Nao foi possivel salvar',
            detail: 'Tente novamente em instantes.'
        });
    } finally {
        this.salvando.set(false);
    }
}
```

Exclusão passa obrigatoriamente por `ConfirmationService` — ver
`clientes-lista.ts`, método `confirmarExclusao`.

---

## Relacionamentos entre entidades

Guarde o `id` da outra entidade e resolva com `computed`:

```ts
export interface Pedido extends Entity {
    clienteId: string;   // e não o objeto Cliente inteiro
}
```

```ts
private readonly clientes = inject(ClientesService);

protected readonly pedidosComCliente = computed(() => {
    const porId = new Map(this.clientes.items().map((c) => [c.id, c]));
    return this.service.items().map((p) => ({
        ...p,
        cliente: porId.get(p.clienteId)
    }));
});
```

---

## Limitações — deixe claro para quem for usar

- Dados vivem **no navegador**. Outro navegador ou aba anônima = dados zerados.
- Sem concorrência, sem multiusuário, sem controle de acesso real.
- `localStorage` tem limite de ~5 MB.
- Limpar dados do site apaga tudo. O botão "restaurar dados de demonstração" na
  listagem existe justamente para recuperar o estado inicial.
