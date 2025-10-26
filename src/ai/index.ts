// 配置和工具

export type { AIConfig } from './config';
export { getAIConfig, validateAIConfig } from './config';
// 提示词
export { getSystemPrompt, getUserPrompt } from './prompts/optimizeTask';

// 服务
export { optimizeTask, optimizeTaskStream } from './services/taskOptimizer';
// 类型定义
export type { OptimizeTaskRequest, OptimizeTaskResponse, OptimizeTaskResult } from './types';
