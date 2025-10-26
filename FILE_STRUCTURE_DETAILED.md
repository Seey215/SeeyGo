# SeeyGo AI 功能文件结构详解

## 完整的项目文件结构（仅显示 AI 相关部分）

```
SeeyGo/
│
├── 📄 .env.example                    # 环境变量示例（新建）
├── 📄 AI_QUICKSTART.md               # AI 快速开始指南（新建）
├── 📄 ARCHITECTURE_AI.md             # AI 架构设计文档（新建）
├── 📄 AI_IMPLEMENTATION_SUMMARY.md   # 实现总结（新建）
├── 📄 README.md                      # 主项目说明（已更新）
│
└── src/
    ├── ai/                           # ⭐ AI 模块（新建目录）
    │   ├── 📄 config.ts              # AI SDK 配置管理
    │   │   ├── AIConfig 接口
    │   │   ├── getAIConfig()
    │   │   └── validateAIConfig()
    │   │
    │   ├── 📄 types.ts               # AI 类型定义
    │   │   ├── OptimizeTaskResult
    │   │   ├── OptimizeTaskRequest
    │   │   └── OptimizeTaskResponse
    │   │
    │   ├── 📄 index.ts               # 模块导出（新建）
    │   │
    │   ├── 📄 README.md              # AI 详细文档（新建）
    │   │
    │   ├── prompts/                  # 提示词目录（新建）
    │   │   └── 📄 optimizeTask.ts
    │   │       ├── getSystemPrompt()
    │   │       ├── getUserPrompt()
    │   │       └── PROMPTS 对象
    │   │
    │   └── services/                 # API 服务目录（新建）
    │       └── 📄 taskOptimizer.ts
    │           ├── optimizeTask()          # 主要入口
    │           ├── optimizeTaskStream()    # 流式处理
    │           ├── callOpenAIAPI()
    │           └── parseOptimizeResult()
    │
    ├── components/
    │   ├── ai/                       # ⭐ AI 组件目录（新建）
    │   │   ├── 📄 index.ts           # 组件导出（新建）
    │   │   └── 📄 TaskOptimizeModal.tsx
    │   │       ├── TaskOptimizeModalProps 接口
    │   │       ├── 预览模式
    │   │       └── 编辑模式
    │   │
    │   └── tasks/
    │       └── 📄 QuickCreateTask.tsx    # (已更新)
    │           ├── 快速创建模式 (Enter)
    │           ├── AI 优化模式 (Shift+Enter)
    │           ├── handleAIOptimize()
    │           └── handleConfirmOptimized()
    │
    ├── hooks/
    │   ├── 📄 useAIOptimizeTask.ts   # ⭐ AI Hook（新建）
    │   │   ├── optimize() 方法
    │   │   ├── reset() 方法
    │   │   └── 状态管理
    │   │
    │   └── 📄 index.ts              # (已更新)
    │       └── 导出 useAIOptimizeTask
    │
    └── types.ts                      # (保持不变)
        └── Task, TaskFormData 等
```

---

## 各文件的职责和功能

### 📍 配置层

#### `src/ai/config.ts`
```
职责：管理 AI SDK 配置
内容：
├── AIConfig 接口定义
├── getAIConfig() - 从环境变量读取
├── validateAIConfig() - 验证配置
└── 支持多个提供商和自定义 API 地址
```

#### `src/ai/types.ts`
```
职责：定义 AI 相关的所有类型
内容：
├── OptimizeTaskRequest - 优化请求参数
├── OptimizeTaskResult - LLM 返回结果
└── OptimizeTaskResponse - API 响应包装
```

---

### 📍 业务逻辑层

#### `src/hooks/useAIOptimizeTask.ts`
```
职责：提供 React Hook 形式的 AI 优化接口
功能：
├── 状态管理 (isLoading, error, result)
├── optimize() 方法 - 发起优化请求
├── reset() 方法 - 重置状态
└── 错误处理和异常捕获
```

---

### 📍 提示词层

#### `src/ai/prompts/optimizeTask.ts`
```
职责：定义 LLM 的系统和用户提示词
内容：
├── getSystemPrompt()
│   └── 定义 AI 的角色、规则、输出格式
├── getUserPrompt()
│   └── 动态生成包含用户输入和上下文的提示词
└── PROMPTS 导出对象
```

**系统提示词关键要素：**
- AI 的角色定义（任务管理助手）
- 任务优化的职责
- JSON 输出格式要求
- 优先级判断标准
- 日期识别规则
- 标签提取策略

---

### 📍 API 服务层

#### `src/ai/services/taskOptimizer.ts`
```
职责：处理与 LLM API 的通信
核心函数：
├── optimizeTask(request) - 主入口
│   ├── 获取配置
│   ├── 生成提示词
│   ├── 调用 API
│   ├── 解析结果
│   └── 错误处理
├── callOpenAIAPI() - OpenAI 兼容 API 调用
├── parseOptimizeResult() - JSON 响应解析
└── optimizeTaskStream() - 流式处理（可选）
```

**调用流程：**
```
optimizeTask()
  ↓
getAIConfig() + getSystemPrompt() + getUserPrompt()
  ↓
callOpenAIAPI()
  ↓
LLM 处理
  ↓
parseOptimizeResult()
  ↓
返回 OptimizeTaskResult
```

---

### 📍 UI 层

#### `src/components/ai/TaskOptimizeModal.tsx`
```
职责：显示 AI 优化结果的 Modal 对话框
功能：
├── 预览模式
│   ├── 显示优化后的标题
│   ├── 显示描述、优先级、日期、标签
│   ├── 显示 AI 推理说明
│   └── 提供编辑、确认、取消操作
├── 编辑模式
│   ├── 修改标题
│   ├── 修改描述
│   ├── 修改优先级
│   ├── 修改截止日期
│   ├── 修改标签
│   └── 提供保存或取消
└── 加载和错误状态显示
```

#### `src/components/tasks/QuickCreateTask.tsx` (已更新)
```
职责：快速创建任务的输入框组件
功能：
├── Enter 快速创建
│   └── 直接创建（默认配置）
├── Shift+Enter AI 优化
│   ├── 触发 handleAIOptimize()
│   ├── 显示 TaskOptimizeModal
│   └── 支持编辑后创建
├── Escape 取消
├── 类别标签显示
└── 使用说明文字
```

---

## 数据流转图

### 快速创建流程（原有）
```
用户输入
   ↓
按 Enter
   ↓
handleKeyDown (Enter 分支)
   ↓
createTaskDirectly()
   ↓
调用 createTask(taskData)
   ↓
Redux/Context 状态更新
   ↓
任务立即显示在列表中
```

### AI 优化创建流程（新增）
```
用户输入
   ↓
按 Shift+Enter
   ↓
handleKeyDown (Shift+Enter 分支)
   ↓
handleAIOptimize(inputText)
   ↓
useAIOptimizeTask.optimize()
   ↓
taskOptimizer.optimizeTask()
   ↓
1. getAIConfig() 读配置
2. getSystemPrompt() 获系统提示词
3. getUserPrompt() 生成用户提示词
   ↓
callOpenAIAPI(systemPrompt, userPrompt)
   ↓
POST /chat/completions
   ↓
LLM 处理并返回 JSON
   ↓
parseOptimizeResult() 解析
   ↓
返回 OptimizeTaskResult
   ↓
Hook 更新状态 (result, isLoading=false)
   ↓
TaskOptimizeModal 显示预览
   ↓
用户选择：
├── 确认 → handleConfirmOptimized() → createTask() → 完成
├── 编辑 → 修改字段 → handleConfirmOptimized() → createTask() → 完成
└── 取消 → 关闭 Modal → 继续编辑或放弃
```

---

## 文件依赖关系

```
src/
├── components/
│   └── tasks/QuickCreateTask.tsx
│       ├── imports: useTasks, useCategories, useAIOptimizeTask
│       ├── imports: TaskOptimizeModal
│       ├── imports: TaskFormData, OptimizeTaskResult
│       └── 组件逻辑
│
├── components/ai/
│   └── TaskOptimizeModal.tsx
│       ├── imports: Modal
│       ├── imports: OptimizeTaskResult, Priority
│       └── 预览和编辑逻辑
│
├── hooks/
│   ├── useAIOptimizeTask.ts
│   │   ├── imports: optimizeTask
│   │   ├── imports: OptimizeTaskRequest, OptimizeTaskResult
│   │   └── Hook 逻辑
│   │
│   └── index.ts
│       └── exports: useAIOptimizeTask
│
└── ai/
    ├── config.ts
    │   └── getAIConfig(), validateAIConfig()
    │
    ├── types.ts
    │   └── OptimizeTaskRequest, OptimizeTaskResult, OptimizeTaskResponse
    │
    ├── prompts/optimizeTask.ts
    │   ├── getSystemPrompt()
    │   ├── getUserPrompt()
    │   └── uses: types (Priority)
    │
    ├── services/taskOptimizer.ts
    │   ├── imports: config, prompts
    │   ├── imports: types
    │   ├── optimizeTask() - 主函数
    │   └── 内部辅助函数
    │
    └── index.ts
        └── exports: config, types, services, prompts
```

---

## 环境变量依赖

```
应用启动
   ↓
组件渲染 QuickCreateTask
   ↓
用户按 Shift+Enter
   ↓
useAIOptimizeTask.optimize()
   ↓
taskOptimizer.optimizeTask()
   ↓
getAIConfig()
   ↓
读取环境变量：
├── NEXT_PUBLIC_AI_PROVIDER
├── NEXT_PUBLIC_AI_API_KEY
├── NEXT_PUBLIC_AI_MODEL
└── NEXT_PUBLIC_AI_BASE_URL (可选)
   ↓
验证配置有效性
   ↓
发送 API 请求
```

---

## 扩展方案

### 增加新的 LLM 提供商

1. **修改 config.ts**
   ```typescript
   export type AIProvider = 'openai' | 'anthropic' | 'deepseek' | 'yourprovider'
   ```

2. **修改 taskOptimizer.ts**
   ```typescript
   async function callYourProviderAPI() {
     // 实现你的 API 调用逻辑
   }
   ```

3. **在 optimizeTask() 中添加分支**
   ```typescript
   switch (config.provider) {
     case 'yourprovider':
       return callYourProviderAPI()
   }
   ```

4. **更新文档和环境变量示例**

---

## 性能优化点

1. **缓存层**
   - 可在 Hook 中添加缓存，避免重复优化相同输入

2. **批处理**
   - 支持一次优化多个任务

3. **流式处理**
   - 使用 `optimizeTaskStream()` 实时显示 AI 思考过程

4. **本地 LLM**
   - 集成 Ollama 等本地模型，避免网络延迟

---

## 测试覆盖建议

```
src/ai/
├── config.ts
│   └── 测试：getAIConfig(), validateAIConfig()
│
├── services/taskOptimizer.ts
│   ├── 测试：optimizeTask() 成功路径
│   ├── 测试：callOpenAIAPI() 错误处理
│   └── 测试：parseOptimizeResult() JSON 解析
│
└── prompts/optimizeTask.ts
    ├── 测试：getSystemPrompt() 输出
    └── 测试：getUserPrompt() 上下文注入

src/hooks/
└── useAIOptimizeTask.ts
    ├── 测试：状态管理
    ├── 测试：错误处理
    └── 测试：reset() 功能

src/components/
├── TaskOptimizeModal.tsx
│   ├── 测试：预览模式渲染
│   ├── 测试：编辑模式交互
│   └── 测试：数据提交
│
└── QuickCreateTask.tsx
    ├── 测试：Enter 快速创建
    ├── 测试：Shift+Enter AI 优化
    └── 测试：Escape 取消
```

---

**完整的文件结构和依赖关系已详细说明！** 🚀
