import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getStorage, setStorage } from '../utils/storage';
import type { CopywriterHistoryItem, TopicHistoryItem } from '../types';

export const useHistoryStore = defineStore('history', () => {
  const copywriterHistory = ref<CopywriterHistoryItem[]>([]);
  const topicHistory = ref<TopicHistoryItem[]>([]);

  const loadCopywriterHistory = (): void => {
    copywriterHistory.value = getStorage<CopywriterHistoryItem[]>('copywriter_history', []);
  };

  const loadTopicHistory = (): void => {
    topicHistory.value = getStorage<TopicHistoryItem[]>('topic_history', []);
  };

  const saveCopywriterHistoryItem = (item: CopywriterHistoryItem): void => {
    copywriterHistory.value.unshift(item);
    setStorage('copywriter_history', copywriterHistory.value);
  };

  const saveTopicHistoryItem = (item: TopicHistoryItem): void => {
    topicHistory.value.unshift(item);
    setStorage('topic_history', topicHistory.value);
  };

  const deleteCopywriterHistoryItem = (id: string): void => {
    copywriterHistory.value = copywriterHistory.value.filter(item => item.id !== id);
    setStorage('copywriter_history', copywriterHistory.value);
  };

  const deleteTopicHistoryItem = (id: string): void => {
    topicHistory.value = topicHistory.value.filter(item => item.id !== id);
    setStorage('topic_history', topicHistory.value);
  };

  const clearCopywriterHistory = (): void => {
    copywriterHistory.value = [];
    localStorage.removeItem('xiaohongshu_copywriter_history');
  };

  const clearTopicHistory = (): void => {
    topicHistory.value = [];
    localStorage.removeItem('xiaohongshu_topic_history');
  };

  const clearAllHistory = (): void => {
    clearCopywriterHistory();
    clearTopicHistory();
  };

  return {
    copywriterHistory,
    topicHistory,
    loadCopywriterHistory,
    loadTopicHistory,
    saveCopywriterHistoryItem,
    saveTopicHistoryItem,
    deleteCopywriterHistoryItem,
    deleteTopicHistoryItem,
    clearCopywriterHistory,
    clearTopicHistory,
    clearAllHistory,
  };
});
