import { Entity } from './mock-collection';

export type SituacaoCliente = 'ativo' | 'inativo' | 'pendente';

export interface Cliente extends Entity {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    cidade: string;
    uf: string;
    situacao: SituacaoCliente;
    limiteCredito: number;
    cadastradoEm: string;
}

/** Rotulos e severidades para exibir a situacao com <p-tag>. */
export const SITUACAO_CLIENTE: Record<SituacaoCliente, { label: string; severity: 'success' | 'danger' | 'warn' }> = {
    ativo: { label: 'Ativo', severity: 'success' },
    inativo: { label: 'Inativo', severity: 'danger' },
    pendente: { label: 'Pendente', severity: 'warn' }
};

/** Opcoes prontas para <p-select> e <p-selectbutton>. */
export const SITUACAO_OPTIONS = (Object.keys(SITUACAO_CLIENTE) as SituacaoCliente[]).map((value) => ({
    label: SITUACAO_CLIENTE[value].label,
    value
}));

export const UF_OPTIONS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
].map((uf) => ({ label: uf, value: uf }));
