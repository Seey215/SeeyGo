/**
 * RAF (Request Animation Frame) 队列调度器
 * 用于集中管理所有动画类 DOM 操作，确保流畅的 60fps 性能
 */

type RAFCallback = () => void;

interface RAFTask {
  id: number;
  callback: RAFCallback;
  priority: number; // 0 = 高优先级, 数字越大优先级越低
}

class RAFQueueManager {
  private queue: RAFTask[] = [];
  private taskIdCounter: number = 0;
  private scheduled: boolean = false;
  private frameId: number | null = null;

  /**
   * 入队一个任务
   * @param callback 要执行的回调函数
   * @param priority 优先级，默认 0（高优先级）
   * @returns 任务ID，可用于取消
   */
  enqueue(callback: RAFCallback, priority: number = 0): number {
    const id = this.taskIdCounter++;
    this.queue.push({ id, callback, priority });

    // 按优先级排序
    this.queue.sort((a, b) => a.priority - b.priority);

    if (!this.scheduled) {
      this.schedule();
    }

    return id;
  }

  /**
   * 取消指定的任务
   */
  cancel(id: number): boolean {
    const index = this.queue.findIndex(task => task.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 清空所有任务
   */
  clear(): void {
    this.queue = [];
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.scheduled = false;
  }

  /**
   * 获取当前队列中的任务数
   */
  size(): number {
    return this.queue.length;
  }

  private schedule(): void {
    this.scheduled = true;
    this.frameId = requestAnimationFrame(() => this.flush());
  }

  private flush(): void {
    const tasks = this.queue.splice(0);
    this.frameId = null;
    this.scheduled = false;

    try {
      for (const task of tasks) {
        task.callback();
      }
    } catch (error) {
      console.error('[RAFQueue] Error executing task:', error);
    }

    // 如果还有任务，继续调度
    if (this.queue.length > 0) {
      this.schedule();
    }
  }
}

// 单例实例
let instance: RAFQueueManager | null = null;

export const getRafQueueManager = (): RAFQueueManager => {
  if (!instance) {
    instance = new RAFQueueManager();
  }
  return instance;
};

/**
 * 便捷函数：入队一个高优先级的 DOM 操作
 */
export const rafQueue = (callback: RAFCallback, priority?: number): number => {
  return getRafQueueManager().enqueue(callback, priority);
};

/**
 * 便捷函数：取消任务
 */
export const cancelRafTask = (id: number): boolean => {
  return getRafQueueManager().cancel(id);
};

/**
 * 便捷函数：清空队列
 */
export const clearRafQueue = (): void => {
  getRafQueueManager().clear();
};
