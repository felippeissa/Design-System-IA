import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

import { ClientesService } from '../../core/data/clientes.service';
import { SITUACAO_CLIENTE, SituacaoCliente } from '../../core/data/cliente.model';

interface Indicador {
    titulo: string;
    valor: string;
    icone: string;
    // Classes de cor do bloco do icone. Sempre tokens, nunca hex.
    tom: string;
}

/**
 * TEMPLATE DE REFERENCIA: dashboard com indicadores.
 *
 * Padrao de KPI: grid responsivo de cards, cada um com rotulo, valor em
 * destaque e um icone com fundo tonal. Abaixo, uma tabela compacta com
 * os registros mais recentes.
 *
 * Todos os numeros derivam de `computed` sobre o service — nunca duplique
 * estado nem calcule dentro do template.
 */
@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, CurrencyPipe, CardModule, ButtonModule, TagModule, TableModule],
    template: `
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-color m-0">Dashboard</h1>
            <p class="text-muted-color mt-1 mb-0">Visao geral da carteira de clientes.</p>
        </div>

        <!-- Indicadores -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            @for (indicador of indicadores(); track indicador.titulo) {
                <div class="p-4 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-muted-color text-sm m-0">{{ indicador.titulo }}</p>
                            <p class="text-2xl font-semibold text-color mt-2 mb-0 truncate">{{ indicador.valor }}</p>
                        </div>
                        <span class="w-10 h-10 shrink-0 rounded-border grid place-items-center" [class]="indicador.tom">
                            <i [class]="indicador.icone"></i>
                        </span>
                    </div>
                </div>
            }
        </div>

        <!-- Cadastros recentes -->
        <div class="rounded-border border border-surface bg-surface-0 dark:bg-surface-900 overflow-hidden">
            <div class="flex items-center justify-between gap-3 p-4 border-b border-surface">
                <h2 class="text-lg font-medium text-color m-0">Cadastros recentes</h2>
                <p-button label="Ver todos" icon="pi pi-arrow-right" iconPos="right" [text]="true" routerLink="/clientes" />
            </div>

            <p-table [value]="recentes()" dataKey="id">
                <ng-template #header>
                    <tr>
                        <th>Cliente</th>
                        <th class="hidden md:table-cell">Cidade / UF</th>
                        <th class="text-right hidden sm:table-cell">Limite</th>
                        <th>Situacao</th>
                    </tr>
                </ng-template>

                <ng-template #body let-cliente>
                    <tr>
                        <td>
                            <div class="font-medium text-color">{{ cliente.nome }}</div>
                            <div class="text-sm text-muted-color">{{ cliente.email }}</div>
                        </td>
                        <td class="hidden md:table-cell">{{ cliente.cidade }} / {{ cliente.uf }}</td>
                        <td class="text-right hidden sm:table-cell">
                            {{ cliente.limiteCredito | currency: 'BRL' }}
                        </td>
                        <td>
                            <p-tag
                                [value]="rotuloSituacao(cliente.situacao)"
                                [severity]="severidadeSituacao(cliente.situacao)"
                            />
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4">
                            <div class="flex flex-col items-center gap-3 py-12 text-center">
                                <i class="pi pi-inbox text-4xl text-muted-color"></i>
                                <p class="text-muted-color m-0">Nenhum cliente cadastrado ainda.</p>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class Dashboard {
    private readonly service = inject(ClientesService);

    private readonly ativos = computed(() => this.service.items().filter((c) => c.situacao === 'ativo').length);
    private readonly pendentes = computed(() => this.service.items().filter((c) => c.situacao === 'pendente').length);
    private readonly limiteTotal = computed(() =>
        this.service.items().reduce((soma, cliente) => soma + cliente.limiteCredito, 0)
    );

    protected readonly indicadores = computed<Indicador[]>(() => [
        {
            titulo: 'Total de clientes',
            valor: String(this.service.total()),
            icone: 'pi pi-users',
            tom: 'bg-primary-50 text-primary dark:bg-primary-400/10'
        },
        {
            titulo: 'Clientes ativos',
            valor: String(this.ativos()),
            icone: 'pi pi-check-circle',
            tom: 'bg-green-50 text-green-600 dark:bg-green-400/10 dark:text-green-400'
        },
        {
            titulo: 'Pendentes',
            valor: String(this.pendentes()),
            icone: 'pi pi-clock',
            tom: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400'
        },
        {
            titulo: 'Limite concedido',
            valor: this.limiteTotal().toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0
            }),
            icone: 'pi pi-wallet',
            tom: 'bg-surface-100 text-color dark:bg-surface-800'
        }
    ]);

    protected readonly recentes = computed(() =>
        [...this.service.items()].sort((a, b) => b.cadastradoEm.localeCompare(a.cadastradoEm)).slice(0, 5)
    );

    protected rotuloSituacao(situacao: SituacaoCliente): string {
        return SITUACAO_CLIENTE[situacao].label;
    }

    protected severidadeSituacao(situacao: SituacaoCliente): 'success' | 'danger' | 'warn' {
        return SITUACAO_CLIENTE[situacao].severity;
    }
}
