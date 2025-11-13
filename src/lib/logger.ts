/**
 * 日志系统封装
 * Development: console 输出
 * Production: 预留接入第三方服务的接口
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDev: boolean = process.env.NODE_ENV === 'development';
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 100;

  log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      error,
    };

    // 保存到缓冲区
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // 开发环境输出到控制台
    if (this.isDev) {
      this.logToConsole(entry);
    }

    // 生产环境可以发送到远程服务
    if (!this.isDev && level === LogLevel.ERROR) {
      this.sendToRemote(entry);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * 获取日志缓冲区内容
   */
  getLogs(count: number = 10): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * 清空日志缓冲区
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  private logToConsole(entry: LogEntry): void {
    const prefix = `[${new Date(entry.timestamp).toISOString()}] ${entry.level.toUpperCase()}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context, entry.error);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context, entry.error);
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.context, entry.error);
        break;
    }
  }

  private sendToRemote(_entry: LogEntry): void {
    // TODO: 接入远程日志服务（如 Sentry、LogRocket 等）
    // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
  }
}

export const logger = new Logger();
