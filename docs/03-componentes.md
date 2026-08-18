# Catálogo de componentes

Mapa de decisão: **necessidade → componente**. Use a coluna "doc" para abrir a
API completa em `referencia/primeng/components/<doc>.md` quando precisar de
propriedades específicas.

Regra geral: **se existe componente PrimeNG para o caso, use-o.** Não construa
com `<div>` o que o PrimeNG já resolve.

---

## Entrada de dados

| Necessidade | Componente | doc |
| --- | --- | --- |
| Texto curto | `pInputText` (diretiva em `<input>`) | `inputtext` |
| Texto longo | `pTextarea` | `textarea` |
| Número, moeda, percentual | `<p-inputnumber>` | `inputnumber` |
| CPF, CNPJ, CEP, telefone, data fixa | `<p-inputmask>` | `inputmask` |
| Senha | `<p-password>` | `password` |
| Código / OTP | `<p-inputotp>` | `inputotp` |
| Data ou período | `<p-datepicker>` | `datepicker` |
| Escolha única em lista | `<p-select>` | `select` |
| Escolha múltipla em lista | `<p-multiselect>` | `multiselect` |
| Escolha única, poucas opções visíveis | `<p-selectbutton>` | `selectbutton` |
| Busca com sugestão | `<p-autocomplete>` | `autocomplete` |
| Seleção hierárquica | `<p-treeselect>` / `<p-cascadeselect>` | `treeselect` |
| Sim/não | `<p-toggleswitch>` | `toggleswitch` |
| Marcar vários | `<p-checkbox>` | `checkbox` |
| Uma opção entre poucas | `<p-radiobutton>` | `radiobutton` |
| Valor em faixa | `<p-slider>` | `slider` |
| Avaliação por estrelas | `<p-rating>` | `rating` |
| Upload de arquivo | `<p-fileupload>` | `fileupload` |
| Cor | `<p-colorpicker>` | `colorpicker` |
| Texto rico | `<p-editor>` | `editor` |

Agrupamento e rótulos: `<p-inputgroup>` (`inputgroup`),
`<p-iconfield>` + `<p-inputicon>` (`iconfield`), `<p-floatlabel>` (`floatlabel`).

**No Informatiza DS o padrão é label acima do campo**, não float label.

---

## Exibição de dados

| Necessidade | Componente | doc |
| --- | --- | --- |
| Tabela com paginação, ordenação, filtro | `<p-table>` | `table` |
| Tabela hierárquica | `<p-treetable>` | `treetable` |
| Lista em cards / grid | `<p-dataview>` | `dataview` |
| Árvore | `<p-tree>` | `tree` |
| Gráfico | `<p-chart>` | `chart` |
| Linha do tempo | `<p-timeline>` | `timeline` |
| Organograma | `<p-organizationchart>` | `organizationchart` |
| Carrossel | `<p-carousel>` | `carousel` |
| Galeria de imagens | `<p-galleria>` | `galleria` |
| Paginação isolada | `<p-paginator>` | `paginator` |

`<p-table>` é o padrão para qualquer listagem. Use `<p-dataview>` só quando o
requisito pedir explicitamente cartões.

---

## Estrutura e layout

| Necessidade | Componente | doc |
| --- | --- | --- |
| Bloco de conteúdo | `<p-card>` | `card` |
| Barra de ações | `<p-toolbar>` | `toolbar` |
| Seção recolhível | `<p-accordion>` / `<p-panel>` | `accordion` |
| Agrupar campos | `<p-fieldset>` | `fieldset` |
| Abas | `<p-tabs>` | `tabs` |
| Passo a passo | `<p-stepper>` | `stepper` |
| Divisor | `<p-divider>` | `divider` |
| Painéis redimensionáveis | `<p-splitter>` | `splitter` |
| Área com rolagem própria | `<p-scrollpanel>` | `scrollpanel` |

Para grid e espaçamento use **Tailwind**, não componentes.

---

## Navegação

| Necessidade | Componente | doc |
| --- | --- | --- |
| Menu lateral / sanduíche | `<p-drawer>` | `drawer` |
| Menu horizontal | `<p-menubar>` | `menubar` |
| Menu lateral com submenus | `<p-panelmenu>` | `panelmenu` |
| Trilha de navegação | `<p-breadcrumb>` | `breadcrumb` |
| Menu de contexto | `<p-contextmenu>` | `contextmenu` |
| Menu suspenso simples | `<p-menu>` | `menu` |
| Botão com menu | `<p-splitbutton>` | `splitbutton` |
| Ações flutuantes | `<p-speeddial>` | `speeddial` |

---

## Feedback

| Necessidade | Componente | doc |
| --- | --- | --- |
| Notificação temporária | `MessageService` + `<p-toast>` | `toast` |
| Mensagem fixa na tela | `<p-message>` | `message` |
| Confirmação de ação | `ConfirmationService` + `<p-confirmdialog>` | `confirmdialog` |
| Confirmação junto ao botão | `<p-confirmpopup>` | `confirmpopup` |
| Janela modal | `<p-dialog>` | `dialog` |
| Modal aberto por serviço | `DialogService` | `dynamicdialog` |
| Carregando (barra) | `<p-progressbar>` | `progressbar` |
| Carregando (spinner) | `<p-progressspinner>` | `progressspinner` |
| Carregando (esqueleto) | `<p-skeleton>` | `skeleton` |
| Bloquear área durante carga | `<p-blockui>` | `blockui` |
| Dica ao passar o mouse | `pTooltip` | `tooltip` |
| Conteúdo em popover | `<p-popover>` | `popover` |

**Regra:** enquanto os dados carregam pela primeira vez, use `<p-skeleton>`.
Spinner só para ações pontuais. `[loading]="true"` no próprio botão durante submit.

---

## Sinalização

| Necessidade | Componente | doc |
| --- | --- | --- |
| Status / situação | `<p-tag>` | `tag` |
| Contador em ícone | `<p-badge>` | `badge` |
| Item removível | `<p-chip>` | `chip` |
| Foto / iniciais | `<p-avatar>` | `avatar` |
| Indicador circular | `<p-knob>` | `knob` |
| Métrica com progresso | `<p-metergroup>` | `metergroup` |

Severidades de `<p-tag>` e `<p-button>`: `success`, `info`, `warn`, `danger`,
`secondary`, `contrast`. Mapeie a situação da entidade num objeto exportado do
`model.ts` (ver `SITUACAO_CLIENTE`), nunca com `@if` encadeado no template.

---

## Botões

Sempre `<p-button>`, nunca `<button>` cru.

```html
<!-- Ação principal da tela: uma só, preenchida -->
<p-button label="Salvar" icon="pi pi-check" />

<!-- Ação secundária -->
<p-button label="Cancelar" severity="secondary" [outlined]="true" />

<!-- Ação destrutiva -->
<p-button label="Excluir" severity="danger" />

<!-- Ícone puro: ariaLabel e pTooltip são obrigatórios -->
<p-button icon="pi pi-pencil" [text]="true" [rounded]="true"
          pTooltip="Editar" ariaLabel="Editar registro" />

<!-- Durante submit -->
<p-button type="submit" label="Salvar" [loading]="salvando()" />
```

Ícones: catálogo completo em `referencia/primeng/pages/icons.md`. Os mais usados
são `pi-plus`, `pi-pencil`, `pi-trash`, `pi-search`, `pi-filter`, `pi-check`,
`pi-times`, `pi-download`, `pi-upload`, `pi-refresh`, `pi-arrow-left`,
`pi-ellipsis-v`, `pi-user`, `pi-users`, `pi-home`, `pi-cog`, `pi-inbox`.

---

## Componentes que exigem licença paga (não use)

`Scheduler`, `TextEditor`, `TaskBoard` e os gráficos do **PrimeUI Pro** são
produto comercial separado e **não estão licenciados** aqui. Para agenda use
`<p-datepicker>`; para quadro de tarefas monte com `<p-card>` + `cdkDragDrop`;
para gráficos use `<p-chart>`.
