/**
 * 性能指标追踪系统
 * 记录关键操作的性能数据，用于监控与优化
 */

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private metrics: Map<string, Metric[]> = new Map();
  private isDev: boolean = process.env.NODE_ENV === 'development';
  private maxMetricsPerName: number = 100;

  /**
   * 记录一个指标
   */
  record(name: string, value: number, unit: string = 'ms', tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricsArray = this.metrics.get(name);
    if (metricsArray) {
      metricsArray.push(metric);

      // 保留最近 100 条记录
      if (metricsArray.length > this.maxMetricsPerName) {
        metricsArray.shift();
      }
    }

    // 开发环境下打印性能数据
    if (this.isDev) {
      console.debug(`[METRIC] ${name}: ${value}${unit}`, tags);
    }
  }

  /**
   * 计时器：开始计时
   */
  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.record(name, duration, 'ms');
    };
  }

  /**
   * 获取指标统计信息
   */
  getStats(name: string): { count: number; avg: number; min: number; max: number } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const values = metrics.map(m => m.value);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { count, avg, min, max };
  }

  /**
   * 获取所有指标名称
   */
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * 获取所有指标数据
   */
  getAllMetrics(): Record<string, Metric[]> {
    const result: Record<string, Metric[]> = {};
    for (const [name, metrics] of this.metrics) {
      result[name] = metrics;
    }
    return result;
  }

  /**
   * 清空所有指标
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * 导出指标数据为 JSON
   */
  export(): string {
    return JSON.stringify(Array.from(this.metrics.entries()), null, 2);
  }
}

export const metrics = new MetricsCollector();
