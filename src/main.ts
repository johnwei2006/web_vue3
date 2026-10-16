import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import { setupElementPlus } from './plugins/element';
import './styles/index.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
setupElementPlus(app);

// 全局注册 Element Plus 图标组件（模板中可直接使用 <HomeFilled /> 等）
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component);
}

app.mount('#app');
