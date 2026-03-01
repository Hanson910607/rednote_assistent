import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, hash, generateApiKey, isEncrypted } from '../utils/crypto'

describe('Crypto Utils', () => {
  it('should encrypt and decrypt text correctly', () => {
    const text = 'test-api-key-123'
    const encrypted = encrypt(text)
    const decrypted = decrypt(encrypted)
    
    expect(encrypted).toBeDefined()
    expect(encrypted).not.toBe(text)
    expect(decrypted).toBe(text)
  })

  it('should return empty string for empty input', () => {
    expect(encrypt('')).toBe('')
    expect(decrypt('')).toBe('')
    expect(hash('')).toBe('')
  })

  it('should generate different encrypted values for same input', () => {
    const text = 'test-api-key-123'
    const encrypted1 = encrypt(text)
    const encrypted2 = encrypt(text)
    
    expect(encrypted1).not.toBe(encrypted2)
    expect(decrypt(encrypted1)).toBe(text)
    expect(decrypt(encrypted2)).toBe(text)
  })

  it('should hash text correctly', () => {
    const text = 'test-api-key-123'
    const hashed = hash(text)
    
    expect(hashed).toBeDefined()
    expect(hashed).toHaveLength(64) // SHA-256 produces 64 character hex string
    expect(hashed).not.toBe(text)
  })

  it('should generate API key correctly', () => {
    const apiKey1 = generateApiKey()
    const apiKey2 = generateApiKey()
    
    expect(apiKey1).toBeDefined()
    expect(apiKey2).toBeDefined()
    expect(apiKey1).not.toBe(apiKey2)
    expect(apiKey1).toHaveLength(64) // 32 bytes = 64 hex characters
  })

  it('should detect encrypted values correctly', () => {
    const text = 'test-api-key-123'
    const encrypted = encrypt(text)
    
    expect(isEncrypted(encrypted)).toBe(true)
    expect(isEncrypted(text)).toBe(false)
    expect(isEncrypted('')).toBe(false)
  })
})
