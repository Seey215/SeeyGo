<div align="center">

<img src="./public/logo.svg" alt="SeeyGo Logo" width="120" height="120" />

# SeeyGo

### 🚀 AI 驱动的智能任务管理应用

*告别混乱，让 AI 帮你理清每一件事*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[🎯 功能特性](#-核心功能) · [🚀 快速开始](#-快速开始) · [🤖 AI 功能](#-ai-智能功能) · [📖 文档](#-项目架构)

---

</div>

## ✨ 为什么选择 SeeyGo？

> **"写任务只需要 3 秒，剩下的交给 AI"**

传统的 Todo 应用让你手动填写标题、选择优先级、设置截止日期、添加标签...  
**SeeyGo 不一样。** 只需输入一句话，AI 自动帮你：

- 🎯 **优化标题** - 让任务表述更清晰
- ⚡ **识别优先级** - 智能判断任务紧急程度  
- 📅 **提取日期** - 自动识别"明天"、"下周五"等时间表述
- 🏷️ **生成标签** - 自动分类，方便检索
- 📝 **补充描述** - 丰富任务细节

<div align="center">

### 🎬 效果演示

| 你输入的 | AI 帮你整理成 |
|---------|-------------|
| `明天下午必须完成项目文档，很重要` | **标题:** 完成项目文档<br>**优先级:** 🔴 高<br>**截止日期:** 明天 15:00<br>**标签:** `#工作` `#文档` |
| `买点菜，要有廋肉白菜土豆葱姜` | **标题:** 购物清单 - 蔬菜肉类<br>**优先级:** 🟡 中<br>**标签:** `#购物` `#食材` `#日常` |

</div>

---

## 🎯 核心功能

<table>
<tr>
<td width="50%">

### 📋 任务管理
- ✅ 创建、编辑、删除、完成任务
- 🎨 自定义分类与颜色标识
- 🏷️ 灵活的标签系统
- 🔥 高/中/低 三级优先级
- 📅 截止日期设置
- 🔍 实时搜索（标题、描述、标签）

</td>
<td width="50%">

### 🤖 AI 智能
- ✨ LLM 驱动的任务优化
- 🎯 智能优先级识别
- 📆 自然语言日期解析
- 🏷️ 自动标签生成
- 📝 任务描述补充
- 👁️ 优化结果预览编辑

</td>
</tr>
<tr>
<td width="50%">

### 🎨 界面体验
- 📱 响应式设计（桌面/平板/移动端）
- ⚡ 流畅动画过渡
- 🎯 直观的视觉层次
- 🔄 状态实时同步

</td>
<td width="50%">

### 💾 数据存储
- 🔒 本地存储，隐私安全
- 💨 无需注册，开箱即用
- 🔄 自动保存，刷新不丢失

</td>
</tr>
</table>

---

## 🤖 AI 智能功能

### 两种创建模式

| 快捷键 | 模式 | 说明 |
|--------|------|------|
| `Enter` | ⚡ 快速创建 | 直接创建任务，使用默认配置 |
| `Shift + Enter` | 🤖 AI 优化 | AI 分析后显示预览，支持编辑确认 |
| `Escape` | ❌ 取消 | 清空输入并关闭弹窗 |

### AI 优化能力

```
输入: "后天要交的报告还没写，非常紧急需要今晚加班搞定"

AI 输出:
┌─────────────────────────────────────┐
│ 📌 标题: 完成并提交报告              │
│ 🔴 优先级: 高                        │
│ 📅 截止日期: 后天                    │
│ 📝 描述: 紧急报告任务，需今晚加班完成  │
│ 🏷️ 标签: #工作 #报告 #紧急           │
└─────────────────────────────────────┘
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18+
- **pnpm** (推荐) 或 npm

### 一键启动

```bash
# 1. 克隆仓库
git clone https://github.com/Seey215/SeeyGo.git
cd SeeyGo

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

🎉 打开 [http://localhost:3000](http://localhost:3000) 开始使用！

### 构建生产版本

```bash
pnpm build
pnpm start
```

---

## 🛠️ 技术栈

<div align="center">

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js (App Router) | 15.5.2 |
| **UI** | React | 19.1.0 |
| **语言** | TypeScript | ^5 |
| **样式** | Tailwind CSS | ^4 |
| **状态管理** | Zustand + Context | - |
| **代码质量** | Biome | 2.2.0 |
| **构建** | Turbopack | - |

</div>

---

## 🏗️ 项目架构

<details>
<summary><b>📂 点击展开目录结构</b></summary>

```
src/
├── 📱 app/                    # Next.js App Router
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首页重定向
│   ├── settings/             # 设置页面
│   └── view/[type]/          # 动态路由页面
│
├── 🧩 components/             # UI 组件
│   ├── ui/                   # 基础组件 (Button, Input, Modal...)
│   ├── layout/               # 布局组件 (Sidebar, MainContent)
│   ├── tasks/                # 任务组件 (TaskList, TaskItem...)
│   ├── categories/           # 分类组件
│   ├── ai/                   # AI 功能组件
│   └── providers/            # Context Providers
│
├── 🪝 hooks/                  # 自定义 Hooks
│   ├── useTasks.ts           # 任务管理
│   ├── useCategories.ts      # 分类管理
│   ├── useAIOptimizeTask.ts  # AI 优化
│   └── ...
│
├── 🗄️ stores/                 # 状态管理 (Zustand)
│   ├── tasksStore.ts
│   ├── categoriesStore.ts
│   ├── filtersStore.ts
│   └── uiStore.ts
│
├── ⚙️ services/               # 业务逻辑层
├── 🎬 actions/                # 副作用处理
├── 🤖 ai/                     # AI 功能模块
├── 🔧 lib/                    # 工具库
└── 🛠️ utils/                  # 工具函数
```

</details>

### 架构亮点

| 特性 | 说明 |
|------|------|
| 🎯 **LLM 友好** | 文件 < 150 行，语义化路径，便于 AI 协作开发 |
| 🧩 **组件分层** | UI 层 → 业务层 → 布局层，职责清晰 |
| 🔄 **混合状态** | Zustand 细粒度管理 + Context 全局状态 |
| 📦 **分层架构** | Services(逻辑) → Actions(副作用) → Hooks(桥梁) |

---

## 📍 路由导航

| 路由 | 功能 |
|------|------|
| `/view/all` | 📋 所有未完成任务 |
| `/view/today` | 📅 今日待办 |
| `/view/important` | 🔥 重要任务 |
| `/view/completed` | ✅ 已完成任务 |
| `/view/category/[id]` | 🏷️ 分类任务 |
| `/settings` | ⚙️ 应用设置 |

---

## 🗺️ 路线图

- [ ] 🖱️ 拖拽排序
- [ ] 📑 任务模板
- [ ] 📤 数据导入/导出 (CSV/JSON)
- [ ] 🌙 深色主题
- [ ] ⌨️ 快捷键支持
- [ ] 🔔 提醒通知
- [ ] 📊 任务统计分析

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

```bash
# Fork 并克隆
git clone https://github.com/YOUR_USERNAME/SeeyGo.git

# 创建功能分支
git checkout -b feature/amazing-feature

# 提交更改
git commit -m 'feat: add amazing feature'

# 推送并创建 PR
git push origin feature/amazing-feature
```

---

## 📄 许可证

[MIT License](./LICENSE) © 2024 [Seey215](https://github.com/Seey215)

---

<div align="center">

**如果觉得有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by [Seey215](https://github.com/Seey215)

</div>
