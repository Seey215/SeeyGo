# AI 集成架构设计

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    前端用户界面层                                │
├─────────────────────────────────────────────────────────────────┤
│  QuickCreateTask.tsx (快速创建组件)                              │
│  ├── 输入框                                                      │
│  ├── 事件处理：Enter (快速模式) / Shift+Enter (AI 优化模式)     │
│  └── TaskOptimizeModal (预览和编辑)                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    业务逻辑层（Hooks）                           │
├─────────────────────────────────────────────────────────────────┤
│  useAIOptimizeTask.ts (AI 优化 Hook)                            │
│  ├── optimize() 方法：触发 AI 优化流程                          │
│  ├── 状态管理：isLoading, error, result                         │
│  └── reset() 方法：重置状态                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API 服务层                                    │
├─────────────────────────────────────────────────────────────────┤
│  taskOptimizer.ts (任务优化服务)                                │
│  ├── optimizeTask()：处理优化请求                               │
│  ├── callOpenAIAPI()：调用 LLM API                              │
│  ├── parseOptimizeResult()：解析响应                            │
│  └── optimizeTaskStream()：流式处理（可选）                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    配置和提示词层                                │
├─────────────────────────────────────────────────────────────────┤
│  config.ts (AI 配置)                                            │
│  ├── getAIConfig()：从环境变量读取配置                          │
│  ├── validateAIConfig()：验证配置有效性                         │
│  └── 支持多个 LLM 提供商                                        │
│                                                                 │
│  optimizeTask.ts (提示词)                                       │
│  ├── getSystemPrompt()：系统提示词                              │
│  └── getUserPrompt()：用户提示词模板                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    外部 LLM API                                  │
├─────────────────────────────────────────────────────────────────┤
│  • OpenAI (GPT-4o-mini, etc.)                                   │
│  • Anthropic (Claude 系列)                                      │
│  • DeepSeek (自托管或代理)                                      │
│  • 其他 OpenAI 兼容的 API                                       │
└─────────────────────────────────────────────────────────────────┘
```

## 数据流向

### 快速创建流程（原有）
```
用户输入 + Enter
    ↓
QuickCreateTask.handleKeyDown()
    ↓
createTaskDirectly()
    ↓
createTask(taskData) → Redux 状态管理
    ↓
任务立即创建完成
```

### AI 优化创建流程（新增）
```
用户输入 + Shift+Enter
    ↓
QuickCreateTask.handleAIOptimize()
    ↓
useAIOptimizeTask.optimize()
    ↓
taskOptimizer.optimizeTask()
    ↓
getAIConfig() + getSystemPrompt() + getUserPrompt()
    ↓
callOpenAIAPI() → LLM 处理
    ↓
parseOptimizeResult() → JSON 解析
    ↓
返回 OptimizeTaskResult
    ↓
TaskOptimizeModal 显示预览
    ↓
用户确认或编辑
    ↓
handleConfirmOptimized()
    ↓
createTask(taskData) → Redux 状态管理
    ↓
任务创建完成
```

## 关键组件和职责

### 1. UI 层组件

#### QuickCreateTask.tsx
- **职责**：提供任务输入界面和交互
- **关键功能**：
  - 双模式键盘支持（Enter vs Shift+Enter）
  - 快速创建和 AI 优化两种流程
  - Modal 弹窗集成
- **状态管理**：
  - `title`：用户输入内容
  - `showOptimizeModal`：是否显示预览 Modal

#### TaskOptimizeModal.tsx
- **职责**：显示 AI 优化的结果，允许用户预览和编辑
- **关键功能**：
  - 预览优化结果（标题、描述、优先级、日期、标签）
  - 编辑模式：用户可修改任何字段
  - 推理说明：展示 AI 的决策过程
- **状态管理**：
  - `editedData`：编辑中的数据
  - `isEditMode`：是否处于编辑模式

### 2. Hook 层（业务逻辑）

#### useAIOptimizeTask.ts
- **职责**：封装 AI 优化的业务逻辑
- **核心方法**：
  ```typescript
  optimize(request) → Promise<OptimizeTaskResult>
  reset() → void
  ```
- **状态**：
  - `isLoading`：是否正在优化
  - `error`：错误信息
  - `result`：优化结果

### 3. 服务层

#### taskOptimizer.ts
- **职责**：处理与 LLM API 的通信
- **核心函数**：
  - `optimizeTask(request)`：同步调用
  - `optimizeTaskStream(request)`：流式调用
  - `callOpenAIAPI()`：API 请求
  - `parseOptimizeResult()`：结果解析

#### config.ts
- **职责**：管理 AI 配置
- **功能**：
  - `getAIConfig()`：读取环境变量
  - `validateAIConfig()`：验证配置
  - 支持多提供商和自定义 API 地址

#### prompts/optimizeTask.ts
- **职责**：定义 LLM 提示词
- **包含**：
  - 系统提示词（角色、规则、输出格式）
  - 用户提示词模板（动态上下文注入）

## 类型系统

### OptimizeTaskResult
LLM 返回的优化结果

```typescript
interface OptimizeTaskResult {
  title: string;              // 优化后的标题
  description?: string;       // 详细描述
  priority: Priority;         // 优先级
  dueDate?: Date;            // 截止日期
  tags: string[];            // 标签
  reasoning: string;         // 推理说明
}
```

### OptimizeTaskRequest
优化请求参数

```typescript
interface OptimizeTaskRequest {
  userInput: string;         // 原始用户输入
  categoryId?: string;       // 分类 ID
  categoryName?: string;     // 分类名称
}
```

## 环境变量配置

```
前端环境变量（Next.js 公开变量）
├── NEXT_PUBLIC_AI_PROVIDER    # LLM 提供商
├── NEXT_PUBLIC_AI_API_KEY     # API 密钥
├── NEXT_PUBLIC_AI_MODEL       # 模型名称
└── NEXT_PUBLIC_AI_BASE_URL    # 自定义 API 地址（可选）
```

**注意**：使用 `NEXT_PUBLIC_` 前缀的变量会在客户端代码中暴露，API Key 应该谨慎处理。

## 扩展点

### 1. 增加新的 LLM 提供商
在 `config.ts` 中扩展 `AIConfig` 接口，并在 `taskOptimizer.ts` 中添加新的 API 调用实现。

### 2. 自定义提示词
修改 `prompts/optimizeTask.ts` 中的提示词来改变 AI 的行为。

### 3. 缓存层
在 `useAIOptimizeTask` Hook 中添加缓存逻辑来减少 API 调用。

### 4. 流式处理
使用 `optimizeTaskStream()` 实现流式 UI 更新。

### 5. 本地 LLM
通过修改 `config.ts` 和 `taskOptimizer.ts` 集成本地 LLM（如 Ollama）。

## 性能和可靠性考虑

### 1. 超时处理
```typescript
const TIMEOUT_MS = 30000; // 30 秒超时
```

### 2. 重试逻辑
失败时自动重试（可选）

### 3. 用户反馈
- 加载动画
- 错误提示
- 成功确认

### 4. 降级方案
如果 AI 优化失败，用户仍可使用快速创建模式。

## 安全考虑

1. **API Key 管理**
   - 使用环境变量存储
   - 不在代码中硬编码
   - 使用 `.env.local` 本地文件（不提交到 Git）

2. **用户输入验证**
   - 限制输入长度
   - 清理特殊字符
   - 防止 prompt injection

3. **API 配额控制**
   - 监控 API 使用情况
   - 实现速率限制
   - 设置每日配额

## 测试建议

### 单元测试
- `optimizeTask()` 的各个模块
- 提示词生成逻辑
- 结果解析逻辑

### 集成测试
- 端到端流程（输入→优化→创建）
- 错误处理和降级

### E2E 测试
- 用户交互场景
- 键盘快捷键
- Modal 交互

## 部署清单

- [ ] 配置环境变量 `NEXT_PUBLIC_AI_*`
- [ ] 测试 API 连接
- [ ] 验证 API Key 有效性
- [ ] 检查 API 配额
- [ ] 监控 API 使用和成本
- [ ] 设置错误监控（如 Sentry）
- [ ] 文档化配置和故障排查步骤
