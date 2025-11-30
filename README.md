# SeeyGo Todo - 智能待办事项管理应用

基于 Next.js 15.5.2 + React 19 + TypeScript 构建的现代化待办事项管理应用。

## 🚀 功能特性

### 核心功能
- ✅ **任务管理** - 创建、编辑、删除、完成任务
- ✅ **分类系统** - 自定义分类，颜色标识
- ✅ **标签管理** - 灵活的标签系统
- ✅ **优先级设置** - 高、中、低三个优先级
- ✅ **截止日期** - 设置任务截止时间
- ✅ **搜索功能** - 实时搜索任务标题、描述和标签
- ✅ **数据持久化** - 基于 localStorage 的本地存储

### 🤖 AI 智能功能
- ✨ **AI 任务优化** - 由 LLM 自动优化和分析任务输入
  - 自动识别和优化任务标题
  - 智能提取任务优先级
  - 自动识别截止日期
  - 自动生成和提取相关标签
  - 补充详细的任务描述
- 🎯 **两种创建模式**
  - 快速创建：按 Enter 直接创建（默认配置）
  - AI 优化创建：按 Shift+Enter 由 AI 智能分析
- 📝 **结果预览**：AI 优化后的内容支持预览和手动编辑

### 界面特性
- 🎨 **响应式设计** - 支持桌面、平板、移动端
- 🎯 **直观的用户界面** - 清晰的视觉层次
- ⚡ **流畅的交互** - 优雅的动画过渡
- 🔄 **实时更新** - 状态实时同步

## 🛠️ 技术栈

- **前端框架**: Next.js 15.5.2 (App Router)
- **UI 库**: React 19.1.0
- **类型系统**: TypeScript ^5
- **样式方案**: Tailwind CSS ^4
- **状态管理**: Context API + useReducer (模块化设计)
- **代码质量**: Biome 2.2.0
- **构建工具**: Turbopack
- **字体优化**: next/font (Geist 字体)

## 🏗️ 项目架构

### 目录结构
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页重定向
│   ├── settings/          # 设置页面
│   └── view/[type]/       # 动态路由页面
├── components/             # 组件按UI层次组织
│   ├── ui/                # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/            # 布局组件
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   ├── tasks/             # 任务相关组件
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── ...
│   ├── categories/        # 分类相关组件
│   │   └── CategoryManager.tsx
│   ├── ai/                # AI 功能组件
│   │   └── TaskOptimizeModal.tsx
│   └── providers/         # 上下文提供者
│       └── CreateTaskProvider.tsx
├── hooks/                 # 自定义Hooks
│   ├── useTasks.ts       # 任务管理
│   ├── useCategories.ts  # 分类管理
│   ├── useFilters.ts     # 过滤器管理
│   ├── useAppStore.ts    # Zustand store 封装
│   ├── useAIOptimizeTask.ts  # AI 优化任务
│   └── useLocalStorage.ts # 本地存储
├── stores/                # 状态管理 (Zustand + Context)
│   ├── provider.tsx      # Context Provider
│   ├── tasksStore.ts     # 任务状态 (Zustand)
│   ├── categoriesStore.ts # 分类状态 (Zustand)
│   ├── filtersStore.ts   # 过滤器状态 (Zustand)
│   ├── uiStore.ts        # UI 状态 (Zustand)
│   └── *Reducer.ts       # 旧版 Reducer (Context)
├── services/              # 业务逻辑层
│   ├── taskService.ts    # 任务业务逻辑
│   └── categoryService.ts # 分类业务逻辑
├── actions/               # 副作用处理层
│   ├── taskActions.ts    # 任务副作用
│   └── categoryActions.ts # 分类副作用
├── lib/                   # 工具库
│   ├── logger.ts         # 日志系统
│   ├── metrics.ts        # 性能指标
│   ├── lruMap.ts         # LRU 缓存
│   └── rafQueue.ts       # RAF 队列
├── ai/                    # AI 功能模块
│   ├── config.ts         # AI 配置
│   ├── types.ts          # AI 类型定义
│   ├── prompts/          # 提示词
│   └── services/         # AI 服务
├── utils/                 # 工具函数
│   ├── constants.ts
│   ├── dateUtils.ts
│   ├── storage.ts
│   └── taskUtils.ts
└── types.ts              # 全局类型定义
```

### 架构特点

#### 🎯 LLM友好设计
- **文件大小控制**: 最大文件不超过150行，便于LLM处理
- **语义化路径**: 目录结构直观映射功能，如 `hooks/useTasks.ts`
- **模块化拆分**: 大文件拆分为功能单一的小文件
- **清晰命名**: 文件名直接反映功能，如 `TaskList.tsx`

#### 🧩 组件分层架构
- **UI层** (`components/ui/`): 可复用的基础组件
- **业务层** (`components/tasks/`, `components/categories/`): 业务逻辑组件
- **布局层** (`components/layout/`): 页面布局组件

#### 🔄 状态管理（混合架构）
- **Zustand Stores**: 细粒度状态管理（tasksStore, categoriesStore, filtersStore, uiStore）
- **Context + Reducer**: 遗留的全局状态（逐步迁移中）
- **类型安全**: 完整的TypeScript类型定义，统一在 `types.ts`

#### 📦 分层架构
- **Services 层**: 纯业务逻辑，不包含副作用
- **Actions 层**: 处理副作用（日志、指标、通知）
- **Hooks 层**: 连接 Store 和组件的桥梁

#### 📦 导入优化
- **路径别名**: 使用 `@/` 简化导入路径
- **索引文件**: 每个目录提供 `index.ts` 便于批量导入
- **相对导入**: 同目录组件使用相对路径导入

## 🚦 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本
```bash
npm run build
# 或
pnpm build
```

## 📋 使用指南

### 基本操作
1. **创建任务** - 点击「+ 新建任务」按钮
2. **编辑任务** - 点击任务项的编辑按钮
3. **完成任务** - 点击任务前的复选框
4. **删除任务** - 点击任务项的删除按钮

### 高级功能
1. **分类管理** - 在侧边栏分类区域点击「管理」
2. **搜索任务** - 使用顶部搜索栏快速查找任务
3. **查看不同视图** - 点击侧边栏的导航项

## 🎯 页面功能

- **所有任务** (`/`) - 显示所有未完成的任务
- **今日任务** (`/today`) - 显示今天截止的任务
- **重要任务** (`/important`) - 显示高优先级和即将到期的任务
- **已完成** (`/completed`) - 显示已完成的任务
- **分类任务** (`/category/[id]`) - 显示特定分类的任务
- **设置** (`/settings`) - 应用设置（待实现）

## 💾 数据存储

应用使用 localStorage 进行数据持久化，包括：
- 任务数据  
- 分类信息
- 用户设置
- 界面状态

数据会自动保存，刷新页面后仍然保留。

## 🔮 未来功能规划

### 计划中的功能
- **拖拽排序** - 支持通过拖拽来自定义任务顺序
- **任务模板** - 预设常用任务模板，快速创建
- **数据导出** - 支持导出任务数据为 CSV/JSON 格式
- **主题切换** - 支持明暗主题切换
- **快捷键支持** - 键盘快捷键操作任务

### 设计理念
应用遵循"简单易用"的设计原则，避免过度复杂的功能。所有新功能都会经过用户需求验证，确保真正提升用户体验。

## 👨‍💻 开发指南

### 代码组织原则

#### 1. 文件命名规范
- **组件文件**: PascalCase (如 `TaskList.tsx`)
- **Hook文件**: camelCase (如 `useTasks.ts`)
- **工具文件**: camelCase (如 `taskUtils.ts`)
- **类型文件**: camelCase (如 `types.ts`)

#### 2. 目录结构原则
- **按功能分组**: 相关功能放在同一目录
- **按UI层次**: 组件按UI层次组织，便于理解页面结构
- **单一职责**: 每个文件只负责一个功能域

#### 3. 导入路径规范
```typescript
// ✅ 推荐：使用路径别名
import { Button } from '@/components/ui';
import { useTasks } from '@/hooks';

// ✅ 推荐：同目录相对导入
import { TaskForm } from './TaskForm';

// ❌ 避免：深层相对路径
import { Button } from '../../../components/ui/Button';
```

### 添加新功能

#### 添加新组件
1. 确定组件类型（UI/业务/布局）
2. 在对应目录创建文件
3. 更新目录的 `index.ts` 导出文件
4. 使用语义化的组件名

#### 添加新Hook
1. 在 `src/hooks/` 目录创建文件
2. 使用 `use` 前缀命名
3. 更新 `src/hooks/index.ts`

#### 添加新Reducer
1. 在 `src/store/` 目录创建reducer文件
2. 在 `src/store/index.tsx` 中集成
3. 更新 `src/store/types.ts` 类型定义

### 代码质量

#### 文件大小控制
- 单个文件不超过150行
- 超过100行的文件考虑拆分
- 保持函数简洁，单一职责

#### 类型安全
- 所有props和state都要有类型定义
- 使用共享类型定义避免重复
- 优先使用 `type` 而非 `interface`

#### 性能优化
- 使用 `useCallback` 和 `useMemo` 优化性能
- 避免不必要的重新渲染
- 合理使用React.memo

## 📄 许可证

MIT License
