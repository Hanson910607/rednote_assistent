import CryptoJS from 'crypto-js';

const SECRET_KEY = 'xiaohongshu-assistant-secret-key-2024-v1';

export function encrypt(text: string): string {
  if (!text) return '';
  try {
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY);
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decrypt(ciphertext: string): string {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export function hash(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA256(text + SECRET_KEY).toString();
}

export function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function isEncrypted(value: string): boolean {
  return Boolean(value && value.includes(':') && value.split(':').length === 2);
}
