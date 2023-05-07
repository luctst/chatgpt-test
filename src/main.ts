import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createI18n, I18nOptions } from 'vue-i18n'
import VueSocialSharing from 'vue-social-sharing';
import VueGtag from 'vue-gtag';
import { VueCookieNext } from 'vue-cookie-next';
import App from './App.vue'
import messages from './i18n/messages';

const app = createApp(App);

app.use(VueCookieNext);
app.use(VueGtag, {
  config: { id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID },
  enabled: false,
});
app.use(VueSocialSharing);
app.use(createI18n({
  fallbackLocale: 'fr',
  locale: navigator.language.includes('-') ? navigator.language.split('-')[0] : navigator.language,
  globalInjection: true,
  messages,
} as I18nOptions));
app.use(ElementPlus);

app.provide('gtag', app.config.globalProperties.$gtag);

app.mount('#app');
