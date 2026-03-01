import { ref } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../utils/api';
import { getStorage, setStorage } from '../utils/storage';
import type { TopicSelectorRequest, TopicSelectorResponse, TopicHistoryItem } from '../types';

export function useTopicSelector() {
  const loading: Ref<boolean> = ref(false);
  const result: Ref<TopicSelectorResponse | null> = ref(null);
  const error: Ref<string | null> = ref(null);

  const generateTopics = async (request: TopicSelectorRequest): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.topicSelector.generate(request);
      
      if (response.success) {
        result.value = response;
        ElMessage.success('选题推荐成功！');
        
        const historyItem: TopicHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          domain: request.domain,
          audience: request.audience,
          direction: request.direction,
          result: response.data!,
        };
        
        saveToHistory(historyItem);
      } else {
        result.value = null;
        ElMessage.error(response.error || '选题推荐失败');
        error.value = response.error || '选题推荐失败';
      }
    } catch (err: any) {
      console.error('Generate topics error:', err);
      const errorMessage = err.response?.data?.message || err.message || '网络错误，请重试';
      ElMessage.error(errorMessage);
      error.value = errorMessage;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  const saveToHistory = (item: TopicHistoryItem): void => {
    const history = getHistory();
    history.unshift(item);
    setStorage('topic_history', history);
  };

  const getHistory = (): TopicHistoryItem[] => {
    return getStorage<TopicHistoryItem[]>('topic_history', []);
  };

  const clearHistory = (): void => {
    localStorage.removeItem('xiaohongshu_topic_history');
  };

  const deleteHistoryItem = (id: string): void => {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    setStorage('topic_history', filtered);
  };

  return {
    loading,
    result,
    error,
    generateTopics,
    getHistory,
    clearHistory,
    deleteHistoryItem,
  };
}
