import { Routes } from '@angular/router';
import { AppShell } from './core/layout/app-shell';
import { AuthLayout } from './core/layout/auth-layout';

/**
 * Duas arvores de rota, cada uma com seu layout:
 *
 * - AuthLayout: telas publicas (fluxo de login). Barra gov.br + card centralizado.
 * - AppShell:   aplicacao logada. Topbar, menu, toast e confirm dialog.
 *
 * Use SEMPRE loadComponent (lazy). Nunca importe a tela estaticamente aqui.
 * O parametro :id chega no componente via `input()` por causa do
 * withComponentInputBinding() configurado em app.config.ts.
 *
 * Nao existe guarda de rota: nao ha autenticacao real (ver LoginService).
 * As telas de login sao navegaveis diretamente, de proposito.
 */
export const routes: Routes = [
    // ---------------------------------------------------------------
    // Fluxo de autenticacao
    // ---------------------------------------------------------------
    {
        path: 'login',
        component: AuthLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'signin' },
            {
                path: 'signin',
                title: 'Entrar | Informatiza',
                loadComponent: () => import('./features/login/signin').then((m) => m.Signin)
            },
            {
                path: 'terms-of-use',
                title: 'Termos de uso | Informatiza',
                loadComponent: () => import('./features/login/terms-of-use').then((m) => m.TermsOfUse)
            },
            {
                path: 'consent',
                title: 'Consentimento | Informatiza',
                loadComponent: () => import('./features/login/consent').then((m) => m.Consent)
            },
            {
                path: 'profile',
                title: 'Escolha de perfil | Informatiza',
                loadComponent: () => import('./features/login/profile').then((m) => m.Profile)
            },
            {
                path: 'organization-profile',
                title: 'Orgao e perfil | Informatiza',
                loadComponent: () =>
                    import('./features/login/organization-profile').then((m) => m.OrganizationProfile)
            }
        ]
    },

    // ---------------------------------------------------------------
    // Aplicacao
    // ---------------------------------------------------------------
    {
        path: '',
        component: AppShell,
        children: [
            {
                path: '',
                title: 'Dashboard | Informatiza',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
            },
            {
                path: 'clientes',
                title: 'Clientes | Informatiza',
                loadComponent: () => import('./features/clientes/clientes-lista').then((m) => m.ClientesLista)
            },
            {
                path: 'clientes/novo',
                title: 'Novo cliente | Informatiza',
                loadComponent: () => import('./features/clientes/cliente-form').then((m) => m.ClienteForm)
            },
            {
                path: 'clientes/:id',
                title: 'Editar cliente | Informatiza',
                loadComponent: () => import('./features/clientes/cliente-form').then((m) => m.ClienteForm)
            }
        ]
    },

    { path: '**', redirectTo: '' }
];
