import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import type { App } from 'vue';

/**
 * 注册 Element Plus（全量引入 + 中文语言包）。
 * 如需按需引入以减小包体积，请参考 references/element-plus-guide.md 使用
 * unplugin-auto-import / unplugin-vue-components 自动按需导入。
 */
export function setupElementPlus(app: App): void {
  app.use(ElementPlus, { locale: zhCn });
}
