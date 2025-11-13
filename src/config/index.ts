/**
 * 应用配置文件
 * 包括全局配置、常量、环境变量等
 */

export const APP_CONFIG = {
  // 应用基本信息
  name: 'SeeyGo',
  version: '0.2.0',
  description: '高性能任务管理应用',

  // 功能开关
  features: {
    enableAI: true,
    enableMetrics: process.env.NODE_ENV === 'production',
    enableLogger: true,
    enableVirtualList: true,
  },

  // 缓存配置
  cache: {
    lruMapCapacity: 100,
    filterResultsCacheSize: 50,
    taskStatsCacheSize: 10,
  },

  // 性能配置
  performance: {
    virtualListPageSize: 20,
    animationDuration: 250,
    debounceDelay: 300,
    throttleDelay: 100,
  },

  // 存储配置
  storage: {
    useLocalStorage: true,
    syncInterval: 5000, // 5 秒
    maxRetries: 3,
  },

  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    retryCount: 3,
  },

  // 日志配置
  logging: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    maxBufferSize: 100,
    enableRemoteLogging: false,
  },

  // 指标配置
  metrics: {
    enableCollection: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% 采样
    batchSize: 50,
  },
};

/**
 * 获取环境变量
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value =
    typeof window !== 'undefined'
      ? // 客户端
        (window as unknown as Record<string, unknown>)[`NEXT_PUBLIC_${key}`]
      : // 服务端
        process.env[key] || process.env[`NEXT_PUBLIC_${key}`];

  return (value as string) || defaultValue || '';
};

/**
 * 检查是否在开发环境
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * 检查是否在生产环境
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};
