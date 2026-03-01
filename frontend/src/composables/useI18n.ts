import { ref, computed } from 'vue';
import { messages, type Language, type MessageKey } from '../locales';

const currentLanguage = ref<Language>('zh');

const currentMessages = computed(() => messages[currentLanguage.value]);

const t = (key: MessageKey, params?: Record<string, string | number>): string => {
  const message = currentMessages.value[key] as any;
  if (!message) {
    return key;
  }
  
  if (params) {
    return message.replace(/\{(\w+)\}/g, (_: string, match: string) => {
      return String(params[match] ?? '');
    });
  }
  
  return message;
};

const setLanguage = (lang: Language) => {
  currentLanguage.value = lang;
  localStorage.setItem('xiaohongshu_language', lang);
};

const initLanguage = () => {
  const savedLanguage = localStorage.getItem('xiaohongshu_language') as Language | null;
  if (savedLanguage === 'zh' || savedLanguage === 'en') {
    currentLanguage.value = savedLanguage;
  }
};

export function useI18n() {
  return {
    currentLanguage,
    currentMessages,
    t,
    setLanguage,
    initLanguage,
  };
}
