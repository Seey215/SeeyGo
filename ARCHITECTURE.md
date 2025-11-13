# 新架构使用指南

## 目录结构

```
src/
├── app/                    # Next.js 应用层
│   ├── globals.css        # 全局样式
│   ├── theme.css          # 主题 CSS 变量
│   ├── layout.tsx         # 主布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── layout/           # 布局组件
│   └── tasks/            # 任务相关组件
├── hooks/                 # 自定义 Hooks
│   ├── useAppStore.ts    # 连接 Zustand stores
│   └── 其他业务 hooks
├── stores/                # Zustand 状态管理
│   ├── tasksStore.ts     # 任务状态
│   ├── categoriesStore.ts # 分类状态
│   ├── filtersStore.ts   # 筛选状态
│   ├── uiStore.ts        # UI 状态
│   └── index.ts          # 导出
├── services/              # 业务逻辑层（纯函数）
│   ├── taskService.ts    # 任务业务逻辑
│   ├── categoryService.ts # 分类业务逻辑
│   └── index.ts          # 导出
├── actions/               # 副作用处理层
│   ├── taskActions.ts    # 任务操作（集成日志、指标、Toast）
│   ├── categoryActions.ts # 分类操作
│   └── index.ts          # 导出
├── lib/                   # 公共工具库
│   ├── lruMap.ts         # LRU 缓存
│   ├── rafQueue.ts       # 动画调度器
│   ├── logger.ts         # 日志系统
│   ├── metrics.ts        # 性能指标
│   ├── types.ts          # 类型定义
│   └── index.ts          # 导出
├── config/                # 配置文件
│   └── index.ts          # 应用配置
└── utils/                 # 工具函数
```

## 使用模式

### 1. 查询数据

使用 Hooks 从 Store 获取数据：

```typescript
import { useFilteredTasks, useCategories, useTaskStats } from "@/hooks/useAppStore";

export function TaskListPage() {
  // 获取过滤后的任务列表
  const tasks = useFilteredTasks();

  // 获取所有分类
  const categories = useCategories();

  // 获取任务统计信息
  const stats = useTaskStats();

  return (
    <div>
      <h1>{stats.total} 个任务</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 修改数据

使用 Actions 来执行数据修改操作（自动处理日志、指标、通知）：

```typescript
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/actions";
import type { Task } from "@/lib/types";

export function TaskEditor() {
  const handleCreateTask = async (task: Task) => {
    // Action 会自动处理：
    // 1. 添加任务到 Store
    // 2. 更新分类计数
    // 3. 记录日志
    // 4. 收集性能指标
    // 5. 显示 Toast 通知
    const result = await createTaskAction(task);
    if (result) {
      console.log("任务创建成功");
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await updateTaskAction(id, updates);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTaskAction(id);
  };

  return (
    <div>
      {/* 表单代码 */}
    </div>
  );
}
```

### 3. 处理 UI 状态

使用 UI Hooks 管理 UI 层状态：

```typescript
import { useUIState, useUIActions } from "@/hooks/useAppStore";

export function Navigation() {
  const { sidebarOpen, toast } = useUIState();
  const { toggleSidebar, showToast, closeToast } = useUIActions();

  return (
    <nav>
      <button onClick={() => toggleSidebar()}>
        {sidebarOpen ? "隐藏" : "显示"}侧边栏
      </button>

      {toast && (
        <div className="toast">
          {toast.message}
          <button onClick={closeToast}>×</button>
        </div>
      )}
    </nav>
  );
}
```

### 4. 使用业务逻辑服务

Services 提供纯函数业务逻辑，可以单独测试：

```typescript
import {
  filterTasks,
  sortByPriority,
  getTaskStats,
  getOverdueTasks,
} from "@/services/taskService";
import type { Task, Filter } from "@/lib/types";

// 过滤和排序任务
const filter: Filter = { completed: false, priority: "high" };
const filtered = filterTasks(tasks, filter);
const sorted = sortByPriority(filtered);

// 获取统计信息
const stats = getTaskStats(tasks);
console.log(`完成率: ${stats.completionRate}%`);

// 获取逾期任务
const overdue = getOverdueTasks(tasks);
```

### 5. 缓存和性能

使用 LRU 缓存缓存计算结果：

```typescript
import { createLRUMap } from "@/lib/lruMap";

const cache = createLRUMap<string, Task[]>(100);

// 存储缓存
cache.set("filter_key", filteredTasks);

// 读取缓存
const cached = cache.get("filter_key");

// 查看缓存命中率
const stats = cache.getStats();
console.log(`命中率: ${stats.hitRate.toFixed(2)}%`);
```

### 6. 动画和 DOM 操作

使用 RAF 队列集中管理 DOM 动画：

```typescript
import { rafQueue, cancelRafTask } from "@/lib/rafQueue";

// 添加高优先级任务
const taskId = rafQueue(() => {
  // 执行 DOM 操作
  element.style.opacity = "1";
}, 0);

// 可以取消任务
cancelRafTask(taskId);
```

### 7. 日志和指标

```typescript
import { logger } from "@/lib/logger";
import { metrics } from "@/lib/metrics";

// 记录日志
logger.info("任务已创建", { taskId: "123" });
logger.error("保存失败", error, { taskData });

// 记录性能指标
const timer = metrics.startTimer("operation_name");
// ... 执行操作
timer(); // 自动计算耗时并记录

// 查看统计
const stats = metrics.getStats("operation_name");
console.log(`平均耗时: ${stats?.avg}ms`);
```

## 设计原则

### 1. 分层解耦
- **UI 层**：只负责渲染和交互
- **Hooks 层**：连接 UI 和 Store，处理派生状态
- **Actions 层**：集中处理副作用和日志
- **Services 层**：纯业务逻辑，独立可测试
- **Stores 层**：应用状态管理
- **Utils 层**：基础工具函数

### 2. 单一职责
- Store：只管理状态
- Service：只处理业务逻辑
- Action：只处理副作用和调用 Service + Store
- Hook：只连接 Store 和组件

### 3. 性能优先
- Zustand 支持细粒度订阅，自动避免不必要的重渲染
- LRU 缓存提高过滤和计算性能
- RAF 队列保证动画流畅性
- 预留虚拟列表架构支持大列表

### 4. 可观测性
- 所有副作用都经过 Action 层统一处理
- 内置日志和指标收集
- 生产环境预留远程监控接口

## CSS 变量系统

### 颜色变量

```css
/* 主色调 */
--color-primary: #3b82f6;
--color-secondary: #0ea5e9;

/* 功能颜色 */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* 中性色 */
--color-gray-100 to --color-gray-900;

/* 文本 */
--color-text-primary: #0f172a;
--color-text-secondary: #4b5563;
```

### 使用 CSS 变量

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all var(--animation-duration-normal);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
```

### Tailwind 集成

在 Tailwind 配置中引入 CSS 变量：

```typescript
// tailwind.config.ts
export default {
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      // ...
    },
  },
};
```

## 后续优化方向

1. **虚拟列表**：当任务超过 100 条时自动启用虚拟滚动
2. **选择器优化**：为高频访问的派生状态实现 Memoized selector
3. **离线支持**：集成 Service Worker 支持离线编辑
4. **同步服务**：支持与后端的双向同步
5. **实时协作**：多用户实时编辑支持

## 常见问题

### Q: 为什么要分离 Services 和 Actions？

A: 
- Services 是纯业务逻辑，可以单独测试和复用
- Actions 处理副作用（日志、指标、通知），与 UI 框架解耦
- 这样即使迁移到 Vue、Svelte 等框架，Services 仍可直接复用

### Q: 什么时候使用 LRU 缓存？

A: 
- 计算量大的过滤操作（如全文搜索）
- 频繁重复的查询
- 统计数据计算

### Q: 如何添加新的 Store？

A:
1. 在 `stores/` 目录创建新的 store 文件
2. 使用 `create<T>` 定义状态和操作
3. 在 `stores/index.ts` 导出
4. 在需要的地方导入使用

### Q: 如何调试？

A:
```typescript
// 查看日志
const logs = logger.getLogs(10);
console.table(logs);

// 查看指标
const metrics_data = metrics.getAllMetrics();
console.table(metrics_data);

// 查看 Store 状态
const state = useTasksStore.getState();
console.log(state);

// 订阅 Store 变化
useTasksStore.subscribe((state, previousState) => {
  console.log("State changed:", state);
});
```

## 相关文档

- [重构总计划](./04-refactor-master-plan.md)
- [重构进度报告](./05-refactor-progress.md)
- [项目分析文档](./01-app-store-analysis.md)
