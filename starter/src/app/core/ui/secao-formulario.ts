import { Component, input } from '@angular/core';

/**
 * Cartao de uma secao de formulario.
 *
 * Espelho do <app-secao-exibicao>, mas com o grid de 12 colunas em vez de 4,
 * porque em formulario a largura do campo acompanha a quantidade de texto que
 * se digita, e 12 colunas dao proporcoes como 8/4 e 7/5. Ver docs/05-formularios.md.
 *
 * Use um cartao por assunto. As acoes ficam FORA, no fundo da pagina.
 */
@Component({
    selector: 'app-secao-formulario',
    host: { class: 'block' },
    template: `
        <section class="p-4 sm:p-6 rounded-border border border-surface bg-surface-0 dark:bg-surface-900">
            @if (titulo()) {
                <h2 class="text-base font-bold text-color m-0 mb-1">{{ titulo() }}</h2>
            }
            @if (descricao()) {
                <p class="text-muted-color text-sm mt-0 mb-4">{{ descricao() }}</p>
            } @else if (titulo()) {
                <div class="mb-4"></div>
            }

            <div class="grid grid-cols-12 gap-4">
                <ng-content />
            </div>
        </section>
    `
})
export class SecaoFormulario {
    readonly titulo = input<string>();
    readonly descricao = input<string>();
}
