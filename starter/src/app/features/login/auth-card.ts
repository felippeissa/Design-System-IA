import { Component, inject, input } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';

/**
 * Moldura compartilhada das telas de autenticacao: card branco centralizado
 * com o logo no topo.
 *
 * Evita repetir a mesma estrutura nas cinco telas do fluxo. O conteudo de cada
 * tela entra por projecao (<ng-content>).
 *
 * O logo troca de variante conforme o tema — ver docs/08-marca.md.
 */
@Component({
    selector: 'app-auth-card',
    template: `
        <section
            class="w-full bg-surface-0 dark:bg-surface-900 border border-surface rounded-xl shadow-sm p-6 sm:p-8"
            [class]="largura()"
        >
            <img
                [src]="theme.mode() === 'dark' ? 'logo-informatiza-dark.svg' : 'logo-informatiza.svg'"
                alt="Informatiza 3.0"
                width="139"
                height="30"
                class="h-8 w-auto mx-auto mb-6"
            />

            <ng-content />
        </section>
    `
})
export class AuthCard {
    /** Classe de largura maxima. Telas de texto longo usam um card mais largo. */
    readonly largura = input('max-w-[26rem]');

    protected readonly theme = inject(ThemeService);
}
