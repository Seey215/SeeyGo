# 🤖 AI 功能快速开始指南

## 5 分钟快速配置

### 第 1 步：获取 API Key

选择以下任一提供商：

#### 方式 A: 使用 OpenAI（推荐）
1. 访问 https://platform.openai.com/api-keys
2. 注册或登录
3. 点击「Create new secret key」
4. 复制生成的 key（格式：`sk-...`）

#### 方式 B: 使用 DeepSeek（中国用户推荐，成本更低）
1. 访问 https://platform.deepseek.com/api_keys
2. 注册或登录
3. 创建 API key
4. 复制生成的 key

### 第 2 步：配置环境变量

在项目根目录创建 `.env.local` 文件：

**OpenAI 配置:**
```bash
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_AI_API_KEY=sk_your_api_key_here_replace_me
NEXT_PUBLIC_AI_MODEL=gpt-4o-mini
```

**DeepSeek 配置:**
```bash
NEXT_PUBLIC_AI_PROVIDER=deepseek
NEXT_PUBLIC_AI_API_KEY=sk_your_deepseek_key_here
NEXT_PUBLIC_AI_MODEL=deepseek-chat
NEXT_PUBLIC_AI_BASE_URL=https://api.deepseek.com/v1
```

### 第 3 步：重启应用

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 第 4 步：开始使用

在快速创建任务框中：
- 输入任务 → 按 **Shift+Enter** → 等待 AI 优化 → 确认或编辑 → 创建任务

完成！🎉

---

## 使用示例

### 示例 1：购物任务
```
输入：买菜，需要番茄、黄瓜、土豆，还要买点面条和油
按 Shift+Enter
↓
AI 优化结果：
- 标题：购物清单 - 蔬菜和日用品
- 优先级：中
- 标签：【购物】【日用品】
- 提取日期：今天（如果输入中有时间提示）
```

### 示例 2：工作任务
```
输入：明天必须完成项目文档，包括架构说明、API接口和部署流程，非常重要
按 Shift+Enter
↓
AI 优化结果：
- 标题：完成项目文档（架构、API、部署）
- 优先级：高
- 截止日期：明天
- 标签：【工作】【文档】【紧急】
- 描述：详细的任务说明
```

### 示例 3：学习任务
```
输入：这周要复习数学和英语，周五考试，需要重点看微积分和语法
按 Shift+Enter
↓
AI 优化结果：
- 标题：周五数学和英语复习考试
- 优先级：高
- 截止日期：周五
- 标签：【学习】【考试】【数学】【英语】
- 描述：复习重点、微积分、语法
```

---

## 功能对比

### 快速创建（Enter）
- ⚡ 立即创建
- 📝 使用默认配置
  - 标题：你的输入
  - 优先级：中
  - 截止日期：无
  - 标签：空
- 🎯 适合快速记录

### AI 优化（Shift+Enter）
- 🤖 由 AI 智能分析
- 📊 自动提取信息
  - 标题：优化后的清晰表述
  - 优先级：根据内容判断
  - 截止日期：自动提取时间
  - 标签：相关话题
- ✏️ 支持编辑和确认
- ⏱️ 稍微耗时（1-3 秒）
- 💡 适合复杂或重要任务

---

## 常见问题

### Q1: AI 显示错误或无响应？
**A:** 检查以下项：
1. 网络连接是否正常
2. API Key 是否正确（复制时避免多余空格）
3. API 配额是否用完
4. 运行 `npm run dev` 后浏览器是否刷新

### Q2: 如何更换 LLM 提供商？
**A:** 编辑 `.env.local` 文件中的以下变量：
```bash
NEXT_PUBLIC_AI_PROVIDER=openai  # 改成 deepseek、anthropic 等
NEXT_PUBLIC_AI_API_KEY=新的密钥
NEXT_PUBLIC_AI_MODEL=对应的模型名
```
然后重启应用。

### Q3: AI 的优化结果不满意怎么办？
**A:** 在预览 Modal 中：
1. 点击「编辑」按钮
2. 修改标题、优先级、日期、标签
3. 点击「保存创建」

### Q4: 会收费吗？
**A:** 取决于你选择的提供商：
- **OpenAI**: 约 $0.001-0.002 每次优化
- **DeepSeek**: 约 $0.0005-0.001 每次优化
- **Anthropic**: 约 $0.0005-0.001 每次优化

都很便宜！对于个人使用，每月通常不超过 $5。

### Q5: 支持离线使用吗？
**A:** 当前版本需要网络连接和 API Key。未来计划支持本地 LLM（如 Ollama）。

---

## 高级配置

### 自定义 API 地址
如果使用代理或自托管服务：
```bash
NEXT_PUBLIC_AI_BASE_URL=https://your-proxy-or-api.com/v1
```

### 模型选择建议

**如果追求速度和成本：**
```bash
NEXT_PUBLIC_AI_MODEL=gpt-4o-mini     # OpenAI
# 或
NEXT_PUBLIC_AI_MODEL=deepseek-chat   # DeepSeek
```

**如果追求质量和能力：**
```bash
NEXT_PUBLIC_AI_MODEL=gpt-4o          # OpenAI
# 或
NEXT_PUBLIC_AI_MODEL=claude-3-opus   # Anthropic
```

---

## 故障排查

### 错误 1: "AI_API_KEY is not configured"
**原因**: 环境变量未设置
**解决**:
1. 检查 `.env.local` 文件是否存在
2. 确认 `NEXT_PUBLIC_AI_API_KEY` 是否正确设置
3. 重启开发服务器

### 错误 2: "401 Unauthorized"
**原因**: API Key 无效或已过期
**解决**:
1. 重新获取 API Key
2. 确认 Key 没有多余空格或特殊字符
3. 检查是否选择了正确的提供商

### 错误 3: "Unable to parse LLM response"
**原因**: AI 响应格式不符合预期
**解决**:
1. 尝试使用不同的 LLM 模型
2. 检查 API 配额是否充足
3. 尝试输入更简单的任务描述

### 错误 4: 超时或加载很慢
**原因**: 网络不稳定或 API 服务缓慢
**解决**:
1. 检查网络连接
2. 尝试使用更快的 LLM 模型（如 gpt-4o-mini）
3. 等待稍后重试

---

## 使用建议

### ✅ 最佳实践
- 在 AI 确认之前检查优化结果
- 对于关键任务，手动编辑以确保正确
- 保持 API Key 安全，不要分享或提交到 Git
- 定期监控 API 使用情况和成本

### ❌ 避免做的事
- 不要硬编码 API Key 到代码中
- 不要将 `.env.local` 提交到版本控制
- 不要使用过期的 API Key
- 不要忽视错误提示

---

## 需要帮助？

- 📖 查看完整文档：`src/ai/README.md`
- 🏗️ 了解架构：`ARCHITECTURE_AI.md`
- 🐛 报告问题：提交 GitHub Issue
- 💬 讨论建议：开启 GitHub Discussion

---

## 下一步

### 推荐阅读
1. [AI 功能完整文档](./src/ai/README.md) - 详细的配置和使用指南
2. [架构设计文档](./ARCHITECTURE_AI.md) - 了解系统设计
3. [类型定义](./src/ai/types.ts) - API 和数据结构

### 想要扩展？
- 添加新的 LLM 提供商
- 自定义 AI 提示词
- 实现缓存和优化
- 添加流式处理支持

---

**祝你使用愉快！🚀**
