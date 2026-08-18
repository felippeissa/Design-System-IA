import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

/**
 * TEMPLATE DE REFERENCIA: layout das telas publicas (autenticacao).
 *
 * Usado por tudo que fica FORA da aplicacao logada: login, termos, consentimento,
 * escolha de perfil. Diferente do AppShell, aqui nao existe menu nem topbar —
 * apenas o fundo e um card centralizado.
 *
 * O <p-toast> e declarado UMA UNICA VEZ aqui. As telas apenas injetam o
 * MessageService.
 */
@Component({
    selector: 'app-auth-layout',
    imports: [RouterOutlet, ToastModule],
    template: `
        <!-- Largura fixa de 350px e altura adaptativa, conforme as diretrizes
             do componente. A duracao (3000ms) vem do NotificacaoService. -->
        <p-toast position="top-right" [style]="{ width: '350px' }" />

        <!--
            flex-col + justify-center centraliza na vertical E deixa o eixo
            horizontal em align-items:stretch, entao o card ocupa a largura
            toda e o proprio max-w dele define o tamanho.

            Com "flex items-center justify-center" o card virava item flex no
            eixo horizontal e encolhia conforme o conteudo — telas com o mesmo
            max-w acabavam com larguras diferentes.
        -->
        <div class="min-h-screen flex flex-col justify-center p-4 bg-[var(--p-primary-50)] dark:bg-surface-950">
            <router-outlet />
        </div>
    `
})
export class AuthLayout {}
