import type { OptimizeTaskRequest } from '../types';

/**
 * 生成优化任务的系统提示词
 */
export function getSystemPrompt(): string {
  return `你是一个任务管理助手。你的职责是帮助用户优化和结构化他们的任务输入。

当用户提供一个任务描述时，你需要：
1. 理解用户的真实意图
2. 优化和清晰化标题
3. 提取关键的任务信息
4. 根据内容判断合适的优先级
5. 如果有时间相关的信息，提取截止日期
6. 识别和提取相关的标签

你必须返回有效的JSON格式，包含以下字段：
{
  "title": "清晰简洁的任务标题",
  "description": "详细的任务描述（可选）",
  "priority": "high|medium|low",
  "dueDate": "ISO 8601格式的日期，如2025-10-28（可选）",
  "tags": ["标签1", "标签2"],
  "reasoning": "你的推理过程和决策说明"
}

优先级判断标准：
- high: 紧急、重要、有明确截止日期、关键事项
- medium: 常规任务、默认优先级
- low: 可选项、不紧急、日常琐碎事务

截止日期判断：
- 如果用户提到"今天、明天、下周一、10月30号"等具体时间，则提取
- 否则留空

标签提取：
- 从任务内容中识别主题、类别、属性
- 最多提取3-5个标签
- 标签应该简洁有意义`;
}

/**
 * 生成用户提示词
 */
export function getUserPrompt(request: OptimizeTaskRequest): string {
  const categoryContext = request.categoryName
    ? `\n分类信息：这个任务属于"${request.categoryName}"分类`
    : '';

  return `请优化以下任务输入：

用户输入："${request.userInput}"${categoryContext}

请分析这个输入，按照要求返回优化后的结构化任务数据。`;
}

/**
 * 提示词模板集合
 */
export const PROMPTS = {
  getSystemPrompt,
  getUserPrompt,
};
