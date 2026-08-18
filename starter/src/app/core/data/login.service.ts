import { Injectable, computed, signal } from '@angular/core';
import { DuracaoAprovacao } from './login.model';

const CHAVE = 'informatiza:login';

interface EstadoLogin {
    usuario: string | null;
    manterConectado: boolean;
    termosAceitos: boolean;
    atributosAprovados: string[];
    duracaoAprovacao: DuracaoAprovacao | null;
    perfil: string | null;
    orgao: string | null;
    lembrarEscolha: boolean;
}

const ESTADO_INICIAL: EstadoLogin = {
    usuario: null,
    manterConectado: false,
    termosAceitos: false,
    atributosAprovados: [],
    duracaoAprovacao: null,
    perfil: null,
    orgao: null,
    lembrarEscolha: true
};

/**
 * Estado do fluxo de autenticacao, persistido em localStorage.
 *
 * NAO e autenticacao de verdade: nao existe backend, nao ha validacao de
 * credencial e nada aqui protege rota nenhuma. O objetivo e demonstrar o fluxo
 * de telas e guardar o que o usuario escolheu em cada etapa.
 *
 * Quando existir provedor de identidade real, troque a implementacao destes
 * metodos mantendo a mesma superficie publica.
 */
@Injectable({ providedIn: 'root' })
export class LoginService {
    private readonly _estado = signal<EstadoLogin>(this.ler());

    readonly estado = this._estado.asReadonly();
    readonly usuario = computed(() => this._estado().usuario);
    readonly autenticado = computed(() => this._estado().usuario !== null);
    readonly termosAceitos = computed(() => this._estado().termosAceitos);

    /** Simula a latencia de um provedor de identidade. */
    private readonly latencia = 400;

    async entrar(usuario: string, manterConectado: boolean): Promise<void> {
        await this.espera();
        this.gravar({ ...this._estado(), usuario, manterConectado });
    }

    aceitarTermos(): void {
        this.gravar({ ...this._estado(), termosAceitos: true });
    }

    recusarTermos(): void {
        this.sair();
    }

    aprovarAtributos(atributos: string[], duracao: DuracaoAprovacao): void {
        this.gravar({ ...this._estado(), atributosAprovados: atributos, duracaoAprovacao: duracao });
    }

    definirPerfil(perfil: string, lembrarEscolha: boolean): void {
        this.gravar({ ...this._estado(), perfil, lembrarEscolha });
    }

    definirOrgaoEPerfil(orgao: string, perfil: string, lembrarEscolha: boolean): void {
        this.gravar({ ...this._estado(), orgao, perfil, lembrarEscolha });
    }

    sair(): void {
        localStorage.removeItem(CHAVE);
        this._estado.set({ ...ESTADO_INICIAL });
    }

    // ----------------------------------------------------------------

    private gravar(estado: EstadoLogin): void {
        this._estado.set(estado);
        localStorage.setItem(CHAVE, JSON.stringify(estado));
    }

    private ler(): EstadoLogin {
        const bruto = localStorage.getItem(CHAVE);
        if (!bruto) {
            return { ...ESTADO_INICIAL };
        }
        try {
            return { ...ESTADO_INICIAL, ...(JSON.parse(bruto) as EstadoLogin) };
        } catch {
            return { ...ESTADO_INICIAL };
        }
    }

    private espera(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, this.latencia));
    }
}
