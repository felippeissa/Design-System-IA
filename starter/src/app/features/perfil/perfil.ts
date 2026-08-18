import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { CampoExibicao } from '../../core/ui/campo-exibicao';
import { SecaoExibicao } from '../../core/ui/secao-exibicao';
import { LoginService } from '../../core/data/login.service';
import { ORGAOS, PERFIS } from '../../core/data/login.model';
import { ThemeService } from '../../core/theme/theme.service';
import { NotificacaoService } from '../../core/ui/notificacao.service';

/**
 * Perfil do usuario logado.
 *
 * Segue o template de Visualizacao: cartoes de secao com pares rotulo +
 * conteudo. A diferenca e a secao de preferencias, que traz controles ativos
 * em vez de texto.
 *
 * Os dados vem do LoginService, ou seja, do que foi escolhido no fluxo de
 * login. Sem sessao, a tela mostra o estado de visitante e convida a entrar.
 */
@Component({
    selector: 'app-perfil',
    imports: [
        FormsModule,
        ButtonModule,
        AvatarModule,
        TagModule,
        ToggleSwitchModule,
        CampoExibicao,
        SecaoExibicao
    ],
    template: `
        <h1 class="text-2xl font-semibold text-color m-0 mb-4">Meu perfil</h1>

        <div class="flex flex-col gap-4">
            <!-- Cabecalho de identificacao -->
            <section class="p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
                <div class="flex flex-wrap items-center gap-4">
                    <p-avatar [label]="iniciais()" size="xlarge" shape="circle" styleClass="bg-primary text-primary-contrast" />
                    <div class="min-w-0">
                        <p class="text-xl font-semibold text-color m-0 truncate">{{ nome() }}</p>
                        <p class="text-muted-color mt-1 mb-0">{{ subtitulo() }}</p>
                    </div>
                    <div class="flex-1"></div>
                    <p-tag
                        [value]="autenticado() ? 'Sessao ativa' : 'Sem sessao'"
                        [severity]="autenticado() ? 'success' : 'warn'"
                    />
                </div>
            </section>

            <!-- Dados de acesso -->
            <app-secao-exibicao titulo="Dados de acesso">
                <app-campo-exibicao rotulo="Usuario" [valor]="usuario()" [colunas]="2" vazio="Nenhum usuario conectado" />
                <app-campo-exibicao rotulo="Perfil" [valor]="perfilLabel()" vazio="Nao selecionado" />
                <app-campo-exibicao rotulo="Orgao" [valor]="orgaoLabel()" [colunas]="3" vazio="Nao selecionado" />
                <app-campo-exibicao rotulo="Termos de uso" [valor]="termos()" />
                <app-campo-exibicao rotulo="Duracao da aprovacao" [valor]="duracao()" [colunas]="2" />
                <app-campo-exibicao rotulo="Manter conectado" [valor]="manterConectado()" />
                <app-campo-exibicao rotulo="Dados compartilhados" [colunas]="6" [valor]="atributos()" />
            </app-secao-exibicao>

            <!-- Preferencias: unica secao com controles ativos -->
            <section class="p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
                <h2 class="text-base font-bold text-color m-0 mb-4">Preferencias</h2>

                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="min-w-0">
                        <label for="temaEscuro" class="font-bold text-color cursor-pointer">Tema escuro</label>
                        <p class="text-muted-color text-sm mt-0.5 mb-0">
                            A preferencia fica salva neste navegador.
                        </p>
                    </div>
                    <p-toggleswitch
                        inputId="temaEscuro"
                        [ngModel]="theme.mode() === 'dark'"
                        (ngModelChange)="theme.toggle()"
                    />
                </div>
            </section>

            <!-- Acoes -->
            <div class="flex flex-wrap justify-end gap-3 mt-2">
                @if (autenticado()) {
                    <p-button
                        label="Sair do sistema"
                        icon="pi pi-sign-out"
                        severity="danger"
                        [outlined]="true"
                        (onClick)="confirmarSaida()"
                    />
                } @else {
                    <p-button label="Entrar" icon="pi pi-sign-in" (onClick)="entrar()" />
                }
            </div>
        </div>
    `
})
export class Perfil {
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);
    private readonly confirmation = inject(ConfirmationService);
    private readonly notificacao = inject(NotificacaoService);

    protected readonly theme = inject(ThemeService);

    protected readonly autenticado = this.login.autenticado;
    protected readonly usuario = this.login.usuario;

    protected readonly nome = computed(() => this.usuario() ?? 'Visitante');

    protected readonly subtitulo = computed(() =>
        this.autenticado() ? 'Usuario conectado ao Informatiza 3.0' : 'Nenhuma sessao iniciada neste navegador'
    );

    protected readonly iniciais = computed(() => {
        const nome = this.nome();
        const partes = nome.split(/[.\s_-]+/).filter(Boolean);
        const letras = partes.slice(0, 2).map((p) => p[0]);
        return letras.join('').toUpperCase() || '?';
    });

    protected readonly perfilLabel = computed(() => {
        const valor = this.login.estado().perfil;
        return valor ? (PERFIS.find((p) => p.value === valor)?.label ?? valor) : null;
    });

    protected readonly orgaoLabel = computed(() => {
        const valor = this.login.estado().orgao;
        return valor ? (ORGAOS.find((o) => o.value === valor)?.label ?? valor) : null;
    });

    protected readonly termos = computed(() => (this.login.termosAceitos() ? 'Aceitos' : 'Nao aceitos'));

    protected readonly manterConectado = computed(() => (this.login.estado().manterConectado ? 'Sim' : 'Nao'));

    protected readonly duracao = computed(() => {
        const valor = this.login.estado().duracaoAprovacao;
        if (!valor) {
            return null;
        }
        return valor === 'sempre' ? 'Aprovado sempre' : 'Aprovado uma vez';
    });

    /** Lista de atributos vira texto separado por ponto e virgula. */
    protected readonly atributos = computed(() => {
        const lista = this.login.estado().atributosAprovados;
        if (!lista.length) {
            return null;
        }
        const rotulos: Record<string, string> = {
            celular: 'Celular',
            nomeCompleto: 'Nome completo',
            cpf: 'CPF',
            emailPessoal: 'E-mail pessoal',
            nome: 'Nome',
            emailCorporativo: 'E-mail corporativo'
        };
        return lista.map((chave) => rotulos[chave] ?? chave).join('; ');
    });

    protected entrar(): void {
        void this.router.navigate(['/login/signin']);
    }

    protected confirmarSaida(): void {
        this.confirmation.confirm({
            header: 'Sair do sistema',
            message: 'Deseja encerrar a sessao? Voce voltara para a tela de entrada.',
            icon: 'pi pi-sign-out',
            acceptLabel: 'Sair',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonProps: { severity: 'secondary', outlined: true },
            accept: () => {
                this.login.sair();
                this.notificacao.informacao('Sessao encerrada. Ate logo.');
                void this.router.navigate(['/login/signin']);
            }
        });
    }
}
