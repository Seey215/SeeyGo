# AI 任务优化功能文档

## 功能概述

SeeyGo 现已集成 LLM 能力，支持通过 AI 智能优化任务输入。用户输入的任务内容会由 LLM 自动识别和优化，包括：

- **标题优化**：使用更清晰、更简洁的语言
- **优先级识别**：根据内容自动判断任务优先级（高/中/低）
- **截止日期提取**：识别输入中的时间表述并转换为标准日期
- **标签提取**：自动识别和提取相关的任务标签
- **描述补充**：为任务添加详细的描述（如有需要）

## 使用方式

### 快速创建模式（原有功能）
```
按 Enter 键 → 直接创建任务，使用默认配置（中优先级、无截止日期）
```

### AI 优化创建模式（新功能）
```
按 Shift+Enter 键 → 触发 AI 优化，显示预览 Modal，允许编辑后确认创建
```

### 取消操作
```
按 Escape 键 → 清空输入框并关闭任何打开的 Modal
```

## 使用示例

### 示例 1：购物清单
**原始输入：**
```
买点菜，要有廋肉和白菜，还有土豆，还要买一点葱姜
```

**AI 优化后的结果：**
```
标题：购物清单 - 蔬菜和肉类
描述：购买以下食材：廋肉、白菜、土豆、葱、姜
优先级：中
截止日期：（识别为今天或明天）
标签：['购物', '食材', '日常生活']
```

### 示例 2：工作任务
**原始输入：**
```
明天下午必须完成项目文档，这很重要，需要包括架构、API文档和部署指南
```

**AI 优化后的结果：**
```
标题：完成项目文档（架构、API、部署指南）
描述：编写项目文档，包括：
- 系统架构说明
- API 文档
- 部署指南
优先级：高
截止日期：明天下午
标签：['工作', '文档', '项目']
```

## 配置指南

### 1. 环境变量设置

在项目根目录创建 `.env.local` 文件，配置以下变量：

```bash
# OpenAI 配置
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AI_MODEL=gpt-4o-mini
```

**支持的提供商：**
- `openai` - OpenAI GPT 系列
- `anthropic` - Anthropic Claude 系列  
- `deepseek` - DeepSeek 系列

### 2. 获取 API 密钥

#### OpenAI
1. 访问 https://platform.openai.com/
2. 登录或注册账户
3. 在 API Keys 页面创建新的密钥
4. 将密钥复制到 `NEXT_PUBLIC_AI_API_KEY`

#### Anthropic (Claude)
1. 访问 https://console.anthropic.com/
2. 创建或登录账户
3. 生成 API 密钥
4. 配置如下：
```bash
NEXT_PUBLIC_AI_PROVIDER=anthropic
NEXT_PUBLIC_AI_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_AI_MODEL=claude-3-haiku-20240307
```

#### DeepSeek
1. 访问 https://platform.deepseek.com/
2. 创建 API 密钥
3. 配置如下：
```bash
NEXT_PUBLIC_AI_PROVIDER=deepseek
NEXT_PUBLIC_AI_API_KEY=sk_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_AI_MODEL=deepseek-chat
NEXT_PUBLIC_AI_BASE_URL=https://api.deepseek.com/v1
```

### 3. 自定义 API 基础地址（可选）

如果使用自托管或代理 API：

```bash
NEXT_PUBLIC_AI_BASE_URL=https://your-custom-api-endpoint.com/v1
```

## 目录结构

```
src/
├── ai/                          # AI 模块根目录
│   ├── config.ts                # AI SDK 配置和验证
│   ├── types.ts                 # AI 相关的类型定义
│   ├── prompts/
│   │   └── optimizeTask.ts      # 任务优化的系统和用户提示词
│   └── services/
│       └── taskOptimizer.ts     # 任务优化 API 调用实现
├── components/
│   ├── ai/
│   │   └── TaskOptimizeModal.tsx # 优化结果预览和编辑 Modal
│   └── tasks/
│       └── QuickCreateTask.tsx  # 快速创建组件（已集成 AI 优化）
├── hooks/
│   ├── useAIOptimizeTask.ts     # AI 优化 Hook
│   └── index.ts                 # （已导出 useAIOptimizeTask）
```

## 核心类型定义

### OptimizeTaskResult
```typescript
interface OptimizeTaskResult {
  title: string;                 // 优化后的标题
  description?: string;          // 任务描述
  priority: Priority;            // 优先级：low | medium | high
  dueDate?: Date;               // 截止日期
  tags: string[];               // 标签数组
  reasoning: string;            // LLM 的推理说明
}
```

### OptimizeTaskRequest
```typescript
interface OptimizeTaskRequest {
  userInput: string;            // 用户的原始输入
  categoryId?: string;          // 分类 ID（可选）
  categoryName?: string;        // 分类名称（用于 LLM 上下文）
}
```

## API 调用流程

1. **用户输入 + Shift+Enter**
   ```
   用户输入框 → 触发 handleAIOptimize()
   ```

2. **调用 AI 优化 Hook**
   ```
   useAIOptimizeTask.optimize() → 发送优化请求
   ```

3. **服务层处理**
   ```
   optimizeTask(request) → 调用 LLM API
   ```

4. **LLM 处理**
   ```
   系统提示词 + 用户提示词 → LLM 模型 → 返回结构化 JSON
   ```

5. **结果预览**
   ```
   TaskOptimizeModal 显示结果 → 用户确认或编辑 → 创建任务
   ```

## 提示词设计

### 系统提示词的关键要素

- **角色定义**：任务管理助手
- **职责说明**：优化和结构化任务输入
- **输出格式**：强制返回有效的 JSON
- **判断标准**：优先级判断、日期识别、标签提取规则

详见 `src/ai/prompts/optimizeTask.ts`

## 错误处理

### 常见错误和解决方案

#### 1. API Key 未配置
```
Error: AI_API_KEY is not configured in environment variables
```
**解决**：检查 `.env.local` 文件中 `NEXT_PUBLIC_AI_API_KEY` 是否正确设置

#### 2. API 请求失败
```
Error: API Error: 401 Unauthorized
```
**解决**：
- 确认 API Key 有效且未过期
- 检查是否有 API 配额限制
- 确认所选模型对您的账户可用

#### 3. JSON 解析失败
```
Error: Unable to parse LLM response - no JSON found
```
**解决**：
- 检查 API 模型是否支持（建议使用较新的模型）
- 增加 `max_tokens` 来获得更完整的响应
- 尝试不同的 LLM 提供商

## 扩展建议

### 1. 批量优化
支持一次优化多个任务输入

### 2. 优化历史
保存用户的优化历史，提供快速重复利用

### 3. 自定义提示词
允许用户自定义 LLM 优化的规则和风格

### 4. 缓存优化
对相同或相似的输入进行缓存，减少 API 调用

### 5. 离线模式
集成本地 LLM（如 Ollama）用于离线场景

## 性能考虑

- **API 调用延迟**：通常 1-3 秒，取决于网络和 LLM 提供商
- **Token 使用**：平均 200-500 tokens 每次优化
- **成本估算**：
  - OpenAI GPT-4o-mini: 约 $0.001-0.002 每次优化
  - Claude Haiku: 约 $0.0005-0.001 每次优化

## 故障排查

### 调试步骤

1. **检查网络连接**
   ```bash
   curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"
   ```

2. **验证 API Key**
   - 检查 Key 是否正确复制（无多余空格）
   - 确认 Key 未过期

3. **查看浏览器控制台**
   - 打开开发者工具 (F12)
   - 检查 Network 和 Console 标签的错误信息

4. **检查环境变量**
   ```bash
   # 在浏览器控制台运行
   console.log(process.env.NEXT_PUBLIC_AI_API_KEY)
   ```

## 最佳实践

1. **使用环境变量**：永远不要在代码中硬编码 API Key

2. **错误处理**：始终为 AI 调用添加 try-catch 和回退逻辑

3. **用户体验**：
   - 显示加载状态
   - 提供明确的错误提示
   - 允许用户编辑 AI 建议

4. **成本控制**：
   - 监控 API 使用情况
   - 考虑使用更便宜的模型
   - 实现缓存机制

## 联系和反馈

如有问题或建议，欢迎提交 Issue 或联系开发团队。
