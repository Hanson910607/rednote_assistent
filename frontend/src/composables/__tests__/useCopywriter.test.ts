import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest/mocks';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

describe('Copywriter Composable', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia());
  });

  afterEach(() => {
    setActivePinia(createPinia());
  });

  it('should generate copywriter', async () => {
    const { generateCopywriter } = await import('../composables/useCopywriter');
    const result = generateCopywriter();
    expect(result).toBeDefined();
  });
});
