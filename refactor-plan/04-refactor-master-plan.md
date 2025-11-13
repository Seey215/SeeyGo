# Todo List App Store 级重构总计划

> 本计划基于以下三份前置文档：
> 1. `refactor-plan/01-app-store-analysis.md` – 对世界级 App Store 项目的深度解构
> 2. `refactor-plan/02-current-todo-analysis.md` – 对现有 Todo List 应用的全方位体检
> 3. `refactor-plan/03-lessons-learned.md` – 可借鉴与不适用技术的甄别
>
> 本文档整合上述洞察，提出一套顶级架构师级别的重构蓝图，目标是将 Todo List 应用提升至可与 App Store 项目媲美的工程与体验水准。

---

## 🌌 愿景与设计原则

### 愿景
打造一款 **性能卓越、体验流畅、工程可持续** 的 Todo List 应用，能够在重度使用场景下稳定运行，并为未来功能扩展保留充足的架构弹性。

### 设计原则
1. **分层解耦**：数据、业务、副作用、UI 分层清晰，遵循单一职责。
2. **性能优先**：长列表、高频操作、低端设备均需流畅运行。
3. **体验至上**：微交互、键盘导航、A11y 全面提升用户信任度。
4. **渐进式演进**：阶段性交付，确保每一步都可验证，并保持上线节奏。
5. **可观测性**：引入轻量的日志与指标，确保问题可回溯、性能可追踪。

---

## 🏗️ 目标架构蓝图

```
Client
├── Presentation Layer (UI)
│   ├── Components (Pure UI)
│   ├── Composables/Hooks (View Logic)
│   └── Animations & A11y Layer
├── Interaction Layer (Actions)
│   ├── TaskActions / CategoryActions (副作用集中处理)
│   └── Side-effect Services (toast、metrics、logger)
├── Domain Layer (Services)
│   ├── TaskService / CategoryService (数据读取、转换)
│   └── Persistence Adapter (LocalStorage / future sync)
└── State Layer (Stores)
    ├── tasksStore / filtersStore / uiStore（细粒度状态）
    └── Cache & Memoization (LRU / selectors)
```

### 关键理念
- 借鉴 **Intent-Action** 思想，但以 **Service + Action** 简化实现（详见 Lessons Learned）。
- 使用细粒度 Store（推荐 Zustand + React Context 组合）实现局部状态更新。
- 通过 **Action 层** 集中处理副作用（日志、指标、通知），保持 UI 清洁。

---

## 🚀 重构路线图（四期）

### Phase 0：准备期（0.5 周）
- **目标**：搭建重构所需的基础设施，控制风险。
- **任务**：
  1. 建立新的 `refactor` 分支并配置 CI 预览环境。
  2. 搭建性能与交互基准测试脚本（如 React Profiler、Lighthouse 脚本化）。
  3. 建立 `metrics` 与 `logger` 的轻量封装（Development: console, Production: 暂空）。
- **成功标准**：
  - 所有现有 E2E 流程记录；
  - 能够在 CI 中产出性能对比报告。

---

### Phase 1：性能基础建设（1.5 周）
- **目标**：解决最痛的性能瓶颈，夯实后续迭代地基。
- **核心任务**：
  1. **状态体系重构**（P0）
     - 引入 Zustand，自定义 selector，避免整树重渲染。
     - 按业务拆分 Store：`tasksStore`、`categoriesStore`、`filtersStore`、`uiStore`。
  2. **虚拟列表实现**（P0）
     - 结合 IntersectionObserver + 惰性渲染；或集成 `@tanstack/react-virtual`。
     - 保留 sentinel 元素用于预加载下一批任务。
  3. **RAF 队列调度器**（P0）
     - 实现 `utils/rafQueue.ts` 单例；
     - 所有动画类 DOM 操作统一走 RAF。
  4. **LRU 缓存模块**（P0）
     - 实现 `utils/lruMap.ts`；
     - 缓存过滤结果、统计数据、AI 建议。
  5. **Memoized Selector**
     - 使用 `proxy-compare` 或手写 memo 保障 filters 计算只执行必要部分。
- **成功标准**：
  - 100 条任务列表渲染时间 < 200ms；
  - 滚动稳定 55-60fps；
  - 状态更新引发的渲染范围缩小至相关组件。

---

### Phase 2：体验升级（1.5 周）
- **目标**：打造现代化的交互体验与品牌感。
- **核心任务**：
  1. **CSS 变量体系**（P1）
     - `:root` 与 `[data-theme]` 定义颜色、间距、动画变量。
     - Tailwind 配合 CSS 变量输出一致的 Design Token。
  2. **动画与过渡升级**
     - 引入微交互：新增任务、删除任务、完成切换等行动拥有平滑动画。
     - 使用 `rafQueue` 控制所有类动画 DOM 操作。
  3. **空/加载/错误状态设计**
     - 参照 App Store 的 skeleton 与空状态设计。
     - 为 AI 功能、批量操作提供明确的反馈。
  4. **键盘导航与快捷键**（P1）
     - 通用快捷键：`Ctrl/Cmd + N`（新建）、`Ctrl/Cmd + K`（搜索）等。
     - 列表内 `↑/↓` 导航，`Enter` 打开编辑。
  5. **无障碍合规**
     - ARIA 属性、语义化标签。
     - 仅可见元素可 Tab 访问（借鉴 App Store `setShelfItemInteractivity`）。
- **成功标准**：
  - 键盘操作覆盖核心流程；
  - Lighthouse 无障碍评分 ≥ 95；
  - 用户动作反馈延迟 < 50ms。

---

### Phase 3：架构与可观测性增强（2 周）
- **目标**：在保持性能与体验的前提下，提升系统稳定性与可维护性。
- **核心任务**：
  1. **Service + Action 模式**（P2）
     - 建立 `services/`（纯数据逻辑）与 `actions/`（副作用集中）。
     - Action 内统一调用 logger、metrics、toast。
  2. **错误处理系统**
     - 全局错误边界 + 局部错误提示。
     - `actions/` 内的错误统一通过 `errorToast + logger` 处理。
  3. **指标追踪（轻量版）**
     - 记录关键指标：任务创建时间、批量操作耗时、列表渲染耗时。
     - Dev 环境 console 输出，Prod 预留埋点接口。
  4. **测试体系搭建**
     - 单元测试：Store、Service、Action。
     - 集成测试：关键交互流程（Playwright / Vitest + React Testing Library）。
- **成功标准**：
  - 关键路径单元测试覆盖率 ≥ 70%；
  - 错误日志可定位 90% 主流程问题；
  - 性能回归自动触发警报。

---

### Phase 4：高级能力（按需择优）
- **候选任务（参考 Lessons Learned P3-P4 项）**：
  1. 依赖注入容器（若项目继续膨胀）。
  2. 国际化与 RTL 支持（若拓展海外市场）。
  3. 真正的指标平台接入（SaaS 监控服务）。
  4. 后端同步（若未来引入账号体系）。
- **策略**：此阶段遵循业务需求驱动，保持架构的可选路径。

---

## 🧩 组件级重构策略

### Task List 模块
- **拆分结构**：
  - `TaskListShell`（容器 + 虚拟列表 + Infinite Scroll）。
  - `TaskRow`（纯展示，接受模拟数据）。
  - `TaskRowActions`（包含 UI 操作按钮）。
- **优化点**：
  - 使用 `React.memo` + `selector` 仅在任务变动时重新渲染。
  - 切换完成状态、删除任务走 `rafQueue` 添加过渡。

### Task Form / Modal
- **逻辑下沉**：表单字段、验证逻辑下沉至 `useTaskForm` Hook。
- **动画**：使用 CSS 变量控制进出场过渡（保持 150-250ms）。
- **快捷键**：`Ctrl+Enter` 保存，`Escape` 关闭。

### AI 模块
- 接入缓存（LRU）防止重复请求。
- 异常时调用 `Action` 层集中处理并提供二次重试机制。

---

## 📊 绩效指标与验收标准

| 维度 | 指标 | 现状 | 目标 | 验证手段 |
|------|------|------|------|----------|
| 性能 | 首屏渲染（100 任务） | ~1200ms | ≤ 400ms | Lighthouse / Web Vitals |
|      | 长列表滚动 FPS | ~40fps | ≥ 58fps | Chrome Profiler |
|      | 状态更新延迟 | ~150ms | ≤ 30ms | Profiler + 自定义埋点 |
| 体验 | Lighthouse A11y | 85 | ≥ 95 | Lighthouse |
|      | 用户动作反馈 | 直观卡顿 | 平滑、即时 | 观测 + 定性测试 |
| 工程 | 单元测试覆盖率 | 0% | ≥ 70% | CI 报告 |
|      | Bug 修复时间 | 难以定位 | 日志可追踪 | Incident 记录 |

---

## ⚠️ 风险与缓解策略

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| 大规模状态重构导致功能回归 | 高 | 逐模块迁移，保留旧 Context 作为壳；引入回归测试清单 |
| 虚拟列表影响 SEO/可视化测试 | 中 | Todo 为 SPA 不依赖 SEO；E2E 测试通过 data attributes 支持虚拟定位 |
| RAF 调度导致动画先后顺序问题 | 中 | 采用队列分组策略，动画按模块分组执行 |
| LRU 缓存大小不当导致数据丢失 | 低 | 增加命中率监控，提供 fallback 重计算 |
| Action 层引入新抽象导致学习成本 | 中 | 编写开发者手册；在 PR 模板中要求说明调用关系 |

---

## 🛠️ 工具与工程配置建议

- **性能监控**：
  - `why-did-you-render` (开发期)
  - `react profiler` 脚本化执行
- **测试框架**：
  - Unit：Vitest + RTL
  - E2E：Playwright（覆盖任务 CRUD 流程）
- **代码规范**：
  - 统一使用 ESLint + Biome 格式化
  - 针对 Zustand store，使用 lint 规则避免直接访问全局 state
- **文档**：
  - 在 `refactor-plan/` 内持续补充子模块设计说明；
  - 为每个阶段生成 Retro 文档记录经验教训。

---

## 🔚 收官标准

重构完成后需满足以下条件方可进入维护模式：
1. 所有 Phase P0-P2 任务上线并稳定运行两周以上。
2. 所有性能指标达标，且监控系统无异常告警。
3. 测试覆盖率与文档要求满足表格中目标值。
4. 团队完成新架构培训，确保每位成员能独立扩展模块。
5. 与业务方对照上线前的痛点逐项验收。

---

## 🏁 结语

这份重构计划并非单纯的代码改写，而是一场 **性能、体验、工程能力** 的全面升级。我们通过吸收世界级项目的思想精华，结合自身业务体量与资源约束，制定了一条可落地、可度量、可复用的进化路径。只要严格执行上述阶段计划，并持续记录与校准，我们的 Todo List 应用将真正达到 "媲美 App Store" 的水准。

让我们以终为始，在每一次迭代中兑现卓越体验与卓越工程的承诺。
