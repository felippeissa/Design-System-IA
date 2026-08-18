import { computed, signal } from '@angular/core';

/** Toda entidade persistida precisa de um id string. */
export interface Entity {
    id: string;
}

/** Dados de criacao: a entidade sem o id (gerado pela colecao). */
export type NewOf<T extends Entity> = Omit<T, 'id'>;

export interface MockCollectionOptions<T extends Entity> {
    /** Chave no localStorage. Use o padrao "informatiza:<entidade>". */
    key: string;
    /** Registros iniciais, gravados apenas na primeira execucao. */
    seed: T[];
    /** Latencia simulada em ms, para exercitar estados de carregamento. */
    latency?: number;
}

/**
 * Colecao mock com persistencia em localStorage.
 *
 * Substitui o backend: expoe CRUD assincrono (Promise) e estado reativo
 * (signals). A assinatura dos metodos foi desenhada para espelhar um
 * service HTTP real, de modo que trocar por HttpClient no futuro nao
 * exija mudanca nas telas.
 *
 * Nao instancie diretamente nas telas: crie um service dedicado por
 * entidade (ver core/data/clientes.service.ts como referencia).
 */
export class MockCollection<T extends Entity> {
    private readonly _items = signal<T[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);

    /** Lista completa, reativa. */
    readonly items = this._items.asReadonly();
    /** true enquanto alguma operacao esta em curso. */
    readonly loading = this._loading.asReadonly();
    /** Mensagem do ultimo erro, ou null. */
    readonly error = this._error.asReadonly();
    /** Quantidade de registros. */
    readonly total = computed(() => this._items().length);

    private readonly key: string;
    private readonly latency: number;

    constructor(options: MockCollectionOptions<T>) {
        this.key = options.key;
        this.latency = options.latency ?? 250;
        this._items.set(this.read(options.seed));
    }

    /** Recarrega a colecao. Chame no ngOnInit da tela de listagem. */
    async list(): Promise<T[]> {
        return this.run(() => this._items());
    }

    async getById(id: string): Promise<T | undefined> {
        return this.run(() => this._items().find((item) => item.id === id));
    }

    async create(data: NewOf<T>): Promise<T> {
        return this.run(() => {
            const created = { ...data, id: crypto.randomUUID() } as T;
            this.commit([...this._items(), created]);
            return created;
        });
    }

    async update(id: string, changes: Partial<NewOf<T>>): Promise<T> {
        return this.run(() => {
            const current = this._items().find((item) => item.id === id);
            if (!current) {
                throw new Error(`Registro ${id} nao encontrado.`);
            }
            const updated = { ...current, ...changes } as T;
            this.commit(this._items().map((item) => (item.id === id ? updated : item)));
            return updated;
        });
    }

    async remove(id: string): Promise<void> {
        return this.run(() => {
            this.commit(this._items().filter((item) => item.id !== id));
        });
    }

    /** Descarta as alteracoes locais e volta aos dados de seed. */
    reset(seed: T[]): void {
        localStorage.removeItem(this.key);
        this.commit(seed);
    }

    // ----------------------------------------------------------------

    private async run<R>(operation: () => R): Promise<R> {
        this._loading.set(true);
        this._error.set(null);
        try {
            await this.delay();
            return operation();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro inesperado.';
            this._error.set(message);
            throw err;
        } finally {
            this._loading.set(false);
        }
    }

    private commit(items: T[]): void {
        this._items.set(items);
        localStorage.setItem(this.key, JSON.stringify(items));
    }

    private read(seed: T[]): T[] {
        const raw = localStorage.getItem(this.key);
        if (!raw) {
            localStorage.setItem(this.key, JSON.stringify(seed));
            return seed;
        }
        try {
            return JSON.parse(raw) as T[];
        } catch {
            return seed;
        }
    }

    private delay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, this.latency));
    }
}
