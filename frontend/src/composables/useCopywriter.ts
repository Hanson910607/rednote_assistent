import { ref } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../utils/api';
import { getStorage, setStorage } from '../utils/storage';
import type { CopywriterRequest, CopywriterResponse, CopywriterHistoryItem } from '../types';

export function useCopywriter() {
  const loading: Ref<boolean> = ref(false);
  const result: Ref<CopywriterResponse | null> = ref(null);
  const error: Ref<string | null> = ref(null);

  const generateCopywriter = async (request: CopywriterRequest): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.copywriter.generate(request);
      
      if (response.success) {
        result.value = response;
        ElMessage.success('文案生成成功！');
        
        const historyItem: CopywriterHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: request.type,
          style: request.style,
          topic: request.topic,
          result: response.data!,
        };
        
        saveToHistory(historyItem);
      } else {
        result.value = null;
        ElMessage.error(response.error || '文案生成失败');
        error.value = response.error || '文案生成失败';
      }
    } catch (err: any) {
      console.error('Generate copywriter error:', err);
      const errorMessage = err.response?.data?.message || err.message || '网络错误，请重试';
      ElMessage.error(errorMessage);
      error.value = errorMessage;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  const saveToHistory = (item: CopywriterHistoryItem): void => {
    const history = getHistory();
    history.unshift(item);
    setStorage('copywriter_history', history);
  };

  const getHistory = (): CopywriterHistoryItem[] => {
    return getStorage<CopywriterHistoryItem[]>('copywriter_history', []);
  };

  const clearHistory = (): void => {
    localStorage.removeItem('xiaohongshu_copywriter_history');
  };

  const deleteHistoryItem = (id: string): void => {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    setStorage('copywriter_history', filtered);
  };

  return {
    loading,
    result,
    error,
    generateCopywriter,
    getHistory,
    clearHistory,
    deleteHistoryItem,
  };
}
