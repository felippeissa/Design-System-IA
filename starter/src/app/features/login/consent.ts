import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';

import { AuthCard } from './auth-card';
import { LoginService } from '../../core/data/login.service';
import { ATRIBUTOS_CONSENTIMENTO, DURACAO_APROVACAO, DuracaoAprovacao } from '../../core/data/login.model';

/**
 * TEMPLATE DE REFERENCIA: consentimento de compartilhamento de dados.
 *
 * Padrao de lista de permissoes com "selecionar todas": o estado do checkbox
 * mestre e DERIVADO dos filhos (computed), nunca guardado em paralelo — do
 * contrario as duas fontes divergem.
 *
 * Atributos obrigatorios ficam sempre marcados e desabilitados, com asterisco
 * no rotulo e legenda explicando a marcacao.
 */
@Component({
    selector: 'app-consent',
    imports: [RouterLink, FormsModule, AuthCard, ButtonModule, CheckboxModule, RadioButtonModule, DividerModule],
    template: `
        <app-auth-card largura="max-w-[28rem]">
            <h1 class="text-lg font-semibold text-color m-0">Verifique alguns dos seus dados:</h1>
            <p class="text-muted-color text-sm mt-2 mb-4">
                Ao selecionar os seguintes atributos voce concorda em compartilha-los com a aplicacao.
            </p>

            <!-- Selecionar todas: estado derivado dos filhos -->
            <div class="flex items-center gap-2 mb-3">
                <p-checkbox
                    inputId="todas"
                    [binary]="true"
                    [ngModel]="todasMarcadas()"
                    [indeterminate]="parcialmenteMarcadas()"
                    (ngModelChange)="alternarTodas($event)"
                />
                <label for="todas" class="text-color cursor-pointer">Selecionar todas</label>
            </div>

            <div class="flex flex-col gap-3">
                @for (atributo of atributos; track atributo.chave) {
                    <div class="flex items-center gap-2">
                        <p-checkbox
                            [inputId]="atributo.chave"
                            [binary]="true"
                            [disabled]="atributo.obrigatorio"
                            [ngModel]="estaMarcado(atributo.chave)"
                            (ngModelChange)="alternar(atributo.chave, $event)"
                        />
                        <label
                            [for]="atributo.chave"
                            class="cursor-pointer"
                            [class.text-color]="!atributo.obrigatorio"
                            [class.text-muted-color]="atributo.obrigatorio"
                        >
                            {{ atributo.label }}@if (atributo.obrigatorio) {<span aria-hidden="true">&nbsp;*</span>}
                        </label>
                    </div>
                }
            </div>

            <p class="text-muted-color text-xs mt-4 mb-0">
                As reivindicacoes obrigatorias estao marcadas com um asterisco (*).
            </p>

            <p-divider />

            <h2 class="text-base font-semibold text-color m-0">Verifique se a aplicacao e confiavel</h2>
            <p class="text-muted-color text-sm mt-2 mb-4">
                Certifique-se de que a aplicacao Informatiza 3.0 esta habilitada para receber informacoes
                confidenciais. Para obter mais detalhes sobre como seus dados serao tratados, recomendamos a leitura
                cuidadosa de nossa
                <a routerLink="/login/politica-de-privacidade" class="text-primary no-underline hover:underline">
                    Politica de Privacidade</a
                >.
            </p>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                @for (opcao of duracoes; track opcao.value) {
                    <div class="flex items-center gap-2">
                        <p-radiobutton
                            [inputId]="opcao.value"
                            name="duracao"
                            [value]="opcao.value"
                            [ngModel]="duracao()"
                            (ngModelChange)="duracao.set($event)"
                        />
                        <label [for]="opcao.value" class="text-color cursor-pointer">{{ opcao.label }}</label>
                    </div>
                }
            </div>

            <!-- Os dois botoes dividem a largura do card em partes iguais.
                 flex-1 no host <p-button>, w-full no <button> interno. -->
            <div class="flex gap-3 mt-6">
                <p-button
                    label="Cancelar"
                    severity="primary"
                    [outlined]="true"
                    class="flex-1"
                    styleClass="w-full"
                    (onClick)="cancelar()"
                />
                <p-button label="Continuar" class="flex-1" styleClass="w-full" (onClick)="continuar()" />
            </div>
        </app-auth-card>
    `
})
export class Consent {
    private readonly login = inject(LoginService);
    private readonly router = inject(Router);

    protected readonly atributos = ATRIBUTOS_CONSENTIMENTO;
    protected readonly duracoes = DURACAO_APROVACAO;

    protected readonly duracao = signal<DuracaoAprovacao>('uma-vez');

    /** Comeca com tudo marcado, como no portal do Estado. */
    private readonly marcados = signal<Set<string>>(new Set(ATRIBUTOS_CONSENTIMENTO.map((a) => a.chave)));

    protected readonly todasMarcadas = computed(() => this.marcados().size === this.atributos.length);

    protected readonly parcialmenteMarcadas = computed(() => {
        const total = this.marcados().size;
        return total > 0 && total < this.atributos.length;
    });

    protected estaMarcado(chave: string): boolean {
        return this.marcados().has(chave);
    }

    protected alternar(chave: string, marcado: boolean): void {
        this.marcados.update((atual) => {
            const proximo = new Set(atual);
            if (marcado) {
                proximo.add(chave);
            } else {
                proximo.delete(chave);
            }
            return proximo;
        });
    }

    /** Desmarcar tudo preserva os obrigatorios. */
    protected alternarTodas(marcar: boolean): void {
        this.marcados.set(
            new Set(
                marcar
                    ? this.atributos.map((a) => a.chave)
                    : this.atributos.filter((a) => a.obrigatorio).map((a) => a.chave)
            )
        );
    }

    protected continuar(): void {
        this.login.aprovarAtributos([...this.marcados()], this.duracao());
        void this.router.navigate(['/login/organization-profile']);
    }

    protected cancelar(): void {
        this.login.sair();
        void this.router.navigate(['/login/signin']);
    }
}
