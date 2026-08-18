# Formulários

Referência viva: `starter/src/app/features/clientes/cliente-form.ts`.

---

## Estrutura obrigatória

Sempre `ReactiveFormsModule` com `fb.nonNullable.group`. Nunca `ngModel` solto,
nunca `FormGroup` não tipado.

```ts
protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    situacao: ['ativo' as SituacaoCliente, [Validators.required]]
});
```

Campo de união de literais (`'ativo' | 'inativo'`) precisa da anotação de tipo,
senão o TypeScript infere só o literal inicial e `patchValue` quebra.

---

## Anatomia de um campo

```html
<div class="col-span-12 md:col-span-6 flex flex-col gap-2">
    <label for="nome" class="font-medium text-color">Razao social *</label>
    <input pInputText id="nome" formControlName="nome"
           placeholder="Ex.: Aurora Tecnologia Ltda"
           [invalid]="mostrarErro('nome')" />
    @if (mostrarErro('nome')) {
        <p-message severity="error" size="small" variant="simple">
            Informe a razao social (minimo 3 caracteres).
        </p-message>
    }
</div>
```

Quatro elementos, sempre nesta ordem: `<label for>`, controle com `[invalid]`,
mensagem condicional. O wrapper é `flex flex-col gap-2`.

Em componentes PrimeNG o atributo é **`inputId`**, não `id`:

```html
<label for="uf">UF *</label>
<p-select inputId="uf" formControlName="uf" [options]="ufOptions" />
```

---

## Quando mostrar o erro

Nunca antes de o usuário interagir. O padrão do DS:

```ts
protected readonly enviado = signal(false);

protected mostrarErro(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || this.enviado());
}
```

Erro aparece se o campo foi tocado **ou** se houve tentativa de submit.

---

## Submit

```ts
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
        await this.service.create(this.form.getRawValue());
        this.messages.add({ severity: 'success', summary: 'Registro salvo' });
        void this.router.navigate(['/clientes']);
    } catch {
        this.messages.add({ severity: 'error', summary: 'Nao foi possivel salvar' });
    } finally {
        this.salvando.set(false);
    }
}
```

`<form>` sempre com `(ngSubmit)` e `novalidate` — a validação é do Angular, não
do navegador.

---

## Criar e editar na mesma tela

O parâmetro de rota chega por `input()` (graças a `withComponentInputBinding()`):

```ts
readonly id = input<string | undefined>();

protected readonly edicao = computed(() => !!this.id());
protected readonly titulo = computed(() =>
    this.edicao() ? 'Editar cliente' : 'Novo cliente'
);

constructor() {
    effect(() => {
        const id = this.id();
        if (!id) return;
        void this.carregar(id);
    });
}

private async carregar(id: string): Promise<void> {
    const registro = await this.service.getById(id);
    if (!registro) {
        this.naoEncontrado.set(true);
        return;
    }
    this.form.patchValue(registro);
}
```

Trate sempre o caso "não encontrado" — o usuário pode colar uma URL inválida.

---

## Grid responsivo

Grid de 12 colunas com Tailwind, mobile-first:

```html
<div class="grid grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-8">...</div>  <!-- campo largo -->
    <div class="col-span-12 md:col-span-4">...</div>  <!-- campo curto -->
    <div class="col-span-12 md:col-span-6">...</div>  <!-- meia largura -->
</div>
```

No celular tudo empilha (`col-span-12`). Larguras proporcionais entram a partir
de `md:`.

Formulário longo: agrupe em `<p-card>` ou `<p-fieldset>` por assunto. Acima de
uns 15 campos, considere `<p-stepper>`.

---

## Rodapé de ações

Sempre no fim, alinhado à direita, primária por último:

```html
<ng-template #footer>
    <div class="flex justify-end gap-2 pt-2">
        <p-button label="Cancelar" severity="secondary" [outlined]="true"
                  routerLink="/clientes" [disabled]="salvando()" />
        <p-button type="submit" label="Salvar" icon="pi pi-check"
                  [loading]="salvando()" />
    </div>
</ng-template>
```

---

## Máscaras brasileiras

```html
<p-inputmask inputId="cnpj" formControlName="documento" mask="99.999.999/9999-99" />
<p-inputmask inputId="cpf" formControlName="cpf" mask="999.999.999-99" />
<p-inputmask inputId="cep" formControlName="cep" mask="99999-999" />
<p-inputmask inputId="telefone" formControlName="telefone" mask="(99) 99999-9999" />
```

Moeda e data usam componentes próprios:

```html
<p-inputnumber inputId="valor" formControlName="valor"
               mode="currency" currency="BRL" locale="pt-BR" [min]="0" />

<p-datepicker inputId="data" formControlName="data"
              dateFormat="dd/mm/yy" [showIcon]="true" />
```

O locale `pt-BR` já está registrado globalmente em `app.config.ts`.

---

## Validadores customizados

Coloque em `core/validators/`, um arquivo por validador:

```ts
export function cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const digitos = String(control.value ?? '').replace(/\D/g, '');
        if (!digitos) return null;
        return digitos.length === 14 ? null : { cnpj: true };
    };
}
```

A máscara garante o formato, não a validade. Se o requisito pedir validação real
de CPF/CNPJ, implemente o cálculo dos dígitos verificadores.
