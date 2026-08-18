import { Component, input } from '@angular/core';

/**
 * Par rotulo + conteudo das telas de visualizacao.
 *
 * Este e o tijolo das telas somente leitura. Nunca use <input disabled> para
 * exibir dado: campo desabilitado sugere que existiria edicao, tem contraste
 * pior e e anunciado como controle de formulario por leitores de tela.
 *
 * Largura: por padrao ocupa 1 das 6 colunas do grid. Campos de texto longo
 * ocupam mais colunas via `colunas`.
 */
@Component({
    selector: 'app-campo-exibicao',
    host: { '[class]': 'classeColunas()' },
    template: `
        <dt class="font-bold text-color m-0">{{ rotulo() }}</dt>
        <dd class="text-color m-0 mt-0.5 break-words">
            @if (valor()) {
                {{ valor() }}
            } @else {
                <span class="text-muted-color">{{ vazio() }}</span>
            }
        </dd>
    `
})
export class CampoExibicao {
    readonly rotulo = input.required<string>();
    readonly valor = input<string | number | null | undefined>();

    /** Quantas colunas do grid de 6 o campo ocupa. */
    readonly colunas = input<1 | 2 | 3 | 4 | 5 | 6>(1);

    /** Texto exibido quando nao ha valor. */
    readonly vazio = input('Nao informado');

    protected classeColunas(): string {
        // Classes completas, e nao interpoladas, para o Tailwind conseguir
        // encontra-las durante o scan do codigo-fonte.
        const mapa: Record<number, string> = {
            1: 'col-span-1',
            2: 'col-span-1 sm:col-span-2',
            3: 'col-span-1 sm:col-span-2 lg:col-span-3',
            4: 'col-span-1 sm:col-span-2 lg:col-span-4',
            5: 'col-span-1 sm:col-span-2 lg:col-span-5',
            6: 'col-span-1 sm:col-span-2 lg:col-span-6'
        };
        return mapa[this.colunas()];
    }
}
