/**
 * Opcoes e tipos do fluxo de autenticacao.
 *
 * Sem backend: os valores abaixo alimentam os selects das telas de login.
 * Substitua pelos dados reais quando existir integracao.
 */

export interface OpcaoSelecao {
    label: string;
    value: string;
}

/** Perfis de acesso. */
export const PERFIS: OpcaoSelecao[] = [
    { label: 'Administrador', value: 'administrador' },
    { label: 'Gestor', value: 'gestor' },
    { label: 'Servidor', value: 'servidor' },
    { label: 'Auditor', value: 'auditor' },
    { label: 'Consulta', value: 'consulta' }
];

/** Orgaos do Estado de Goias. */
export const ORGAOS: OpcaoSelecao[] = [
    { label: 'SEAD - Secretaria de Estado da Administracao', value: 'sead' },
    { label: 'SEFAZ - Secretaria de Estado da Economia', value: 'sefaz' },
    { label: 'SES - Secretaria de Estado da Saude', value: 'ses' },
    { label: 'SEDUC - Secretaria de Estado da Educacao', value: 'seduc' },
    { label: 'SEINFRA - Secretaria de Estado da Infraestrutura', value: 'seinfra' },
    { label: 'SSP - Secretaria de Estado da Seguranca Publica', value: 'ssp' },
    { label: 'GOIASPREV - Goias Previdencia', value: 'goiasprev' },
    { label: 'PROCON GOIAS', value: 'procon' }
];

/**
 * Atributos que a aplicacao solicita ao provedor de identidade.
 * `obrigatorio` marca os que nao podem ser desmarcados (exibidos com *).
 */
export interface AtributoConsentimento {
    chave: string;
    label: string;
    obrigatorio: boolean;
}

export const ATRIBUTOS_CONSENTIMENTO: AtributoConsentimento[] = [
    { chave: 'celular', label: 'Celular', obrigatorio: false },
    { chave: 'nomeCompleto', label: 'Nome completo', obrigatorio: true },
    { chave: 'cpf', label: 'CPF', obrigatorio: true },
    { chave: 'emailPessoal', label: 'Email pessoal', obrigatorio: false },
    { chave: 'nome', label: 'Nome', obrigatorio: true },
    { chave: 'emailCorporativo', label: 'Email corporativo', obrigatorio: false }
];

export type DuracaoAprovacao = 'uma-vez' | 'sempre';

export const DURACAO_APROVACAO: OpcaoSelecao[] = [
    { label: 'Aprovar uma vez', value: 'uma-vez' },
    { label: 'Aprovar sempre', value: 'sempre' }
];

/** Texto dos termos de uso exibido na tela de aceite. */
export const TERMOS_DE_USO = `Ao utilizar este sistema, o usuario declara que leu, compreendeu e concorda integralmente com os termos abaixo descritos. Este documento estabelece as condicoes de uso para acesso e utilizacao das ferramentas, funcionalidades e informacoes disponibilizadas por meio do Portal Goias - Aplicacoes Expresso, mantido pelo Governo do Estado de Goias.

1. Finalidade do Sistema

O portal tem como objetivo fornecer acesso a aplicacoes, servicos e dados de carater administrativo, informacional e operacional, destinados exclusivamente a servidores publicos, colaboradores autorizados e entes vinculados a administracao publica estadual.

2. Acesso e Responsabilidade do Usuario

O acesso ao sistema e pessoal e intransferivel. O usuario e responsavel pela guarda de suas credenciais e por todas as operacoes realizadas com elas. O compartilhamento de senha e vedado e sujeita o responsavel as sancoes administrativas cabiveis.

3. Uso Adequado

E vedado utilizar o sistema para finalidade diversa da institucional, tentar obter acesso nao autorizado a dados ou funcionalidades, ou praticar qualquer ato que comprometa a disponibilidade, a integridade ou a confidencialidade das informacoes.

4. Tratamento de Dados Pessoais

Os dados pessoais tratados no ambito deste sistema observam a Lei Geral de Protecao de Dados Pessoais (Lei 13.709/2018). O tratamento se limita as finalidades institucionais declaradas nesta politica.

5. Registro de Atividades

As operacoes realizadas no sistema sao registradas em log, incluindo data, hora, identificacao do usuario e acao executada. Os registros podem ser utilizados para fins de auditoria e apuracao de responsabilidade.

6. Disponibilidade

O Governo do Estado de Goias empreendera esforcos para manter o sistema disponivel, ressalvadas as interrupcoes necessarias para manutencao programada, atualizacoes de seguranca ou eventos fora de seu controle.

7. Alteracoes destes Termos

Estes termos podem ser alterados a qualquer tempo. A continuidade do uso apos a publicacao de nova versao implica concordancia com o texto vigente.

8. Aceite

Ao selecionar a opcao de concordancia, o usuario manifesta aceite livre, expresso e informado das condicoes aqui estabelecidas.`;
