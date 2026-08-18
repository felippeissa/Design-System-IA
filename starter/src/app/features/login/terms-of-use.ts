import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { AuthCard } from './auth-card';
import { LoginService } from '../../core/data/login.service';
import { TERMOS_DE_USO } from '../../core/data/login.model';

/**
 * TEMPLATE DE REFERENCIA: aceite de termos.
 *
 * Padrao para qualquer tela de texto longo com decisao binaria: card mais
 * largo, area rolavel de altura fixa e duas acoes de peso equivalente no
 * rodape — recusar como secundaria, aceitar como primaria.
 *
 * O texto rolavel usa <p-scrollpanel> em vez de overflow puro para manter a
 * barra de rolagem coerente com o tema.
 */
@Component({
    selector: 'app-terms-of-use',
    imports: [AuthCard, ButtonModule, ScrollPanelModule],
    template: `
        <app-auth-card largura="max-w-[52rem]">
            <h1 class="text-lg sm:text-xl font-semibold text-color text-center m-0 mb-5">
                Veja nossos termos de uso para acessar o sistema
            </h1>

            <p-scrollpanel [style]="{ width: '100%', height: '24rem' }" styleClass="pr-4">
                <div class="text-color leading-relaxed whitespace-pre-line pr-2">{{ termos }}</div>
            </p-scrollpanel>

            <div class="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                <p-button
                    label="Li e nao concordo com os termos de uso"
                    severity="primary"
                    [outlined]="true"
                    (onClick)="recusar()"
                />
                <p-button label="Li e concordo com os termos de uso" (onClick)="aceitar()" />
            </div>
        </app-auth-card>
    `
})
export class TermsOfUse {
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);

    protected readonly termos = TERMOS_DE_USO;

    protected aceitar(): void {
        this.login.aceitarTermos();
        void this.router.navigate(['/login/consent']);
    }

    protected recusar(): void {
        // Recusar encerra a sessao e devolve o usuario a tela de entrada.
        this.login.recusarTermos();
        void this.router.navigate(['/login/signin']);
    }
}
