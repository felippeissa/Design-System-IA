import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'informatiza:theme';
const DARK_CLASS = 'informatiza-dark';

type Mode = 'light' | 'dark';

/**
 * Alterna entre claro e escuro adicionando/removendo a classe
 * `informatiza-dark` no <html>. Essa classe e a mesma configurada em
 * `darkModeSelector` no app.config.ts e no @custom-variant do styles.scss.
 *
 * A preferencia persiste em localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly _mode = signal<Mode>(this.readInitialMode());

    readonly mode = this._mode.asReadonly();

    constructor() {
        effect(() => {
            const mode = this._mode();
            document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
            localStorage.setItem(STORAGE_KEY, mode);
        });
    }

    toggle(): void {
        this._mode.update((m) => (m === 'dark' ? 'light' : 'dark'));
    }

    private readInitialMode(): Mode {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
