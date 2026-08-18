import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Preset visual da Informatiza.
 *
 * Baseado no Aura (preset padrao do PrimeNG 21), com a paleta da marca
 * sobreposta via `definePreset`.
 *
 * >>> PONTO DE CUSTOMIZACAO DA MARCA <<<
 * Para aplicar as cores oficiais da Informatiza, troque APENAS os hex de
 * `primary` abaixo (escala 50..950). Nao altere nomes de tokens.
 * Gere a escala em https://primeng.org/theming/styled ou com qualquer
 * ferramenta de paleta 50-950.
 *
 * NUNCA escreva cores fixas (#hex) nos componentes de tela. Sempre use os
 * tokens semanticos: bg-primary, text-primary, bg-surface-100,
 * text-muted-color, border-surface, etc.
 */
export const InformatizaPreset = definePreset(Aura, {
    semantic: {
        // Paleta da marca Informatiza: emerald.
        primary: {
            50: '{emerald.50}',
            100: '{emerald.100}',
            200: '{emerald.200}',
            300: '{emerald.300}',
            400: '{emerald.400}',
            500: '{emerald.500}',
            600: '{emerald.600}',
            700: '{emerald.700}',
            800: '{emerald.800}',
            900: '{emerald.900}',
            950: '{emerald.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            }
        }
    },
    primitive: {
        // Cantos levemente mais suaves que o Aura padrao.
        borderRadius: {
            none: '0',
            xs: '2px',
            sm: '4px',
            md: '6px',
            lg: '8px',
            xl: '12px'
        }
    }
});
