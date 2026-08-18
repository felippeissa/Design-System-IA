import { Injectable, effect, signal } from '@angular/core';

const CHAVE_ESCALA = 'informatiza:a11y:escala';
const CHAVE_CONTRASTE = 'informatiza:a11y:contraste';
const CLASSE_CONTRASTE = 'informatiza-contraste';

/** Tamanho base em px aplicado no <html>. O padrao do navegador e 16. */
const ESCALAS = [14, 16, 18, 20, 22] as const;
const INDICE_PADRAO = 1;

/**
 * Controles de acessibilidade da barra gov.br.
 *
 * A escala de fonte funciona alterando o font-size do <html>. Como o PrimeNG e
 * o Tailwind medem tudo em rem, a interface inteira acompanha — componentes,
 * espacamentos e bordas. Nao existe CSS por tela para isso.
 *
 * O alto contraste liga a classe `informatiza-contraste` no <html>, que
 * sobrescreve os tokens de superficie e texto em styles.css.
 *
 * Ambas as preferencias persistem em localStorage.
 */
@Injectable({ providedIn: 'root' })
export class AcessibilidadeService {
    private readonly _indiceEscala = signal(this.lerEscala());
    private readonly _altoContraste = signal(this.lerContraste());

    readonly altoContraste = this._altoContraste.asReadonly();

    /** Tamanho base atual, em px. */
    readonly tamanhoBase = () => ESCALAS[this._indiceEscala()];

    readonly podeDiminuir = () => this._indiceEscala() > 0;
    readonly podeAumentar = () => this._indiceEscala() < ESCALAS.length - 1;

    constructor() {
        effect(() => {
            const indice = this._indiceEscala();
            document.documentElement.style.fontSize = `${ESCALAS[indice]}px`;
            localStorage.setItem(CHAVE_ESCALA, String(indice));
        });

        effect(() => {
            const ligado = this._altoContraste();
            document.documentElement.classList.toggle(CLASSE_CONTRASTE, ligado);
            localStorage.setItem(CHAVE_CONTRASTE, String(ligado));
        });
    }

    diminuirFonte(): void {
        this._indiceEscala.update((i) => Math.max(0, i - 1));
    }

    /** Volta ao tamanho padrao. */
    normalizarFonte(): void {
        this._indiceEscala.set(INDICE_PADRAO);
    }

    aumentarFonte(): void {
        this._indiceEscala.update((i) => Math.min(ESCALAS.length - 1, i + 1));
    }

    alternarContraste(): void {
        this._altoContraste.update((v) => !v);
    }

    private lerEscala(): number {
        const bruto = localStorage.getItem(CHAVE_ESCALA);
        // Sem o teste de null, Number(null) vira 0 — que e um indice valido e
        // faria a aplicacao abrir sempre na menor fonte em vez da padrao.
        if (bruto === null) {
            return INDICE_PADRAO;
        }
        const salvo = Number(bruto);
        return Number.isInteger(salvo) && salvo >= 0 && salvo < ESCALAS.length ? salvo : INDICE_PADRAO;
    }

    private lerContraste(): boolean {
        return localStorage.getItem(CHAVE_CONTRASTE) === 'true';
    }
}
