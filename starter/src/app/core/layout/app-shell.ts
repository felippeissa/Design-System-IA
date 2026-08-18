import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../theme/theme.service';

interface NavItem {
    label: string;
    icon: string;
    route: string;
}

/**
 * Shell da aplicacao: topbar + navegacao lateral + area de conteudo.
 *
 * Toda tela nova entra como filha da rota raiz e e renderizada no
 * <router-outlet> daqui. Para adicionar um item de menu, inclua uma
 * entrada em `nav` e a rota correspondente em app.routes.ts.
 *
 * <p-toast> e <p-confirmdialog> ficam declarados UMA UNICA VEZ aqui.
 * As telas apenas injetam MessageService / ConfirmationService.
 */
@Component({
    selector: 'app-shell',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        ButtonModule,
        DrawerModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule
    ],
    template: `
        <!-- Largura fixa de 350px e altura adaptativa, conforme as diretrizes
             do componente. A duracao (3000ms) vem do NotificacaoService. -->
        <p-toast position="top-right" [style]="{ width: '350px' }" />
        <p-confirmdialog />

        <div class="min-h-screen flex flex-col">
            <!-- Topbar -->
            <header
                class="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-surface bg-surface-0 dark:bg-surface-900 sticky top-0 z-20"
            >
                <p-button
                    icon="pi pi-bars"
                    severity="secondary"
                    [text]="true"
                    class="lg:hidden"
                    ariaLabel="Abrir menu"
                    (onClick)="drawerVisivel.set(true)"
                />

                <!--
                    Logo oficial. Existem duas variantes porque currentColor NAO
                    atravessa img: um SVG carregado assim e documento isolado e nao
                    herda a cor da pagina. Por isso a troca acompanha o tema, nao o CSS.
                    Nunca substitua por texto nem por placeholder.
                -->
                <a routerLink="/" class="flex items-center no-underline" aria-label="Informatiza 3.0 - inicio">
                    <img
                        [src]="theme.mode() === 'dark' ? 'logo-informatiza-dark.svg' : 'logo-informatiza.svg'"
                        alt="Informatiza 3.0"
                        width="139"
                        height="30"
                        class="h-7 w-auto"
                    />
                </a>

                <div class="flex-1"></div>

                <p-button
                    [icon]="theme.mode() === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
                    severity="secondary"
                    [rounded]="true"
                    [text]="true"
                    [pTooltip]="theme.mode() === 'dark' ? 'Tema claro' : 'Tema escuro'"
                    tooltipPosition="bottom"
                    ariaLabel="Alternar tema"
                    (onClick)="theme.toggle()"
                />
            </header>

            <div class="flex flex-1 min-h-0">
                <!-- Navegacao fixa (desktop) -->
                <nav class="hidden lg:block w-60 shrink-0 border-r border-surface bg-surface-0 dark:bg-surface-900 p-3">
                    @for (item of nav; track item.route) {
                        <a
                            [routerLink]="item.route"
                            routerLinkActive="bg-primary-50 dark:bg-primary-400/10 text-primary font-medium"
                            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                            class="flex items-center gap-3 px-3 py-2.5 rounded-border no-underline text-color hover:bg-emphasis transition-colors"
                        >
                            <i [class]="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </a>
                    }
                </nav>

                <!-- Navegacao em drawer (mobile) -->
                <p-drawer [(visible)]="drawerVisivelValue" header="Menu" styleClass="w-72">
                    @for (item of nav; track item.route) {
                        <a
                            [routerLink]="item.route"
                            routerLinkActive="bg-primary-50 dark:bg-primary-400/10 text-primary font-medium"
                            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                            class="flex items-center gap-3 px-3 py-2.5 rounded-border no-underline text-color hover:bg-emphasis"
                            (click)="drawerVisivel.set(false)"
                        >
                            <i [class]="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </a>
                    }
                </p-drawer>

                <!-- Conteudo -->
                <main class="flex-1 min-w-0 p-4 sm:p-6">
                    <router-outlet />
                </main>
            </div>
        </div>
    `
})
export class AppShell {
    protected readonly theme = inject(ThemeService);
    protected readonly drawerVisivel = signal(false);

    protected readonly nav: NavItem[] = [
        { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
        { label: 'Clientes', icon: 'pi pi-users', route: '/clientes' },
        { label: 'Componentes', icon: 'pi pi-th-large', route: '/components/toast' }
    ];

    protected get drawerVisivelValue(): boolean {
        return this.drawerVisivel();
    }

    protected set drawerVisivelValue(value: boolean) {
        this.drawerVisivel.set(value);
    }
}
