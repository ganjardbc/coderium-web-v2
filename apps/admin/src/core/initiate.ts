import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { setupRouter } from './global-routes';
import { setupStores } from './global-stores';
import { setupStyles } from './global-styles';

const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
    },
    secondary: {
      50: 'var(--secondary-50)',
      100: 'var(--secondary-100)',
      200: 'var(--secondary-200)',
      300: 'var(--secondary-300)',
      400: 'var(--secondary-400)',
      500: 'var(--secondary-500)',
      600: 'var(--secondary-600)',
      700: 'var(--secondary-700)',
      800: 'var(--secondary-800)',
      900: 'var(--secondary-900)',
    },
    accent: {
      50: 'var(--accent-50)',
      100: 'var(--accent-100)',
      200: 'var(--accent-200)',
      300: 'var(--accent-300)',
      400: 'var(--accent-400)',
      500: 'var(--accent-500)',
      600: 'var(--accent-600)',
      700: 'var(--accent-700)',
      800: 'var(--accent-800)',
      900: 'var(--accent-900)',
    },
    tertiary: {
      50: 'var(--tertiary-50)',
      100: 'var(--tertiary-100)',
      200: 'var(--tertiary-200)',
      300: 'var(--tertiary-300)',
      400: 'var(--tertiary-400)',
      500: 'var(--tertiary-500)',
      600: 'var(--tertiary-600)',
      700: 'var(--tertiary-700)',
      800: 'var(--tertiary-800)',
      900: 'var(--tertiary-900)',
    },
  },
  components: {
    stepper: {
      steppanel: {
        background: '{surface.ground}',
        color: '{text.color}',
      },
    },
  },
});

export function initiate(app: App) {
  setupStores(app);
  setupRouter(app);
  setupStyles(app);

  app.use(PrimeVue, {
    theme: {
      preset: customPreset,
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false,
      },
    },
  });

  app.use(ToastService);
  app.use(ConfirmationService);
}
