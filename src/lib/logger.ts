type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function write(level: LogLevel, tag: string, message: string, data?: unknown) {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${tag}]`;

  queueMicrotask(() => {
    if (level === 'error') console.error(prefix, message, data ?? '');
    else if (level === 'warn') console.warn(prefix, message, data ?? '');
    else console.log(prefix, message, data ?? '');
  });
}

export const logger = {
  info: (tag: string, msg: string, data?: unknown) => write('info', tag, msg, data),
  warn: (tag: string, msg: string, data?: unknown) => write('warn', tag, msg, data),
  error: (tag: string, msg: string, data?: unknown) => write('error', tag, msg, data),
  debug: (tag: string, msg: string, data?: unknown) => write('debug', tag, msg, data),
};
