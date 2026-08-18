import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { NotificacaoService } from '../../core/ui/notificacao.service';

import { AuthCard } from './auth-card';
import { LoginService } from '../../core/data/login.service';
import { PERFIS } from '../../core/data/login.model';

/**
 * TEMPLATE DE REFERENCIA: selecao de contexto com um nivel.
 *
 * Variante enxuta de organization-profile, usada quando o usuario pertence a um
 * unico orgao e so precisa escolher o perfil.
 */
@Component({
    selector: 'app-profile',
    imports: [ReactiveFormsModule, AuthCard, ButtonModule, SelectModule, CheckboxModule, MessageModule],
    template: `
        <app-auth-card>
            <form [formGroup]="form" (ngSubmit)="continuar()" novalidate>
                <h1 class="text-base font-semibold text-color text-center m-0 mb-5">
                    Escolha um perfil para acessar o sistema.
                </h1>

                <div class="flex flex-col gap-2 mb-4">
                    <label for="perfil" class="font-medium text-color">Perfil</label>
                    <p-select
                        inputId="perfil"
                        formControlName="perfil"
                        [options]="perfis"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Escolha uma opcao"
                        styleClass="w-full"
                        [invalid]="mostrarErro('perfil')"
                    />
                    @if (mostrarErro('perfil')) {
                        <p-message severity="error" size="small" variant="simple">Selecione o perfil.</p-message>
                    }
                </div>

                <div class="flex items-center gap-2 mb-6">
                    <p-checkbox inputId="lembrar" formControlName="lembrarEscolha" [binary]="true" />
                    <label for="lembrar" class="text-color cursor-pointer">Lembrar minha escolha</label>
                </div>

                <!-- flex-1 vai no host <p-button>; w-full no <button> interno.
                     styleClass="flex-1" sozinho nao funciona: a classe cai no
                     botao, que nao e o filho flex do container. -->
                <div class="flex gap-3">
                    <p-button
                        label="Cancelar"
                        severity="primary"
                        [outlined]="true"
                        class="flex-1"
                        styleClass="w-full"
                        [disabled]="entrando()"
                        (onClick)="cancelar()"
                    />
                    <p-button
                        type="submit"
                        label="Continuar"
                        class="flex-1"
                        styleClass="w-full"
                        [loading]="entrando()"
                    />
                </div>
            </form>
        </app-auth-card>
    `
})
export class Profile {
    private readonly fb = inject(FormBuilder);
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);
    private readonly notificacao = inject(NotificacaoService);

    protected readonly perfis = PERFIS;

    protected readonly entrando = signal(false);
    protected readonly enviado = signal(false);

    protected readonly form = this.fb.nonNullable.group({
        perfil: ['', [Validators.required]],
        lembrarEscolha: [true]
    });

    protected mostrarErro(campo: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[campo];
        return control.invalid && (control.touched || this.enviado());
    }

    protected continuar(): void {
        this.enviado.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.entrando.set(true);
        const { perfil, lembrarEscolha } = this.form.getRawValue();
        this.login.definirPerfil(perfil, lembrarEscolha);

        this.notificacao.sucesso('Acesso liberado. Redirecionando para o sistema.');
        void this.router.navigate(['/']);
    }

    protected cancelar(): void {
        this.login.sair();
        void this.router.navigate(['/login/signin']);
    }
}
