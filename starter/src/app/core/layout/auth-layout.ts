import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { AcessibilidadeService } from '../a11y/acessibilidade.service';
import { ThemeService } from '../theme/theme.service';

/**
 * TEMPLATE DE REFERENCIA: layout das telas publicas (autenticacao).
 *
 * Usado por tudo que fica FORA da aplicacao logada: login, termos, consentimento,
 * escolha de perfil. Diferente do AppShell, aqui nao existe menu nem topbar de
 * aplicacao — so a barra gov.br e um card centralizado.
 *
 * A barra superior segue o padrao dos portais do Governo de Goias: identificacao
 * a esquerda, controles de acessibilidade a direita. Os controles sao funcionais,
 * nao decorativos (ver AcessibilidadeService).
 */
@Component({
    selector: 'app-auth-layout',
    imports: [RouterOutlet, ButtonModule, DialogModule, ToastModule, TooltipModule],
    template: `
        <p-toast position="top-right" />

        <div class="min-h-screen flex flex-col bg-[var(--p-primary-50)] dark:bg-surface-950">
            <!-- Barra gov.br -->
            <header
                class="h-8 shrink-0 flex items-center justify-between gap-4 px-4 bg-surface-950 text-surface-0 text-xs"
            >
                <a
                    href="https://goias.gov.br"
                    target="_blank"
                    rel="noopener"
                    class="font-bold tracking-wide no-underline text-surface-0 hover:underline"
                >
                    GOIAS.GOV.BR
                </a>

                <nav class="flex items-center gap-1" aria-label="Acessibilidade">
                    <button
                        type="button"
                        class="px-2 py-1 rounded-border hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        [disabled]="!a11y.podeDiminuir()"
                        (click)="a11y.diminuirFonte()"
                        aria-label="Diminuir tamanho da fonte"
                        pTooltip="Diminuir fonte"
                        tooltipPosition="bottom"
                    >
                        A<span aria-hidden="true">&minus;</span>
                    </button>

                    <button
                        type="button"
                        class="px-2 py-1 rounded-border hover:bg-surface-800"
                        (click)="a11y.normalizarFonte()"
                        aria-label="Restaurar tamanho padrao da fonte"
                        pTooltip="Fonte padrao"
                        tooltipPosition="bottom"
                    >
                        A
                    </button>

                    <button
                        type="button"
                        class="px-2 py-1 rounded-border hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        [disabled]="!a11y.podeAumentar()"
                        (click)="a11y.aumentarFonte()"
                        aria-label="Aumentar tamanho da fonte"
                        pTooltip="Aumentar fonte"
                        tooltipPosition="bottom"
                    >
                        A<span aria-hidden="true">+</span>
                    </button>

                    <!--
                        Abaixo de sm o rotulo some e sobra o icone: os cinco
                        controles com texto nao cabem em 360px e faziam a barra
                        transbordar. O aria-label mantem o significado.
                    -->
                    <button
                        type="button"
                        class="flex items-center gap-1.5 px-2 py-1 rounded-border hover:bg-surface-800 uppercase"
                        [attr.aria-pressed]="a11y.altoContraste()"
                        aria-label="Alternar alto contraste"
                        (click)="a11y.alternarContraste()"
                    >
                        <i class="pi pi-circle-fill text-[10px]" aria-hidden="true"></i>
                        <span class="hidden sm:inline">Alto contraste</span>
                    </button>

                    <button
                        type="button"
                        class="flex items-center gap-1.5 px-2 py-1 rounded-border hover:bg-surface-800 uppercase"
                        aria-label="Recursos de acessibilidade"
                        (click)="ajudaVisivel.set(true)"
                    >
                        <i class="pi pi-info-circle text-[10px]" aria-hidden="true"></i>
                        <span class="hidden sm:inline">Acessibilidade</span>
                    </button>
                </nav>
            </header>

            <!-- Conteudo centralizado -->
            <main class="flex-1 flex items-center justify-center p-4">
                <router-outlet />
            </main>
        </div>

        <p-dialog
            header="Recursos de acessibilidade"
            [(visible)]="ajudaVisivelValor"
            [modal]="true"
            [dismissableMask]="true"
            styleClass="w-[min(32rem,92vw)]"
        >
            <p class="text-color m-0">
                Esta pagina segue as diretrizes de acessibilidade do Governo do Estado de Goias.
            </p>
            <ul class="text-color mt-3 mb-0 pl-5 flex flex-col gap-2">
                <li>Use <strong>A&minus;</strong>, <strong>A</strong> e <strong>A+</strong> para ajustar o tamanho do texto.</li>
                <li>O modo <strong>Alto contraste</strong> aumenta a distincao entre texto e fundo.</li>
                <li>Navegue com <kbd>Tab</kbd> e acione com <kbd>Enter</kbd> ou <kbd>Espaco</kbd>.</li>
                <li>Todos os campos possuem rotulo associado, legivel por leitores de tela.</li>
            </ul>
            <p class="text-muted-color text-sm mt-4 mb-0">
                A preferencia de fonte e de contraste fica salva neste navegador.
            </p>
        </p-dialog>
    `
})
export class AuthLayout {
    protected readonly a11y = inject(AcessibilidadeService);
    protected readonly theme = inject(ThemeService);

    protected readonly ajudaVisivel = signal(false);

    protected get ajudaVisivelValor(): boolean {
        return this.ajudaVisivel();
    }

    protected set ajudaVisivelValor(valor: boolean) {
        this.ajudaVisivel.set(valor);
    }
}
