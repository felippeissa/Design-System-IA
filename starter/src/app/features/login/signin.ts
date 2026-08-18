import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { NotificacaoService } from '../../core/ui/notificacao.service';

import { AuthCard } from './auth-card';
import { LoginService } from '../../core/data/login.service';

/**
 * TEMPLATE DE REFERENCIA: tela de entrada (login).
 *
 * Cobre: campo de usuario, senha com alternancia de visibilidade, lembrar
 * sessao, recuperacao de senha, acao primaria em largura total e provedores
 * de identidade externos separados por divisor.
 *
 * Nao ha autenticacao real. Qualquer usuario com senha de 4+ caracteres entra —
 * ver LoginService.
 */
@Component({
    selector: 'app-signin',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        AuthCard,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        CheckboxModule,
        MessageModule,
        DividerModule
    ],
    template: `
        <!-- 28rem e nao 26rem: em 26rem a linha "Mantenha-me conectado" +
             "Recuperar senha" somava 355px num espaco de 352px e quebrava. -->
        <app-auth-card largura="max-w-[28rem]">
            <form [formGroup]="form" (ngSubmit)="entrar()" novalidate class="flex flex-col gap-4">
                <!-- Usuario -->
                <div class="flex flex-col gap-2">
                    <label for="usuario" class="font-medium text-color">Usuario</label>
                    <input
                        pInputText
                        id="usuario"
                        formControlName="usuario"
                        placeholder="Digite"
                        autocomplete="username"
                        [invalid]="mostrarErro('usuario')"
                    />
                    @if (mostrarErro('usuario')) {
                        <p-message severity="error" size="small" variant="simple">
                            Informe seu usuario.
                        </p-message>
                    }
                </div>

                <!-- Senha -->
                <div class="flex flex-col gap-2">
                    <label for="senha" class="font-medium text-color">Senha</label>
                    <p-password
                        inputId="senha"
                        formControlName="senha"
                        placeholder="Digite"
                        [toggleMask]="true"
                        [feedback]="false"
                        autocomplete="current-password"
                        styleClass="w-full"
                        [inputStyleClass]="'w-full'"
                        [invalid]="mostrarErro('senha')"
                    />
                    @if (mostrarErro('senha')) {
                        <p-message severity="error" size="small" variant="simple">
                            A senha precisa ter ao menos 4 caracteres.
                        </p-message>
                    }
                </div>

                <!-- Manter conectado + recuperar: sempre na mesma linha.
                     Sem flex-wrap; o rotulo encolhe antes de quebrar. -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2 min-w-0">
                        <p-checkbox inputId="manterConectado" formControlName="manterConectado" [binary]="true" />
                        <label for="manterConectado" class="text-color cursor-pointer truncate">
                            Mantenha-me conectado
                        </label>
                    </div>
                    <a
                        routerLink="/login/recuperar-senha"
                        class="text-primary font-medium no-underline hover:underline whitespace-nowrap shrink-0"
                    >
                        Recuperar senha
                    </a>
                </div>

                <p-button type="submit" label="Entrar" styleClass="w-full" [loading]="entrando()" />
            </form>

            <p-divider>
                <span class="text-muted-color text-sm">Ou</span>
            </p-divider>

            <!--
                Provedores externos. As marcas ID Goias e gov.br nao foram
                fornecidas como asset; quando chegarem, entram como <img> antes
                do rotulo, seguindo a regra de docs/08-marca.md.
            -->
            <div class="flex flex-col gap-3">
                <p-button
                    label="Entrar com ID Goias"
                    severity="primary"
                    [outlined]="true"
                    [rounded]="true"
                    styleClass="w-full"
                    (onClick)="entrarComProvedor('ID Goias')"
                />
                <p-button
                    label="Entrar com gov.br"
                    severity="primary"
                    [outlined]="true"
                    [rounded]="true"
                    styleClass="w-full"
                    (onClick)="entrarComProvedor('gov.br')"
                />
            </div>

            <!-- Avisos legais -->
            <div class="mt-6 flex flex-col gap-3 text-center text-xs text-muted-color">
                <p class="m-0">
                    Utilizamos cookies do navegador para rastrear sua sessao e oferecer uma experiencia melhor. Voce
                    pode consultar a nossa
                    <a routerLink="/login/politica-de-cookie" class="text-color font-semibold no-underline hover:underline">
                        Politica de Cookie</a
                    >
                    para mais detalhes.
                </p>
                <p class="m-0">
                    Ao fazer o login, voce concorda com nossa
                    <a routerLink="/login/politica-de-privacidade" class="text-color font-semibold no-underline hover:underline">
                        Politica de Privacidade</a
                    >
                </p>
            </div>
        </app-auth-card>
    `
})
export class Signin {
    private readonly fb = inject(FormBuilder);
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);
    private readonly notificacao = inject(NotificacaoService);

    protected readonly entrando = signal(false);
    protected readonly enviado = signal(false);

    protected readonly form = this.fb.nonNullable.group({
        usuario: ['', [Validators.required]],
        senha: ['', [Validators.required, Validators.minLength(4)]],
        manterConectado: [false]
    });

    protected mostrarErro(campo: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[campo];
        return control.invalid && (control.touched || this.enviado());
    }

    protected async entrar(): Promise<void> {
        this.enviado.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.entrando.set(true);
        try {
            const { usuario, manterConectado } = this.form.getRawValue();
            await this.login.entrar(usuario, manterConectado);
            void this.router.navigate(['/login/terms-of-use']);
        } finally {
            this.entrando.set(false);
        }
    }

    protected async entrarComProvedor(provedor: string): Promise<void> {
        this.notificacao.informacao(`Integracao com ${provedor} ainda nao configurada.`);
        await this.login.entrar(`usuario.${provedor.toLowerCase().replace(/[^a-z]/g, '')}`, false);
        void this.router.navigate(['/login/terms-of-use']);
    }
}
