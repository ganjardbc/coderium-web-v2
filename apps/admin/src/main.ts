import { createApp } from 'vue';
import App from './App.vue';
import { initiate } from './core/initiate';
import { initAnalytics } from './core/analytics';

initAnalytics();

const app = createApp(App);
const router = initiate(app);

router.isReady().then(() => {
  app.mount('#app');
});
