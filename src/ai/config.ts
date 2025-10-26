/**
 * AI SDK配置文件
 * 支持多种LLM提供商（OpenAI, Claude等）
 */

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'deepseek';
  apiKey: string;
  model: string;
  baseUrl?: string; // 可选的自定义API地址
}

/**
 * 获取AI配置
 * 从环境变量读取配置
 */
export function getAIConfig(): AIConfig {
  const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai') as AIConfig['provider'];
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  const model = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL;

  if (!apiKey) {
    throw new Error('AI_API_KEY is not configured in environment variables');
  }

  return {
    provider,
    apiKey,
    model,
    baseUrl,
  };
}

/**
 * 验证AI配置是否有效
 */
export function validateAIConfig(): boolean {
  try {
    const config = getAIConfig();
    return Boolean(config.apiKey && config.model);
  } catch {
    return false;
  }
}
