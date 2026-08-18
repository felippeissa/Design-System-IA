import { Component, input } from '@angular/core';

/**
 * Cartao de uma secao da tela de visualizacao.
 *
 * Use um por assunto. Com uma secao so, omita o titulo — o cartao aparece sem
 * cabecalho, como no template de secao unica.
 *
 * Os campos vao dentro, num <dl> de 1/2/4 colunas, com <app-campo-exibicao>.
 */
@Component({
    selector: 'app-secao-exibicao',
    host: { class: 'block' },
    template: `
        <section class="p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
            @if (titulo()) {
                <h2 class="text-base font-bold text-color m-0 mb-4">{{ titulo() }}</h2>
            }
            <!--
                Grid mobile-first com os breakpoints padrao do Tailwind:
                1 coluna, 2 no md e 4 no lg. Gutter de 24px (gap-6).

                Campos que precisam de mais largura recebem col-span na
                propria tag, no ponto de uso.
            -->
            <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 m-0">
                <ng-content />
            </dl>
        </section>
    `
})
export class SecaoExibicao {
    readonly titulo = input<string>();
}
