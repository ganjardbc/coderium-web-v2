import type { App } from 'vue';
import { setupRouter } from './global-routes';
import { setupStores } from './global-stores';
import { setupStyles } from './global-styles';

export function initiate(app: App) {
  setupStores(app);
  setupRouter(app);
  setupStyles(app);
}
