# Requisito de tela — modelo

Copie este arquivo, preencha e entregue à IA junto com o link do repositório.

**Por que o formato importa:** requisito em prosa solta gera tela solta. Quanto
mais previsível a entrada, mais previsível a saída. Não precisa preencher tudo —
o que faltar, a IA assume o padrão do design system e informa no fim.

---

## 1. Identificação

- **Nome da tela:**
- **Rota desejada:** `/`
- **Tipo:** listagem | formulário | dashboard | detalhe | outro
- **Objetivo em uma frase:**

## 2. Entidade

- **Nome (singular):**
- **Nome (plural):**

### Campos

| Campo | Tipo | Obrigatório | Regras / observações |
| --- | --- | --- | --- |
|  | texto / número / moeda / data / lista / booleano |  |  |

Para campo do tipo lista, informe os valores possíveis e o rótulo de cada um.

## 3. O que aparece na listagem

- **Colunas visíveis:**
- **Ordenação padrão:**
- **Filtros:**
- **Campos cobertos pela busca:**

## 4. Ações

| Ação | Onde fica | Efeito |
| --- | --- | --- |
| Criar | botão do cabeçalho | abre `/<entidade>/novo` |
| Editar | ícone na linha | abre `/<entidade>/:id` |
| Excluir | ícone na linha | confirma e remove |

Descreva também ações específicas do negócio (aprovar, cancelar, exportar,
duplicar), dizendo em que situação ficam desabilitadas.

## 5. Regras de negócio

Uma por linha, objetiva:

- Ex.: limite de crédito só pode ser preenchido se a situação for "ativo".
- Ex.: pedido cancelado não pode ser editado.

## 6. Indicadores (só para dashboard)

| Indicador | Como calcular |
| --- | --- |
|  |  |

## 7. Observações

Qualquer coisa que não coube acima. Se houver print, wireframe ou tela
equivalente no sistema atual, mencione aqui.

---

## Exemplo preenchido

> **Nome:** Pedidos de venda
> **Rota:** `/pedidos`
> **Tipo:** listagem
> **Objetivo:** acompanhar os pedidos emitidos e alterar a situação deles.
>
> **Entidade:** Pedido / Pedidos
>
> | Campo | Tipo | Obrig. | Regras |
> | --- | --- | --- | --- |
> | numero | texto | sim | formato `AAAA/NNNN`, único |
> | clienteId | lista | sim | referência a Cliente |
> | valor | moeda | sim | maior que zero |
> | situacao | lista | sim | rascunho, aprovado, cancelado |
> | emitidoEm | data | sim | não pode ser futura |
>
> **Colunas:** número, cliente, valor, emissão, situação
> **Ordenação padrão:** emissão, mais recente primeiro
> **Filtros:** situação, período de emissão
> **Busca:** número e nome do cliente
>
> **Ações:** criar, editar, excluir, e "Aprovar" (visível só quando a situação
> for rascunho; muda para aprovado e mostra toast de sucesso).
>
> **Regras:**
> - pedido aprovado ou cancelado não pode ser editado nem excluído;
> - o valor total da listagem filtrada aparece no rodapé.
