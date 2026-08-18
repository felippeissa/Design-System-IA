import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';

import { CampoExibicao } from '../../core/ui/campo-exibicao';
import { SecaoExibicao } from '../../core/ui/secao-exibicao';
import { ClientesService } from '../../core/data/clientes.service';
import { Cliente, SITUACAO_CLIENTE, SituacaoCliente } from '../../core/data/cliente.model';

/**
 * TEMPLATE DE REFERENCIA: visualizacao (detalhe somente leitura).
 *
 * Estrutura definida pelo design system:
 * - titulo "Visualizar <nome>";
 * - um ou mais cartoes de secao, num grid de 1/2/4 colunas;
 * - cada campo e um par rotulo (negrito) + conteudo;
 * - botao "Voltar" no canto inferior direito, fora do ultimo cartao quando ha
 *   varias secoes.
 *
 * Regras:
 * - NUNCA use <input disabled> para exibir dado. Use <app-campo-exibicao>.
 * - Campo sem valor mostra "Nao informado" em cor esmaecida, nunca vazio.
 * - Texto longo recebe col-span na propria tag, em vez de estourar a celula.
 * - Listas de multipla escolha viram texto separado por ponto e virgula.
 */
@Component({
    selector: 'app-cliente-visualizar',
    imports: [
        CurrencyPipe,
        DatePipe,
        ButtonModule,
        TagModule,
        SkeletonModule,
        MessageModule,
        CampoExibicao,
        SecaoExibicao
    ],
    template: `
        @if (carregando()) {
            <div class="flex flex-col gap-4">
                <p-skeleton height="2rem" width="20rem" />
                <p-skeleton height="12rem" />
            </div>
        } @else if (!cliente()) {
            <p-message severity="error" text="Cliente nao encontrado." styleClass="w-full" />
        } @else {
            <h1 class="text-2xl font-semibold text-color m-0 mb-4">Visualizar {{ cliente()!.nome }}</h1>

            <div class="flex flex-col gap-4">
                <!-- Identificacao -->
                <app-secao-exibicao titulo="Identificacao">
                    <!-- Linha 1 no lg: 2+1+1 -->
                    <app-campo-exibicao rotulo="Razao social" [valor]="cliente()!.nome" class="md:col-span-2" />
                    <app-campo-exibicao rotulo="CNPJ" [valor]="cliente()!.documento" />
                    <!-- Situacao como texto, nao como <p-tag>: o template de
                         visualizacao usa conteudo textual simples. Tag e para
                         listagem, onde ajuda a varrer muitas linhas. -->
                    <app-campo-exibicao rotulo="Situacao" [valor]="rotuloSituacao(cliente()!.situacao)" />

                    <!-- Linha 2 no lg: 1+1+2 -->
                    <app-campo-exibicao rotulo="Cadastro" [valor]="cliente()!.cadastradoEm | date: 'dd/MM/yyyy'" />
                    <app-campo-exibicao rotulo="Codigo" [valor]="cliente()!.id" />
                    <app-campo-exibicao rotulo="Segmentos" [valor]="segmentos()" class="md:col-span-2" />

                    <!-- Texto longo ocupa a largura toda -->
                    <app-campo-exibicao
                        rotulo="Observacoes"
                        [valor]="observacoes()"
                        class="md:col-span-2 lg:col-span-4"
                    />
                </app-secao-exibicao>

                <!-- Contato -->
                <app-secao-exibicao titulo="Contato">
                    <!-- Duas linhas de 2+2. Com 2+1+1 o quinto campo sobrava
                         sozinho na linha seguinte, deixando 3 colunas vazias. -->
                    <app-campo-exibicao rotulo="E-mail" [valor]="cliente()!.email" class="lg:col-span-2" />
                    <app-campo-exibicao rotulo="Telefone" [valor]="cliente()!.telefone" class="lg:col-span-2" />
                    <app-campo-exibicao rotulo="Cidade" [valor]="cliente()!.cidade" class="lg:col-span-2" />
                    <app-campo-exibicao rotulo="UF" [valor]="cliente()!.uf" class="lg:col-span-2" />
                </app-secao-exibicao>

                <!-- Financeiro -->
                <app-secao-exibicao titulo="Financeiro">
                    <app-campo-exibicao
                        rotulo="Limite de credito"
                        [valor]="cliente()!.limiteCredito | currency: 'BRL'"
                    />
                    <app-campo-exibicao rotulo="Condicao de pagamento" valor="30 / 60 / 90 dias" class="md:col-span-2" />
                    <app-campo-exibicao rotulo="Inscricao estadual" [valor]="null" />
                </app-secao-exibicao>
            </div>

            <!-- Acoes: fora dos cartoes, alinhadas a direita -->
            <div class="flex justify-end gap-3 mt-6">
                <p-button label="Voltar" severity="primary" [outlined]="true" (onClick)="voltar()" />
                <p-button label="Editar" icon="pi pi-pencil" (onClick)="editar()" />
            </div>
        }
    `
})
export class ClienteVisualizar {
    /** Vem da rota /clientes/:id/visualizar. */
    readonly id = input<string>();

    private readonly service = inject(ClientesService);
    private readonly router = inject(Router);

    protected readonly cliente = signal<Cliente | null>(null);
    protected readonly carregando = signal(true);

    /** Texto longo, para demonstrar o campo que ocupa varias colunas. */
    protected readonly observacoes = computed(() =>
        this.cliente()
            ? 'Cliente atendido pela regional. Quando o conteudo for grande, como uma descricao, ' +
              'o campo ocupa mais colunas do grid e quebra em varias linhas.'
            : null
    );

    /** Multipla escolha vira texto separado por ponto e virgula. */
    protected readonly segmentos = computed(() =>
        this.cliente() ? 'Tecnologia; Servicos; Administracao publica' : null
    );

    constructor() {
        effect(() => {
            const id = this.id();
            if (!id) {
                this.carregando.set(false);
                return;
            }
            void this.carregar(id);
        });
    }

    protected rotuloSituacao(situacao: SituacaoCliente): string {
        return SITUACAO_CLIENTE[situacao].label;
    }

    protected severidadeSituacao(situacao: SituacaoCliente): 'success' | 'danger' | 'warn' {
        return SITUACAO_CLIENTE[situacao].severity;
    }

    protected voltar(): void {
        void this.router.navigate(['/clientes']);
    }

    protected editar(): void {
        void this.router.navigate(['/clientes', this.id()]);
    }

    private async carregar(id: string): Promise<void> {
        this.carregando.set(true);
        try {
            this.cliente.set((await this.service.getById(id)) ?? null);
        } finally {
            this.carregando.set(false);
        }
    }
}
