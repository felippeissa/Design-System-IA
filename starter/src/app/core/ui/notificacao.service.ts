import { Injectable, inject, isDevMode } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Limites de texto definidos pelas diretrizes do componente. */
export const LIMITE_TITULO = 34;
export const LIMITE_DESCRICAO = 81;

/** Duracao minima. Pode ser maior, nunca menor. */
export const DURACAO_MINIMA = 3000;

/** Titulos padrao por severidade, usados quando nao ha personalizacao. */
const TITULO_PADRAO = {
    success: 'Sucesso',
    info: 'Informacao',
    warn: 'Atencao',
    error: 'Erro'
} as const;

type Severidade = keyof typeof TITULO_PADRAO;

/**
 * Emissao de toasts conforme as diretrizes do design system.
 *
 * Use SEMPRE este service, nunca o MessageService direto. Ele garante:
 *
 * - estrutura Titulo + Descricao, ambos obrigatorios;
 * - titulo padrao por severidade quando nao ha personalizacao;
 * - duracao minima de 3000ms;
 * - mensagens de sucesso padronizadas para criar, editar e excluir;
 * - aviso em desenvolvimento quando o texto estoura os limites.
 *
 * Os limites vem do desenho do componente: o titulo ocupa 1 linha (34
 * caracteres) e a descricao no maximo 2 linhas (81 caracteres). Passar disso
 * nao quebra o layout, porque a altura e adaptativa, mas descaracteriza o
 * componente.
 */
@Injectable({ providedIn: 'root' })
export class NotificacaoService {
    private readonly messages = inject(MessageService);

    // ---------------------------------------------------------------
    // Mensagens de sucesso padronizadas
    //
    // Use estes tres metodos sempre que o requisito nao especificar um
    // texto proprio. Padronizar agiliza prototipacao e desenvolvimento.
    // ---------------------------------------------------------------

    /** "<Registro> criado com sucesso." */
    criado(registro: string): void {
        this.sucesso(`${registro} criado com sucesso.`);
    }

    /** "<Registro> atualizado com sucesso." */
    atualizado(registro: string): void {
        this.sucesso(`${registro} atualizado com sucesso.`);
    }

    /** "<Registro> excluido com sucesso." */
    excluido(registro: string): void {
        this.sucesso(`${registro} excluido com sucesso.`);
    }

    // ---------------------------------------------------------------
    // Severidades
    // ---------------------------------------------------------------

    /** Confirmacao de acao bem-sucedida. */
    sucesso(descricao: string, titulo?: string): void {
        this.emitir('success', descricao, titulo);
    }

    /** Informacoes e avisos neutros. */
    informacao(descricao: string, titulo?: string): void {
        this.emitir('info', descricao, titulo);
    }

    /** Atencao antes de acao, ou possivel problema. */
    atencao(descricao: string, titulo?: string): void {
        this.emitir('warn', descricao, titulo);
    }

    /** Erros, falhas ou acoes bloqueadas. */
    erro(descricao: string, titulo?: string): void {
        this.emitir('error', descricao, titulo);
    }

    /** Remove os toasts em exibicao. */
    limpar(): void {
        this.messages.clear();
    }

    // ---------------------------------------------------------------

    private emitir(severity: Severidade, descricao: string, titulo?: string): void {
        const summary = titulo ?? TITULO_PADRAO[severity];

        if (isDevMode()) {
            this.avisarSeExcedeu('Titulo', summary, LIMITE_TITULO);
            this.avisarSeExcedeu('Descricao', descricao, LIMITE_DESCRICAO);
        }

        this.messages.add({
            severity,
            summary,
            detail: descricao,
            life: DURACAO_MINIMA
        });
    }

    private avisarSeExcedeu(campo: string, texto: string, limite: number): void {
        if (texto.length > limite) {
            console.warn(
                `[Informatiza DS] ${campo} do toast com ${texto.length} caracteres, ` +
                    `acima do limite de ${limite}: "${texto}"`
            );
        }
    }
}
