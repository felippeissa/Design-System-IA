import { Routes } from '@angular/router';
import { AppShell } from './core/layout/app-shell';

/**
 * Toda tela entra como filha de AppShell, para herdar topbar,
 * navegacao, toast e confirm dialog.
 *
 * Use SEMPRE loadComponent (lazy). Nunca importe a tela estaticamente aqui.
 * O parametro :id chega no componente via `input()` por causa do
 * withComponentInputBinding() configurado em app.config.ts.
 */
export const routes: Routes = [
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
