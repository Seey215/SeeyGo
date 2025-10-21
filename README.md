# SeeyGo Todo - 智能待办事项管理应用

基于 Next.js 15.5.2 + React 19 + TypeScript 构建的现代化待办事项管理应用。

## 🚀 功能特性

### 核心功能
- ✅ **任务管理** - 创建、编辑、删除、完成任务
- ✅ **分类系统** - 自定义分类，颜色标识
- ✅ **标签管理** - 灵活的标签系统
- ✅ **优先级设置** - 高、中、低三个优先级
- ✅ **截止日期** - 设置任务截止时间
- ✅ **搜索过滤** - 实时搜索和多维度过滤
- ✅ **排序功能** - 多种排序方式
- ✅ **数据持久化** - 基于 localStorage 的本地存储

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
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   ├── tasks/             # 任务相关组件
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── ...
│   └── categories/        # 分类相关组件
│       └── CategoryManager.tsx
├── hooks/                 # 自定义Hooks
│   ├── useTasks.ts       # 任务管理
│   ├── useCategories.ts  # 分类管理
│   ├── useFilters.ts     # 过滤器管理
│   └── useLocalStorage.ts # 本地存储
├── store/                 # 状态管理
│   ├── index.tsx         # 主store和Provider
│   ├── taskReducer.ts    # 任务reducer
│   ├── categoryReducer.ts # 分类reducer
│   ├── uiReducer.ts      # UI和过滤器reducer
│   └── types.ts          # 共享类型定义
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

#### 🔄 状态管理
- **模块化Reducer**: 按功能域拆分reducer，便于维护
- **类型安全**: 完整的TypeScript类型定义
- **Context模式**: 使用React Context + useReducer模式

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
2. **搜索过滤** - 使用顶部搜索栏和过滤按钮
3. **排序任务** - 使用排序选择器
4. **查看不同视图** - 点击侧边栏的导航项

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
