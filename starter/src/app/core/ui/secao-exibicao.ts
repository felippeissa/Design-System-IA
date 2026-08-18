import { Component, input } from '@angular/core';

/**
 * Cartao de uma secao da tela de visualizacao.
 *
 * Use um por assunto. Com uma secao so, omita o titulo — o cartao aparece sem
 * cabecalho, como no template de secao unica.
 *
 * Os campos vao dentro, em <dl> de 6 colunas, usando <app-campo-exibicao>.
 */
@Component({
    selector: 'app-secao-exibicao',
    host: { class: 'block' },
    template: `
        <section class="p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
            @if (titulo()) {
                <h2 class="text-base font-bold text-color m-0 mb-4">{{ titulo() }}</h2>
            }
            <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-4 m-0">
                <ng-content />
            </dl>
        </section>
    `
})
export class SecaoExibicao {
    readonly titulo = input<string>();
}
