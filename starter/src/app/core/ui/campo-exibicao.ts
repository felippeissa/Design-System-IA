import { Component, input } from '@angular/core';

/**
 * Par rotulo + conteudo das telas de visualizacao.
 *
 * Este e o tijolo das telas somente leitura. Nunca use <input disabled> para
 * exibir dado: campo desabilitado sugere que existiria edicao, tem contraste
 * pior e e anunciado como controle de formulario por leitores de tela.
 *
 * LARGURA: o componente nao tem input de colunas. Quando um campo precisar de
 * mais espaco, passe o utilitario do Tailwind direto na tag:
 *
 *     <app-campo-exibicao rotulo="Observacoes" [valor]="obs()" class="md:col-span-2 lg:col-span-4" />
 *
 * E o jeito que o Tailwind recomenda — utilitario no ponto de uso, em vez de
 * uma API de componente traduzindo numero para classe. Angular aplica o `class`
 * estatico no elemento host, que e o proprio item do grid.
 */
@Component({
    selector: 'app-campo-exibicao',
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

    /** Texto exibido quando nao ha valor. */
    readonly vazio = input('Nao informado');
}
