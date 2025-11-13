/**
 * LRU (Least Recently Used) 缓存实现
 * 用于缓存过滤结果、统计数据、AI 建议等计算量大的结果
 */

export class LRUMap<K, V> {
  private capacity: number;
  private cache: Map<K, V>;
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor(capacity: number = 100) {
    this.capacity = Math.max(1, capacity);
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);

    if (value === undefined) {
      this.missCount++;
      return undefined;
    }

    this.hitCount++;
    // 重新设置键值对来标记最近使用（Map 保持插入顺序）
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    // 如果键已存在，先删除（移到末尾）
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // 添加新键值对
    this.cache.set(key, value);

    // 如果超过容量，删除最旧的（最先插入的）
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value as K;
      this.cache.delete(firstKey);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * 获取缓存命中率统计
   */
  getStats(): { hitCount: number; missCount: number; hitRate: number } {
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? (this.hitCount / total) * 100 : 0;
    return { hitCount: this.hitCount, missCount: this.missCount, hitRate };
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

export const createLRUMap = <K, V>(capacity?: number) => new LRUMap<K, V>(capacity);
