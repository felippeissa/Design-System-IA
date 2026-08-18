import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';
import { InformatizaPreset } from './core/theme/informatiza-preset';

// Registra os dados de localizacao pt-BR usados por DatePipe, CurrencyPipe e DecimalPipe.
registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        provideRouter(routes, withComponentInputBinding()),
        providePrimeNG({
            theme: {
                preset: InformatizaPreset,
                options: {
                    // Dark mode por classe (ver ThemeService).
                    darkModeSelector: '.informatiza-dark',
                    // Ordem das cascade layers: permite que utilitarios Tailwind
                    // sobrescrevam o PrimeNG sem "!important".
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng, utilities'
                    }
                }
            },
            ripple: true,
            // Traducoes globais pt-BR dos textos internos dos componentes.
            translation: {
                accept: 'Sim',
                reject: 'Nao',
                cancel: 'Cancelar',
                clear: 'Limpar',
                apply: 'Aplicar',
                emptyMessage: 'Nenhum resultado encontrado',
                emptyFilterMessage: 'Nenhum resultado para o filtro',
                emptySelectionMessage: 'Nenhum item selecionado',
                emptySearchMessage: 'Nenhum resultado encontrado',
                choose: 'Escolher',
                upload: 'Enviar',
                today: 'Hoje',
                weak: 'Fraca',
                medium: 'Media',
                strong: 'Forte',
                passwordPrompt: 'Digite uma senha',
                dayNames: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
                dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                monthNames: [
                    'Janeiro',
                    'Fevereiro',
                    'Marco',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro'
                ],
                monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                firstDayOfWeek: 0,
                dateFormat: 'dd/mm/yy'
            }
        }),
        MessageService,
        ConfirmationService
    ]
};
