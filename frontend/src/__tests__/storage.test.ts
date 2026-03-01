import { describe, it, expect, beforeEach } from 'vitest'
import { getStorage, setStorage, removeStorage, clearStorage, getStorageKeys } from '../utils/storage'

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should set and get storage correctly', () => {
    const key = 'test-key'
    const value = { name: 'test', value: 123 }
    
    setStorage(key, value)
    const result = getStorage(key, null)
    
    expect(result).toEqual(value)
  })

  it('should return default value for non-existent key', () => {
    const result = getStorage('non-existent-key', 'default')
    expect(result).toBe('default')
  })

  it('should remove storage correctly', () => {
    const key = 'test-key'
    const value = 'test-value'
    
    setStorage(key, value)
    expect(getStorage(key, null)).toBe(value)
    
    removeStorage(key)
    expect(getStorage(key, null)).toBeNull()
  })

  it('should clear all storage correctly', () => {
    setStorage('key1', 'value1')
    setStorage('key2', 'value2')
    setStorage('key3', 'value3')
    
    clearStorage()
    
    expect(getStorageKeys()).toHaveLength(0)
  })

  it('should get storage keys correctly', () => {
    setStorage('key1', 'value1')
    setStorage('key2', 'value2')
    setStorage('key3', 'value3')
    
    const keys = getStorageKeys()
    
    expect(keys).toContain('key1')
    expect(keys).toContain('key2')
    expect(keys).toContain('key3')
  })

  it('should handle complex objects', () => {
    const complexObject = {
      name: 'test',
      nested: {
        value: 123,
        array: [1, 2, 3]
      }
    }
    
    setStorage('complex', complexObject)
    const result = getStorage('complex', null)
    
    expect(result).toEqual(complexObject)
  })
})
