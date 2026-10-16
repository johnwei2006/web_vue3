const PREFIX = 'app_';

/** 带命名空间与 JSON 序列化的本地存储封装 */
export const storage = {
  get<T = unknown>(key: string): T | null {
    const value = localStorage.getItem(PREFIX + key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  },
  set(key: string, value: unknown): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
  clear(): void {
    localStorage.clear();
  },
};
