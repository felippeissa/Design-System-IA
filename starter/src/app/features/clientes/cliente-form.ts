import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { ClientesService } from '../../core/data/clientes.service';
import { SITUACAO_OPTIONS, SituacaoCliente, UF_OPTIONS } from '../../core/data/cliente.model';

/**
 * TEMPLATE DE REFERENCIA: formulario de cadastro/edicao.
 *
 * Serve para criar (rota /clientes/novo) e editar (rota /clientes/:id).
 * A mesma tela cobre os dois casos, decidindo pelo input `id`.
 *
 * Regras de formulario no Informatiza DS:
 * - sempre ReactiveFormsModule tipado, nunca ngModel avulso;
 * - grid responsivo de 12 colunas com utilitarios Tailwind;
 * - todo campo tem <label for> ligado ao id do controle;
 * - erro so aparece depois de tocado ou apos submit (ver `mostrarErro`);
 * - a mensagem de erro usa <p-message severity="error" size="small">;
 * - o botao de salvar desabilita enquanto a operacao esta em curso.
 */
@Component({
    selector: 'app-cliente-form',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputMaskModule,
        InputNumberModule,
        SelectModule,
        SelectButtonModule,
        MessageModule,
        CardModule
    ],
    template: `
        <div class="max-w-4xl mx-auto">
            <!-- Cabecalho -->
            <div class="flex items-center gap-3 mb-6">
                <p-button
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    [text]="true"
                    [rounded]="true"
                    routerLink="/clientes"
                    ariaLabel="Voltar para a listagem"
                />
                <div>
                    <h1 class="text-2xl font-semibold text-color m-0">{{ titulo() }}</h1>
                    <p class="text-muted-color mt-1 mb-0">Os campos marcados com * sao obrigatorios.</p>
                </div>
            </div>

            @if (naoEncontrado()) {
                <p-message severity="error" text="Cliente nao encontrado." styleClass="w-full" />
            } @else {
                <form [formGroup]="form" (ngSubmit)="salvar()" novalidate>
                    <p-card>
                        <div class="grid grid-cols-12 gap-4">
                            <!-- Nome -->
                            <div class="col-span-12 md:col-span-8 flex flex-col gap-2">
                                <label for="nome" class="font-medium text-color">Razao social *</label>
                                <input
                                    pInputText
                                    id="nome"
                                    formControlName="nome"
                                    placeholder="Ex.: Aurora Tecnologia Ltda"
                                    [invalid]="mostrarErro('nome')"
                                    autocomplete="organization"
                                />
                                @if (mostrarErro('nome')) {
                                    <p-message severity="error" size="small" variant="simple">
                                        Informe a razao social (minimo 3 caracteres).
                                    </p-message>
                                }
                            </div>

                            <!-- Documento -->
                            <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                                <label for="documento" class="font-medium text-color">CNPJ *</label>
                                <p-inputmask
                                    inputId="documento"
                                    formControlName="documento"
                                    mask="99.999.999/9999-99"
                                    placeholder="00.000.000/0000-00"
                                    [invalid]="mostrarErro('documento')"
                                />
                                @if (mostrarErro('documento')) {
                                    <p-message severity="error" size="small" variant="simple">
                                        Informe um CNPJ completo.
                                    </p-message>
                                }
                            </div>

                            <!-- E-mail -->
                            <div class="col-span-12 md:col-span-7 flex flex-col gap-2">
                                <label for="email" class="font-medium text-color">E-mail *</label>
                                <input
                                    pInputText
                                    id="email"
                                    type="email"
                                    formControlName="email"
                                    placeholder="contato@empresa.com.br"
                                    [invalid]="mostrarErro('email')"
                                    autocomplete="email"
                                />
                                @if (mostrarErro('email')) {
                                    <p-message severity="error" size="small" variant="simple">
                                        Informe um e-mail valido.
                                    </p-message>
                                }
                            </div>

                            <!-- Telefone -->
                            <div class="col-span-12 md:col-span-5 flex flex-col gap-2">
                                <label for="telefone" class="font-medium text-color">Telefone</label>
                                <p-inputmask
                                    inputId="telefone"
                                    formControlName="telefone"
                                    mask="(99) 99999-9999"
                                    placeholder="(11) 90000-0000"
                                />
                            </div>

                            <!-- Cidade -->
                            <div class="col-span-12 md:col-span-8 flex flex-col gap-2">
                                <label for="cidade" class="font-medium text-color">Cidade *</label>
                                <input
                                    pInputText
                                    id="cidade"
                                    formControlName="cidade"
                                    placeholder="Ex.: Belo Horizonte"
                                    [invalid]="mostrarErro('cidade')"
                                />
                                @if (mostrarErro('cidade')) {
                                    <p-message severity="error" size="small" variant="simple">
                                        Informe a cidade.
                                    </p-message>
                                }
                            </div>

                            <!-- UF -->
                            <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                                <label for="uf" class="font-medium text-color">UF *</label>
                                <p-select
                                    inputId="uf"
                                    formControlName="uf"
                                    [options]="ufOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Selecione"
                                    [filter]="true"
                                    [invalid]="mostrarErro('uf')"
                                />
                                @if (mostrarErro('uf')) {
                                    <p-message severity="error" size="small" variant="simple">
                                        Selecione a UF.
                                    </p-message>
                                }
                            </div>

                            <!-- Limite de credito -->
                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="limiteCredito" class="font-medium text-color">Limite de credito</label>
                                <p-inputnumber
                                    inputId="limiteCredito"
                                    formControlName="limiteCredito"
                                    mode="currency"
                                    currency="BRL"
                                    locale="pt-BR"
                                    [min]="0"
                                />
                            </div>

                            <!-- Situacao -->
                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label class="font-medium text-color">Situacao *</label>
                                <p-selectbutton
                                    formControlName="situacao"
                                    [options]="situacaoOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    [allowEmpty]="false"
                                    ariaLabelledBy="Situacao do cliente"
                                />
                            </div>
                        </div>

                        <!-- Acoes: sempre no rodape, primaria a direita -->
                        <ng-template #footer>
                            <div class="flex justify-end gap-2 pt-2">
                                <p-button
                                    label="Cancelar"
                                    severity="secondary"
                                    [outlined]="true"
                                    routerLink="/clientes"
                                    [disabled]="salvando()"
                                />
                                <p-button
                                    type="submit"
                                    label="Salvar"
                                    icon="pi pi-check"
                                    [loading]="salvando()"
                                />
                            </div>
                        </ng-template>
                    </p-card>
                </form>
            }
        </div>
    `
})
export class ClienteForm {
    /** Vem da rota /clientes/:id via withComponentInputBinding(). */
    readonly id = input<string | undefined>();

    private readonly fb = inject(FormBuilder);
    private readonly service = inject(ClientesService);
    private readonly router = inject(Router);
    private readonly messages = inject(MessageService);

    protected readonly situacaoOptions = SITUACAO_OPTIONS;
    protected readonly ufOptions = UF_OPTIONS;

    protected readonly salvando = signal(false);
    protected readonly enviado = signal(false);
    protected readonly naoEncontrado = signal(false);

    protected readonly edicao = computed(() => !!this.id());
    protected readonly titulo = computed(() => (this.edicao() ? 'Editar cliente' : 'Novo cliente'));

    protected readonly form = this.fb.nonNullable.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        documento: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        telefone: [''],
        cidade: ['', [Validators.required]],
        uf: ['', [Validators.required]],
        limiteCredito: [0],
        situacao: ['ativo' as SituacaoCliente, [Validators.required]]
    });

    constructor() {
        // Em modo edicao, carrega o registro e popula o formulario.
        effect(() => {
            const id = this.id();
            if (!id) {
                return;
            }
            void this.carregar(id);
        });
    }

    /** Erro so aparece depois que o usuario tocou no campo ou tentou enviar. */
    protected mostrarErro(campo: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[campo];
        return control.invalid && (control.touched || this.enviado());
    }

    protected async salvar(): Promise<void> {
        this.enviado.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messages.add({
                severity: 'warn',
                summary: 'Verifique o formulario',
                detail: 'Existem campos obrigatorios nao preenchidos.'
            });
            return;
        }

        this.salvando.set(true);
        try {
            const dados = this.form.getRawValue();
            const id = this.id();

            if (id) {
                await this.service.update(id, dados);
                this.messages.add({ severity: 'success', summary: 'Cliente atualizado' });
            } else {
                await this.service.create({ ...dados, cadastradoEm: new Date().toISOString().slice(0, 10) });
                this.messages.add({ severity: 'success', summary: 'Cliente cadastrado' });
            }

            void this.router.navigate(['/clientes']);
        } catch {
            this.messages.add({
                severity: 'error',
                summary: 'Nao foi possivel salvar',
                detail: 'Tente novamente em instantes.'
            });
        } finally {
            this.salvando.set(false);
        }
    }

    private async carregar(id: string): Promise<void> {
        const cliente = await this.service.getById(id);
        if (!cliente) {
            this.naoEncontrado.set(true);
            return;
        }
        this.form.patchValue(cliente);
    }
}
