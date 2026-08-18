import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';

import {
    DURACAO_MINIMA,
    LIMITE_DESCRICAO,
    LIMITE_TITULO,
    NotificacaoService
} from '../../core/ui/notificacao.service';

interface Severidade {
    chave: 'success' | 'info' | 'warn' | 'error';
    nome: string;
    tituloPadrao: string;
    quando: string;
    icone: string;
    exemplo: string;
}

/**
 * Galeria do componente Toast.
 *
 * Documenta o componente conforme as diretrizes do design system e permite
 * disparar cada variacao para ver o comportamento real.
 *
 * Ao criar a galeria de um componente novo, siga esta estrutura: amostra
 * interativa, campo de teste com contador de caracteres, tabela de severidades,
 * diretrizes e trecho de codigo.
 */
@Component({
    selector: 'app-toast-demo',
    imports: [FormsModule, ButtonModule, InputTextModule, SelectModule, TagModule, TabsModule],
    template: `
        <div class="max-w-4xl">
            <div class="mb-6">
                <h1 class="text-2xl font-semibold text-color m-0">Toast</h1>
                <p class="text-muted-color mt-1 mb-0">
                    Alertas rapidos que nao interrompem a navegacao.
                </p>
            </div>

            <!-- Disparar -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900 mb-6">
                <h2 class="text-lg font-medium text-color m-0 mb-1">Experimente</h2>
                <p class="text-muted-color text-sm mt-0 mb-4">
                    Cada botao usa o titulo padrao da severidade.
                </p>

                <div class="flex flex-wrap gap-3">
                    @for (sev of severidades; track sev.chave) {
                        <p-button
                            [label]="sev.nome"
                            [icon]="sev.icone"
                            [severity]="sev.chave === 'success' ? 'success' : sev.chave === 'info' ? 'info' : sev.chave === 'warn' ? 'warn' : 'danger'"
                            (onClick)="disparar(sev)"
                        />
                    }
                    <p-button
                        label="Limpar"
                        icon="pi pi-times"
                        severity="secondary"
                        [outlined]="true"
                        (onClick)="notificacao.limpar()"
                    />
                </div>
            </section>

            <!-- Mensagens padronizadas -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900 mb-6">
                <h2 class="text-lg font-medium text-color m-0 mb-1">Mensagens padronizadas de sucesso</h2>
                <p class="text-muted-color text-sm mt-0 mb-4">
                    Quando o requisito nao especifica o texto, use estes tres metodos. Padronizar agiliza a
                    prototipacao e mantem o sistema coerente.
                </p>

                <div class="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                        pInputText
                        placeholder="Nome do registro. Ex.: Cliente"
                        class="w-full sm:w-64"
                        [ngModel]="registro()"
                        (ngModelChange)="registro.set($event)"
                        aria-label="Nome do registro"
                    />
                </div>

                <div class="flex flex-wrap gap-3">
                    <p-button label="Criado" icon="pi pi-plus" [outlined]="true" (onClick)="notificacao.criado(registroOuPadrao())" />
                    <p-button label="Atualizado" icon="pi pi-pencil" [outlined]="true" (onClick)="notificacao.atualizado(registroOuPadrao())" />
                    <p-button label="Excluido" icon="pi pi-trash" [outlined]="true" (onClick)="notificacao.excluido(registroOuPadrao())" />
                </div>
            </section>

            <!-- Texto livre com contador -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900 mb-6">
                <h2 class="text-lg font-medium text-color m-0 mb-1">Texto personalizado</h2>
                <p class="text-muted-color text-sm mt-0 mb-4">
                    O titulo ocupa 1 linha e a descricao no maximo 2. Passar do limite nao quebra o layout, porque a
                    altura e adaptativa, mas descaracteriza o componente.
                </p>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                        <label for="sev" class="font-medium text-color">Severidade</label>
                        <p-select
                            inputId="sev"
                            [options]="opcoesSeveridade"
                            optionLabel="label"
                            optionValue="value"
                            styleClass="w-full"
                            [ngModel]="severidadeEscolhida()"
                            (ngModelChange)="severidadeEscolhida.set($event)"
                        />
                    </div>

                    <div class="col-span-12 md:col-span-8 flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <label for="titulo" class="font-medium text-color">Titulo</label>
                            <span class="text-xs" [class]="tituloExcedeu() ? 'text-red-500 font-medium' : 'text-muted-color'">
                                {{ titulo().length }} / {{ limiteTitulo }}
                            </span>
                        </div>
                        <input
                            pInputText
                            id="titulo"
                            placeholder="Vazio usa o titulo padrao da severidade"
                            [ngModel]="titulo()"
                            (ngModelChange)="titulo.set($event)"
                            [invalid]="tituloExcedeu()"
                        />
                    </div>

                    <div class="col-span-12 flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <label for="descricao" class="font-medium text-color">Descricao</label>
                            <span class="text-xs" [class]="descricaoExcedeu() ? 'text-red-500 font-medium' : 'text-muted-color'">
                                {{ descricao().length }} / {{ limiteDescricao }}
                            </span>
                        </div>
                        <input
                            pInputText
                            id="descricao"
                            [ngModel]="descricao()"
                            (ngModelChange)="descricao.set($event)"
                            [invalid]="descricaoExcedeu()"
                        />
                    </div>
                </div>

                <div class="flex justify-end mt-4">
                    <p-button label="Disparar" icon="pi pi-send" (onClick)="dispararPersonalizado()" />
                </div>
            </section>

            <!-- Severidades -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900 mb-6">
                <h2 class="text-lg font-medium text-color m-0 mb-4">Severidades</h2>
                <div class="flex flex-col gap-4">
                    @for (sev of severidades; track sev.chave) {
                        <div class="flex flex-wrap items-start gap-3 pb-4 border-b border-surface last:border-0 last:pb-0">
                            <p-tag [value]="sev.nome" [severity]="sev.chave === 'error' ? 'danger' : sev.chave" />
                            <div class="flex-1 min-w-[16rem]">
                                <p class="text-color m-0">{{ sev.quando }}</p>
                                <p class="text-muted-color text-sm mt-1 mb-0">
                                    Titulo padrao: <strong>{{ sev.tituloPadrao }}</strong>
                                </p>
                            </div>
                        </div>
                    }
                </div>
            </section>

            <!-- Diretrizes -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900 mb-6">
                <h2 class="text-lg font-medium text-color m-0 mb-4">Diretrizes</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-3 m-0">
                    <dt class="font-medium text-color">Duracao</dt>
                    <dd class="text-muted-color m-0">{{ duracaoMinima }}ms. Pode ser maior, nunca menor.</dd>

                    <dt class="font-medium text-color">Largura</dt>
                    <dd class="text-muted-color m-0">Fixa em 350px, com quebra de linha. A altura e adaptativa.</dd>

                    <dt class="font-medium text-color">Estrutura</dt>
                    <dd class="text-muted-color m-0">
                        Titulo + descricao, ambos obrigatorios. Nunca dispare so com titulo.
                    </dd>

                    <dt class="font-medium text-color">Titulo</dt>
                    <dd class="text-muted-color m-0">
                        1 linha, ate {{ limiteTitulo }} caracteres. Sem personalizacao, use o padrao da severidade.
                    </dd>

                    <dt class="font-medium text-color">Descricao</dt>
                    <dd class="text-muted-color m-0">Ate 2 linhas, {{ limiteDescricao }} caracteres.</dd>

                    <dt class="font-medium text-color">Interacao</dt>
                    <dd class="text-muted-color m-0">
                        Nao bloqueia a interface: o usuario continua navegando com o toast em tela.
                    </dd>

                    <dt class="font-medium text-color">Posicao</dt>
                    <dd class="text-muted-color m-0">Canto superior direito. Declarado uma unica vez, no shell.</dd>
                </dl>
            </section>

            <!-- Codigo -->
            <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
                <h2 class="text-lg font-medium text-color m-0 mb-1">Como usar</h2>
                <p class="text-muted-color text-sm mt-0 mb-4">
                    Injete o NotificacaoService. Nunca use o MessageService direto: e ele que garante estrutura,
                    duracao e limites.
                </p>
                <pre class="text-sm overflow-x-auto p-4 rounded-border bg-surface-100 dark:bg-surface-800 text-color m-0"><code>{{ exemploCodigo }}</code></pre>
            </section>
        </div>
    `
})
export class ToastDemo {
    protected readonly notificacao = inject(NotificacaoService);

    protected readonly limiteTitulo = LIMITE_TITULO;
    protected readonly limiteDescricao = LIMITE_DESCRICAO;
    protected readonly duracaoMinima = DURACAO_MINIMA;

    protected readonly registro = signal('Cliente');
    protected readonly titulo = signal('');
    protected readonly descricao = signal('O registro foi processado e ja aparece na listagem.');
    protected readonly severidadeEscolhida = signal<Severidade['chave']>('success');

    protected readonly tituloExcedeu = computed(() => this.titulo().length > LIMITE_TITULO);
    protected readonly descricaoExcedeu = computed(() => this.descricao().length > LIMITE_DESCRICAO);

    protected readonly severidades: Severidade[] = [
        {
            chave: 'success',
            nome: 'Success',
            tituloPadrao: 'Sucesso',
            quando: 'Confirmacao de acao bem-sucedida.',
            icone: 'pi pi-check-circle',
            exemplo: 'Cliente criado com sucesso.'
        },
        {
            chave: 'info',
            nome: 'Information',
            tituloPadrao: 'Informacao',
            quando: 'Informacoes e avisos neutros.',
            icone: 'pi pi-info-circle',
            exemplo: 'Os dados de demonstracao foram restaurados.'
        },
        {
            chave: 'warn',
            nome: 'Warn',
            tituloPadrao: 'Atencao',
            quando: 'Atencao antes de acao ou possivel problema.',
            icone: 'pi pi-exclamation-triangle',
            exemplo: 'Existem campos obrigatorios nao preenchidos.'
        },
        {
            chave: 'error',
            nome: 'Error',
            tituloPadrao: 'Erro',
            quando: 'Erros, falhas ou acoes bloqueadas.',
            icone: 'pi pi-times-circle',
            exemplo: 'Nao foi possivel salvar. Tente novamente.'
        }
    ];

    protected readonly opcoesSeveridade = this.severidades.map((s) => ({ label: s.nome, value: s.chave }));

    protected readonly exemploCodigo = [
        "private readonly notificacao = inject(NotificacaoService);",
        '',
        '// Mensagens padronizadas',
        "this.notificacao.criado('Cliente');      // Cliente criado com sucesso.",
        "this.notificacao.atualizado('Cliente');  // Cliente atualizado com sucesso.",
        "this.notificacao.excluido('Cliente');    // Cliente excluido com sucesso.",
        '',
        '// Texto proprio (titulo padrao da severidade)',
        "this.notificacao.atencao('Existem campos obrigatorios nao preenchidos.');",
        "this.notificacao.erro('Nao foi possivel salvar. Tente novamente.');",
        '',
        '// Titulo personalizado, quando o padrao nao serve',
        "this.notificacao.informacao('Voce sera desconectado em 5 minutos.', 'Sessao expirando');"
    ].join('\n');

    protected registroOuPadrao(): string {
        return this.registro().trim() || 'Registro';
    }

    protected disparar(sev: Severidade): void {
        switch (sev.chave) {
            case 'success':
                this.notificacao.sucesso(sev.exemplo);
                break;
            case 'info':
                this.notificacao.informacao(sev.exemplo);
                break;
            case 'warn':
                this.notificacao.atencao(sev.exemplo);
                break;
            case 'error':
                this.notificacao.erro(sev.exemplo);
                break;
        }
    }

    protected dispararPersonalizado(): void {
        const titulo = this.titulo().trim() || undefined;
        const descricao = this.descricao().trim() || 'Sem descricao.';

        switch (this.severidadeEscolhida()) {
            case 'success':
                this.notificacao.sucesso(descricao, titulo);
                break;
            case 'info':
                this.notificacao.informacao(descricao, titulo);
                break;
            case 'warn':
                this.notificacao.atencao(descricao, titulo);
                break;
            case 'error':
                this.notificacao.erro(descricao, titulo);
                break;
        }
    }
}
