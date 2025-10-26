import type { Priority } from '@/types';

/**
 * AI优化任务的结果类型
 */
export interface OptimizeTaskResult {
  title: string; // 优化后的标题
  description?: string; // 任务描述
  priority: Priority; // 优先级：low, medium, high
  dueDate?: Date; // 截止日期
  tags: string[]; // 标签
  reasoning: string; // LLM的推理说明
}

/**
 * AI优化任务的请求参数
 */
export interface OptimizeTaskRequest {
  userInput: string; // 用户输入的原始内容
  categoryId?: string; // 分类ID（可选）
  categoryName?: string; // 分类名称（用于上下文）
}

/**
 * AI优化任务的响应
 */
export interface OptimizeTaskResponse {
  success: boolean;
  data?: OptimizeTaskResult;
  error?: string;
}
