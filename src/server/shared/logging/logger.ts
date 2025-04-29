/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

/**
 * Log context
 */
export interface LogContext {
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

/**
 * Simple logger implementation
 */
class Logger {
  /**
   * Log a message
   * @param level The log level
   * @param message The log message
   * @param context The log context
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };
    
    // In production, we would use a proper logging library
    // For now, we just log to the console
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Log a debug message
   * @param message The log message
   * @param context The log context
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   * @param message The log message
   * @param context The log context
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   * @param message The log message
   * @param context The log context
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   * @param message The log message
   * @param error The error
   * @param context The log context
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }

  /**
   * Log a fatal message
   * @param message The log message
   * @param error The error
   * @param context The log context
   */
  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }
}

// Export a singleton instance
export const logger = new Logger();
