import { createApp } from 'vue';
import App from './App.vue';
import { initiate } from './core/initiate';

const app = createApp(App);
initiate(app);
app.mount('#app');
