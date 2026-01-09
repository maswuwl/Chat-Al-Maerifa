
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private listeners: ((log: LogEntry) => void)[] = [];

  log(level: LogLevel, message: string) {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    this.logs.push(entry);
    this.listeners.forEach(l => l(entry));
    console.debug(`[StudioMonitor] ${level}: ${message}`);
  }

  getHistory() {
    return [...this.logs];
  }

  subscribe(callback: (log: LogEntry) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

export const monitorLogger = new Logger();
