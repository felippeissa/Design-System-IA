import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ClientesService } from '../../core/data/clientes.service';
import { Cliente, SITUACAO_CLIENTE, SITUACAO_OPTIONS, SituacaoCliente } from '../../core/data/cliente.model';

/**
 * TEMPLATE DE REFERENCIA: listagem CRUD.
 *
 * Copie esta estrutura para qualquer tela de listagem. Ela cobre:
 * cabecalho de pagina, toolbar com busca e filtros, tabela paginada e
 * ordenavel, coluna de acoes, exclusao com confirmacao, estado de
 * carregamento (skeleton) e estado vazio.
 *
 * Regras:
 * - filtros sao signals + computed, nunca metodos chamados no template;
 * - a busca cobre os campos textuais relevantes da entidade;
 * - toda acao destrutiva passa por ConfirmationService;
 * - todo resultado de acao vira um toast via MessageService.
 */
@Component({
    selector: 'app-clientes-lista',
    imports: [
        RouterLink,
        FormsModule,
        CurrencyPipe,
        DatePipe,
        TableModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        SelectModule,
        TagModule,
        ToolbarModule,
        TooltipModule,
        SkeletonModule
    ],
    template: `
        <!-- Cabecalho da pagina -->
        <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-semibold text-color m-0">Clientes</h1>
                <p class="text-muted-color mt-1 mb-0">
                    {{ service.total() }} {{ service.total() === 1 ? 'registro cadastrado' : 'registros cadastrados' }}
                </p>
            </div>
            <p-button label="Novo cliente" icon="pi pi-plus" routerLink="/clientes/novo" />
        </div>

        <!-- Filtros -->
        <p-toolbar styleClass="mb-4 border-surface">
            <ng-template #start>
                <div class="flex flex-wrap gap-3">
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            placeholder="Buscar por nome, documento ou e-mail"
                            class="w-72"
                            [ngModel]="busca()"
                            (ngModelChange)="busca.set($event)"
                        />
                    </p-iconfield>

                    <p-select
                        [options]="situacaoOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todas as situacoes"
                        [showClear]="true"
                        class="w-56"
                        [ngModel]="situacao()"
                        (ngModelChange)="situacao.set($event)"
                    />
                </div>
            </ng-template>

            <ng-template #end>
                <p-button
                    icon="pi pi-refresh"
                    severity="secondary"
                    [outlined]="true"
                    pTooltip="Restaurar dados de demonstracao"
                    tooltipPosition="left"
                    ariaLabel="Restaurar dados"
                    (onClick)="restaurar()"
                />
            </ng-template>
        </p-toolbar>

        <!-- Tabela -->
        @if (service.loading() && service.total() === 0) {
            <div class="flex flex-col gap-2">
                @for (linha of [1, 2, 3, 4, 5]; track linha) {
                    <p-skeleton height="3rem" />
                }
            </div>
        } @else {
            <p-table
                [value]="clientesFiltrados()"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                [showCurrentPageReport]="true"
                styleClass="border border-surface rounded-border overflow-hidden"
            >
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="nome">Nome <p-sortIcon field="nome" /></th>
                        <th class="hidden md:table-cell">Documento</th>
                        <th class="hidden lg:table-cell">Cidade / UF</th>
                        <th pSortableColumn="limiteCredito" class="text-right hidden sm:table-cell">
                            Limite <p-sortIcon field="limiteCredito" />
                        </th>
                        <th pSortableColumn="cadastradoEm" class="hidden xl:table-cell">
                            Cadastro <p-sortIcon field="cadastradoEm" />
                        </th>
                        <th pSortableColumn="situacao">Situacao <p-sortIcon field="situacao" /></th>
                        <th class="w-28 text-center">Acoes</th>
                    </tr>
                </ng-template>

                <ng-template #body let-cliente>
                    <tr>
                        <td>
                            <div class="font-medium text-color">{{ cliente.nome }}</div>
                            <div class="text-sm text-muted-color">{{ cliente.email }}</div>
                        </td>
                        <td class="hidden md:table-cell">{{ cliente.documento }}</td>
                        <td class="hidden lg:table-cell">{{ cliente.cidade }} / {{ cliente.uf }}</td>
                        <td class="text-right hidden sm:table-cell">
                            {{ cliente.limiteCredito | currency: 'BRL' }}
                        </td>
                        <td class="hidden xl:table-cell">{{ cliente.cadastradoEm | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <p-tag
                                [value]="rotuloSituacao(cliente.situacao)"
                                [severity]="severidadeSituacao(cliente.situacao)"
                            />
                        </td>
                        <td>
                            <div class="flex justify-center gap-1">
                                <p-button
                                    icon="pi pi-pencil"
                                    severity="secondary"
                                    [text]="true"
                                    [rounded]="true"
                                    pTooltip="Editar"
                                    ariaLabel="Editar cliente"
                                    (onClick)="editar(cliente)"
                                />
                                <p-button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [text]="true"
                                    [rounded]="true"
                                    pTooltip="Excluir"
                                    ariaLabel="Excluir cliente"
                                    (onClick)="confirmarExclusao(cliente)"
                                />
                            </div>
                        </td>
                    </tr>
                </ng-template>

                <!-- Estado vazio: sempre implemente -->
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
            </p-table>
        }
    `
})
export class ClientesLista {
    protected readonly service = inject(ClientesService);
    private readonly router = inject(Router);
    private readonly messages = inject(MessageService);
    private readonly confirmation = inject(ConfirmationService);

    protected readonly situacaoOptions = SITUACAO_OPTIONS;

    protected readonly busca = signal('');
    protected readonly situacao = signal<SituacaoCliente | null>(null);

    /** Filtro derivado: recalcula sozinho quando busca, situacao ou dados mudam. */
    protected readonly clientesFiltrados = computed(() => {
        const termo = this.busca().trim().toLowerCase();
        const situacao = this.situacao();

        return this.service.items().filter((cliente) => {
            const casaTermo =
                !termo ||
                cliente.nome.toLowerCase().includes(termo) ||
                cliente.documento.toLowerCase().includes(termo) ||
                cliente.email.toLowerCase().includes(termo);
            const casaSituacao = !situacao || cliente.situacao === situacao;
            return casaTermo && casaSituacao;
        });
    });

    protected rotuloSituacao(situacao: SituacaoCliente): string {
        return SITUACAO_CLIENTE[situacao].label;
    }

    protected severidadeSituacao(situacao: SituacaoCliente): 'success' | 'danger' | 'warn' {
        return SITUACAO_CLIENTE[situacao].severity;
    }

    protected editar(cliente: Cliente): void {
        this.router.navigate(['/clientes', cliente.id]);
    }

    protected confirmarExclusao(cliente: Cliente): void {
        this.confirmation.confirm({
            header: 'Excluir cliente',
            message: `Deseja realmente excluir "${cliente.nome}"? Esta acao nao pode ser desfeita.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonProps: { severity: 'secondary', outlined: true },
            accept: async () => {
                await this.service.remove(cliente.id);
                this.messages.add({
                    severity: 'success',
                    summary: 'Cliente excluido',
                    detail: `"${cliente.nome}" foi removido.`
                });
            }
        });
    }

    protected restaurar(): void {
        this.confirmation.confirm({
            header: 'Restaurar dados',
            message: 'Isso descarta todas as alteracoes locais e volta aos dados de demonstracao. Continuar?',
            icon: 'pi pi-refresh',
            acceptLabel: 'Restaurar',
            rejectLabel: 'Cancelar',
            rejectButtonProps: { severity: 'secondary', outlined: true },
            accept: () => {
                this.service.restaurarSeed();
                this.messages.add({ severity: 'info', summary: 'Dados restaurados' });
            }
        });
    }
}
