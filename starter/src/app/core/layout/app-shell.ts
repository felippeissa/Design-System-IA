import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { LoginService } from '../data/login.service';
import { ThemeService } from '../theme/theme.service';

interface NavItem {
    label: string;
    icon: string;
    /** Serve tambem de identificador do grupo quando ha filhos. */
    route: string;
    filhos?: NavItem[];
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
        TooltipModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        NgTemplateOutlet
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
                <!--
                    Um unico botao para os dois modos. Em telas grandes ele
                    recolhe e expande a navegacao fixa; abaixo de lg abre o
                    drawer. A decisao e tomada no clique, por matchMedia, em vez
                    de duplicar o botao com classes de visibilidade.
                -->
                <p-button
                    icon="pi pi-bars"
                    severity="secondary"
                    [text]="true"
                    [rounded]="true"
                    [pTooltip]="menuRecolhido() ? 'Abrir menu' : 'Fechar menu'"
                    tooltipPosition="bottom"
                    [ariaLabel]="menuRecolhido() ? 'Abrir menu lateral' : 'Fechar menu lateral'"
                    [attr.aria-expanded]="!menuRecolhido()"
                    (onClick)="alternarMenu()"
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

                <!-- Identificacao do usuario: leva ao perfil -->
                <p-button
                    [label]="nomeUsuario()"
                    icon="pi pi-user"
                    severity="secondary"
                    [text]="true"
                    routerLink="/perfil"
                    styleClass="max-w-[12rem]"
                    pTooltip="Ver meu perfil"
                    tooltipPosition="bottom"
                    [ariaLabel]="'Perfil de ' + nomeUsuario()"
                />

                <p-button
                    icon="pi pi-sign-out"
                    severity="secondary"
                    [rounded]="true"
                    [text]="true"
                    pTooltip="Sair"
                    tooltipPosition="bottom"
                    ariaLabel="Sair do sistema"
                    (onClick)="sair()"
                />
            </header>

            <div class="flex flex-1 min-h-0">
                <!-- Navegacao fixa (desktop) -->
                <!--
                    Menu destacado: cartao proprio com margem, sem encostar no
                    header nem na borda da janela: m-3 com borda completa e canto
                    arredondado, no lugar do border-r colado.

                    Sem self-start, o item flex estica no eixo transversal e o
                    cartao acompanha a altura toda da area de conteudo.
                    O overflow-y-auto cobre o caso de o menu crescer mais que a
                    tela, rolando por dentro em vez de estourar o layout.
                -->
                <nav
                    class="hidden w-60 shrink-0 m-3 p-3 overflow-y-auto rounded-border border border-surface bg-surface-0 dark:bg-surface-900"
                    [class.lg:block]="!menuRecolhido()"
                >
                    <p-iconfield class="block mb-3">
                        <p-inputicon class="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            placeholder="Digite"
                            class="w-full"
                            aria-label="Buscar no menu"
                            [ngModel]="filtroMenu()"
                            (ngModelChange)="filtroMenu.set($event)"
                        />
                    </p-iconfield>

                    <ng-container
                        *ngTemplateOutlet="itensMenu; context: { $implicit: navFiltrado(), fechar: false }"
                    />
                </nav>

                <!-- Navegacao em drawer (mobile) -->
                <p-drawer [(visible)]="drawerVisivelValue" header="Menu" styleClass="w-72">
                    <ng-container *ngTemplateOutlet="itensMenu; context: { $implicit: nav, fechar: true }" />
                </p-drawer>

                <!-- Conteudo + rodape -->
                <div class="flex-1 min-w-0 flex flex-col">
                    <main class="flex-1 min-w-0 p-4 sm:p-6">
                        <router-outlet />
                    </main>

                    <!-- Rodape institucional, presente em todos os templates -->
                    <footer
                        class="shrink-0 py-4 px-4 sm:px-6 text-center text-sm text-muted-color border-t border-surface"
                    >
                        Copyright &copy; {{ ano }} &ndash; Estado de Goias &ndash; Todos os direitos reservados.
                        <span class="ml-4">Versao {{ versao }}</span>
                    </footer>
                </div>
            </div>
        </div>

        <!--
            Um unico template para a navegacao fixa e para o drawer. Duplicar a
            marcacao faria as duas versoes divergirem na primeira alteracao.

            O parametro "fechar" diz se o clique deve fechar o drawer;
            na navegacao fixa ele e falso.
        -->
        <ng-template #itensMenu let-itens let-fechar="fechar">
            @for (item of itens; track item.route) {
                @if (item.filhos?.length) {
                    <!-- Item com submenu: alterna a lista em vez de navegar -->
                    <button
                        type="button"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-border text-color hover:bg-emphasis transition-colors"
                        [attr.aria-expanded]="estaAberto(item.route)"
                        (click)="alternarGrupo(item.route)"
                    >
                        <i [class]="item.icon" aria-hidden="true"></i>
                        <span class="flex-1 text-left">{{ item.label }}</span>
                        <i
                            class="pi pi-chevron-down text-xs transition-transform"
                            [class.rotate-180]="estaAberto(item.route)"
                            aria-hidden="true"
                        ></i>
                    </button>

                    @if (estaAberto(item.route)) {
                        <div class="ml-4 pl-3 border-l border-surface flex flex-col">
                            @for (filho of item.filhos; track filho.route) {
                                <a
                                    [routerLink]="filho.route"
                                    routerLinkActive="bg-primary-50 dark:bg-primary-400/10 text-primary font-medium"
                                    class="flex items-center gap-3 px-3 py-2 rounded-border no-underline text-color hover:bg-emphasis transition-colors"
                                    (click)="fechar && drawerVisivel.set(false)"
                                >
                                    <i [class]="filho.icon" aria-hidden="true"></i>
                                    <span>{{ filho.label }}</span>
                                </a>
                            }
                        </div>
                    }
                } @else {
                    <a
                        [routerLink]="item.route"
                        routerLinkActive="bg-primary-50 dark:bg-primary-400/10 text-primary font-medium"
                        [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-border no-underline text-color hover:bg-emphasis transition-colors"
                        (click)="fechar && drawerVisivel.set(false)"
                    >
                        <i [class]="item.icon" aria-hidden="true"></i>
                        <span>{{ item.label }}</span>
                    </a>
                }
            }
        </ng-template>
    `
})
export class AppShell {
    protected readonly theme = inject(ThemeService);
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);

    protected readonly drawerVisivel = signal(false);
    protected readonly menuRecolhido = signal(false);
    protected readonly filtroMenu = signal('');

    /** Grupos de menu expandidos, por rota do pai. */
    private readonly gruposAbertos = signal<Set<string>>(new Set());

    protected readonly ano = new Date().getFullYear();
    protected readonly versao = '1.2.2';

    /** Nome exibido na topbar. Sem sessao, mostra um rotulo neutro. */
    protected readonly nomeUsuario = computed(() => this.login.usuario() ?? 'Visitante');

    /** Filtro do menu lateral, alimentado pelo campo de busca. */
    protected readonly navFiltrado = computed(() => {
        const termo = this.filtroMenu().trim().toLowerCase();
        if (!termo) {
            return this.nav;
        }
        // Um pai entra na lista se ele OU algum filho casar com a busca; nesse
        // caso mostramos so os filhos que casaram.
        return this.nav
            .map((item) => {
                const casaPai = item.label.toLowerCase().includes(termo);
                const filhos = item.filhos?.filter((f) => f.label.toLowerCase().includes(termo));
                if (casaPai) {
                    return item;
                }
                return filhos?.length ? { ...item, filhos } : null;
            })
            .filter((item): item is NavItem => item !== null);
    });

    protected readonly nav: NavItem[] = [
        { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
        { label: 'Clientes', icon: 'pi pi-users', route: '/clientes' },
        {
            label: 'Componentes',
            icon: 'pi pi-th-large',
            route: '/components',
            filhos: [{ label: 'Toast', icon: 'pi pi-bell', route: '/components/toast' }]
        },
        { label: 'Meu perfil', icon: 'pi pi-user', route: '/perfil' }
    ];

    /**
     * Um grupo esta aberto se foi expandido, se a rota atual esta dentro dele,
     * ou se ha busca em curso.
     *
     * O caso da busca importa: sem ele o filtro encontra o filho, mantem o pai
     * na lista e ainda assim esconde o resultado dentro do grupo fechado.
     */
    protected estaAberto(rotaPai: string): boolean {
        if (this.filtroMenu().trim()) {
            return true;
        }
        return this.gruposAbertos().has(rotaPai) || this.router.url.startsWith(rotaPai);
    }

    protected alternarGrupo(rotaPai: string): void {
        this.gruposAbertos.update((atual) => {
            const proximo = new Set(atual);
            // Se estava aberto por causa da rota, o clique precisa fecha-lo:
            // por isso removemos e adicionamos com base no estado visivel.
            if (this.estaAberto(rotaPai)) {
                proximo.delete(rotaPai);
            } else {
                proximo.add(rotaPai);
            }
            return proximo;
        });
    }

    /**
     * Em telas grandes recolhe ou expande a navegacao fixa.
     * Abaixo de lg (1024px) o padrao e o drawer.
     */
    protected alternarMenu(): void {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            this.menuRecolhido.update((v) => !v);
        } else {
            this.drawerVisivel.set(true);
        }
    }

    protected sair(): void {
        this.login.sair();
        void this.router.navigate(['/login/signin']);
    }

    protected get drawerVisivelValue(): boolean {
        return this.drawerVisivel();
    }

    protected set drawerVisivelValue(value: boolean) {
        this.drawerVisivel.set(value);
    }
}
