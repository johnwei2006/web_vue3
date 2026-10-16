# Vue3 Starter

基于 **Vue3 + TypeScript + Pinia + Vue Router + Element Plus + Axios** 的企业级前端脚手架。

## 技术栈

| 类别       | 选型                                  |
| ---------- | ------------------------------------- |
| 框架       | Vue 3.5+                              |
| 语言       | TypeScript 5.8+                       |
| 构建工具   | Vite 8                                |
| 状态管理   | Pinia 3                               |
| 路由       | Vue Router 4                          |
| UI 组件库  | Element Plus（含中文语言包）          |
| HTTP 客户端| Axios（已封装拦截器与统一错误处理）   |

## 环境要求

- **Node.js >= 22.12.0**（Vite 8 运行要求；推荐 22 LTS 或更高）。
- 包管理器：npm（亦可使用 pnpm / yarn，按各自 lock 文件安装）。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 目录结构

```
src/
├── api/          # Axios 封装与业务接口
├── components/   # 通用组件
├── layouts/      # 页面布局（含 Element Plus 布局）
├── plugins/      # 插件注册（Element Plus）
├── router/       # 路由配置与守卫
├── stores/       # Pinia 状态管理（模块化）
├── styles/       # 全局样式
├── types/        # 全局 TS 类型
├── utils/        # 工具函数（storage 等）
├── views/        # 页面级视图
├── App.vue       # 根组件
└── main.ts       # 应用入口
```

## 约定

- 路径别名 `@` 指向 `src`，在 `vite.config.ts` 与 `tsconfig.json` 中同步配置。
- 环境变量以 `VITE_` 前缀暴露给前端，见 `.env*` 文件。
- 后端响应统一结构见 `src/types/index.ts` 的 `ApiResponse`。
- 更多代码模板与最佳实践见本技能 `references/` 目录。
