# Visualização e filtros de consulta

Dois padrões extraídos direto do Figma (`Informatiza 3.0`, página `🖥️ Templates`).

---

## Visualização (detalhe somente leitura)

Referência viva: `features/clientes/cliente-visualizar.ts`.
Rota: `/clientes/:id/visualizar`.

### Estrutura

1. Título `Visualizar <nome do registro>`
2. Um ou mais cartões de seção, com grid de **1 / 2 / 4 colunas**
3. Cada campo é um par **rótulo em negrito + conteúdo**
4. Ações no canto inferior direito, **fora** dos cartões

Com uma seção só, omita o título do cartão. Com várias, cada uma recebe seu nome.

```html
<app-secao-exibicao titulo="Identificacao">
    <app-campo-exibicao rotulo="Razao social" [valor]="cliente().nome" class="md:col-span-2" />
    <app-campo-exibicao rotulo="CNPJ" [valor]="cliente().documento" />
    <app-campo-exibicao rotulo="Observacoes" [valor]="observacoes()" class="md:col-span-2 lg:col-span-4" />
</app-secao-exibicao>
```

O componente não tem input de colunas: a largura vai como utilitário do Tailwind
na própria tag. É o que a documentação do Tailwind recomenda — utilitário no
ponto de uso, em vez de uma API traduzindo número para classe.

### Regras

**Nunca use `<input disabled>` para exibir dado.** Campo desabilitado sugere que
existiria edição, tem contraste pior e é anunciado como controle de formulário
por leitores de tela. Use `<app-campo-exibicao>`, que renderiza `<dt>`/`<dd>`.

**Campo sem valor mostra "Não informado"** em cor esmaecida — nunca deixe a
célula vazia, que é ambíguo entre "não tem" e "não carregou".

**Texto longo recebe `col-span` na própria tag**, em vez de espremer numa
célula. O Figma anota: *"Quando o conteúdo for grande, como uma descrição, fica
a critério do designer a melhor organização."*

**Lista de múltipla escolha vira texto separado por ponto e vírgula.** O Figma
permite também espaçamento entre linhas ou tabela, conforme o caso.

**Span só quando o conteúdo precisa.** Nunca para fechar linha, nunca para dar
simetria. Se a seção tem 3 campos curtos num grid de 4 colunas, a última coluna
fica vazia — e tudo bem. Esticar um campo para preencher passa a impressão
errada de que ele tem mais conteúdo.

Erramos isso três vezes na mesma tela antes de nomear a regra: um `col-span-2`
dava 440px a um campo cujo texto ocupava 126px, e o "UF" chegou a receber 440px
para exibir duas letras. Na dúvida, meça o texto antes de dar span.

**Situação como texto, não `<p-tag>`.** Tag é para listagem, onde ajuda a varrer
muitas linhas. No detalhe, o conteúdo é textual.

---

## Filtros de consulta

Referência viva: `features/clientes/clientes-lista.ts`.

### Estrutura

Cartão próprio acima da tabela, campos em grid, e as ações no canto inferior
direito **nesta ordem**:

1. `Mais filtros` / `Menos filtros` — botão de texto com ícone de funil
2. `Limpar` — contornado
3. `Filtrar` — preenchido

O bloco avançado começa **recolhido**. Só os campos essenciais aparecem de
início; o resto entra ao expandir.

```html
<div class="flex flex-wrap items-center justify-end gap-3 mt-4">
    <p-button [label]="filtrosAvancados() ? 'Menos filtros' : 'Mais filtros'"
              [icon]="filtrosAvancados() ? 'pi pi-filter-slash' : 'pi pi-filter'"
              [text]="true"
              (onClick)="filtrosAvancados.set(!filtrosAvancados())" />
    <p-button label="Limpar" severity="primary" [outlined]="true" (onClick)="limparFiltros()" />
    <p-button label="Filtrar" icon="pi pi-search" (onClick)="aplicarFiltros()" />
</div>
```

### Por que "Filtrar" não faz nada

Os filtros são signals e o `computed` recalcula a cada digitação — a lista já
responde sozinha. O botão existe porque o template do design system o prevê e
porque reforça a ação para quem espera confirmar a busca. O método fica vazio,
com comentário explicando. **Não** troque isso por filtragem manual: duplicaria
o estado e quebraria a reatividade.

`Limpar` zera todos os filtros, inclusive os avançados que estiverem recolhidos.

---

## O shell ganhou peças

Os templates mostram elementos que faltavam no `AppShell`:

- **Rodapé** com copyright, estado e versão, em todas as telas
- **Nome do usuário e botão de sair** na topbar
- **Campo de busca** no topo do menu lateral, que filtra os itens

O breadcrumb dos templates (`início > página anterior > página atual`) ainda
**não** foi implementado.

---

## O que ainda falta dos templates do Figma

| Template | Situação |
| --- | --- |
| Página inicial | Dashboard próprio, diferente do desenho |
| Tipos de Login | Não iniciado |
| Menus | Menu lateral simples; falta megamenu e submenus |
| Breadcrumb | Não implementado |
| Barra de acessibilidade | **Removida a pedido**, mas está nos templates |
| Modais de cadastro | `confirmdialog` existe; falta a anotação "Cancelar cadastro: modal obrigatório" |

A barra de acessibilidade merece destaque: ela aparece no topo de **todos** os
templates do Figma, como instância `acessbilitybar`. Foi implementada e depois
removida a pedido; o código está no commit `dc1a41a`.
