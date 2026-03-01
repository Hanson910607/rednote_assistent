import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getStorage, setStorage } from '../utils/storage';
import type { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  xiaohongshu: {
    appKey: '',
    appSecret: '',
    baseUrl: 'https://api.xiaohongshu.com',
  },
  llm: {
    provider: 'deepseek',
    apiKey: '',
    apiUrl: '',
    model: '',
  },
  ui: {
    theme: 'light',
    language: 'zh',
  },
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>(getStorage<Settings>('settings', DEFAULT_SETTINGS));

  const updateSettings = (newSettings: Partial<Settings>): void => {
    settings.value = { ...settings.value, ...newSettings };
    setStorage('settings', settings.value);
  };

  const updateXiaohongshuSettings = (newSettings: Partial<Settings['xiaohongshu']>): void => {
    settings.value.xiaohongshu = { ...settings.value.xiaohongshu, ...newSettings };
    setStorage('settings', settings.value);
  };

  const updateLlmSettings = (newSettings: Partial<Settings['llm']>): void => {
    settings.value.llm = { ...settings.value.llm, ...newSettings };
    setStorage('settings', settings.value);
  };

  const updateUiSettings = (newSettings: Partial<Settings['ui']>): void => {
    settings.value.ui = { ...settings.value.ui, ...newSettings };
    setStorage('settings', settings.value);
  };

  const resetSettings = (): void => {
    settings.value = { ...DEFAULT_SETTINGS };
    setStorage('settings', settings.value);
  };

  const hasXiaohongshuConfig = computed(() => {
    return !!(settings.value.xiaohongshu.appKey && settings.value.xiaohongshu.appSecret);
  });

  const hasLlmConfig = computed(() => {
    return !!settings.value.llm.apiKey;
  });

  const isDarkTheme = computed(() => {
    return settings.value.ui.theme === 'dark';
  });

  return {
    settings,
    updateSettings,
    updateXiaohongshuSettings,
    updateLlmSettings,
    updateUiSettings,
    resetSettings,
    hasXiaohongshuConfig,
    hasLlmConfig,
    isDarkTheme,
  };
});
