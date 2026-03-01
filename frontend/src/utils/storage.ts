import { decrypt, encrypt } from './crypto';

const STORAGE_PREFIX = 'xiaohongshu_';

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item === null) {
      return defaultValue;
    }
    
    const decrypted = decrypt(item);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue;
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(STORAGE_PREFIX + key, encrypted);
  } catch (error) {
    console.error('Storage set error:', error);
  }
}

export function removeStorage(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function clearStorage(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

export function getStorageKeys(): string[] {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .map(key => key.replace(STORAGE_PREFIX, ''));
}
