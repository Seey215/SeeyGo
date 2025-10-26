import { getAIConfig } from '../config';
import { getSystemPrompt, getUserPrompt } from '../prompts/optimizeTask';
import type { OptimizeTaskRequest, OptimizeTaskResponse, OptimizeTaskResult } from '../types';

/**
 * 任务优化服务
 * 调用LLM API来优化用户输入的任务
 */

/**
 * 调用OpenAI兼容的API
 */
async function callOpenAIAPI(
  systemPrompt: string,
  userPrompt: string,
  config: ReturnType<typeof getAIConfig>,
): Promise<string> {
  const url = config.baseUrl || 'https://api.openai.com/v1';
  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 解析LLM返回的JSON响应
 */
function parseOptimizeResult(content: string): OptimizeTaskResult {
  // 尝试提取JSON块
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Unable to parse LLM response - no JSON found');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // 验证必要字段
  if (!parsed.title) {
    throw new Error('Invalid response - missing title');
  }

  // 转换dueDate为Date对象（如果存在）
  const result: OptimizeTaskResult = {
    title: parsed.title,
    description: parsed.description || undefined,
    priority: parsed.priority || 'medium',
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    reasoning: parsed.reasoning || '',
  };

  // 验证priority值
  if (!['low', 'medium', 'high'].includes(result.priority)) {
    result.priority = 'medium';
  }

  return result;
}

/**
 * 优化任务输入
 * 调用LLM优化用户输入的任务内容
 */
export async function optimizeTask(request: OptimizeTaskRequest): Promise<OptimizeTaskResponse> {
  try {
    const config = getAIConfig();
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(request);

    // 调用LLM API
    const response = await callOpenAIAPI(systemPrompt, userPrompt, config);

    // 解析结果
    const optimizedTask = parseOptimizeResult(response);

    return {
      success: true,
      data: optimizedTask,
    };
  } catch (error) {
    console.error('Task optimization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * 流式优化任务输入（用于长流程）
 */
export async function* optimizeTaskStream(request: OptimizeTaskRequest) {
  try {
    const config = getAIConfig();
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(request);

    const url = config.baseUrl || 'https://api.openai.com/v1';
    const response = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Stream API error');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || '';
            fullContent += content;
            yield { type: 'chunk', content };
          } catch {
            // 忽略无效的JSON
          }
        }
      }
    }

    // 最后尝试解析完整内容
    const optimizedTask = parseOptimizeResult(fullContent);
    yield { type: 'complete', data: optimizedTask };
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
