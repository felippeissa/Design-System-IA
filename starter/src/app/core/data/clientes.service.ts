import { Injectable } from '@angular/core';
import { MockCollection } from './mock-collection';
import { Cliente } from './cliente.model';
import { CLIENTES_SEED } from './clientes.seed';

/**
 * Service de Clientes.
 *
 * PADRAO A SEGUIR para qualquer entidade nova: crie um service
 * `providedIn: 'root'` que estende MockCollection, com uma chave propria
 * no localStorage e o seed correspondente. As telas injetam este service
 * e nunca instanciam MockCollection diretamente.
 */
@Injectable({ providedIn: 'root' })
export class ClientesService extends MockCollection<Cliente> {
    constructor() {
        super({ key: 'informatiza:clientes', seed: CLIENTES_SEED, latency: 300 });
    }

    /** Restaura os dados de demonstracao. */
    restaurarSeed(): void {
        this.reset(CLIENTES_SEED);
    }
}
