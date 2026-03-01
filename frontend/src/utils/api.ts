import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { 
  CopywriterRequest, 
  CopywriterResponse,
  TopicSelectorRequest,
  TopicSelectorResponse
} from '../types';
import { mockApi } from './mockApi';
import { ElMessage } from 'element-plus';
import { getStorage } from './storage';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK === 'true';

const isLlmApiConfigured = (): boolean => {
  const settings = getStorage<any>('settings', {});
  return !!(settings.llm && settings.llm.apiKey);
};

const getLlmSettings = (): any => {
  const settings = getStorage<any>('settings', {});
  return settings.llm || {};
};

class ApiClient {
  private client: any;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 90000, // 90 秒，比后端的 60 秒更长
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('xiaohongshu_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        const llmSettings = getLlmSettings();
        if (llmSettings && llmSettings.apiKey) {
          config.headers['x-llm-settings'] = JSON.stringify(llmSettings);
        }
        
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              ElMessage.error('未授权，请重新登录');
              break;
            case 403:
              ElMessage.error('没有权限访问此资源');
              break;
            case 404:
              ElMessage.error('请求的资源不存在');
              break;
            case 500:
              ElMessage.error('服务器错误，请稍后重试');
              break;
            default:
              ElMessage.error((error.response.data as any)?.message || '请求失败');
          }
        } else if (error.request) {
          ElMessage.error('网络连接失败，请检查网络设置');
        } else {
          ElMessage.error('请求配置错误');
        }
        return Promise.reject(error);
      }
    );
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

const apiClient = new ApiClient();

export const api = {
  copywriter: {
    generate: (request: CopywriterRequest): Promise<CopywriterResponse> => {
      if (USE_MOCK || !isLlmApiConfigured()) {
        return mockApi.copywriter.generate(request);
      }
      return apiClient.post<CopywriterResponse>('/copywriter/generate', request);
    },
  },
  
  topicSelector: {
    generate: (request: TopicSelectorRequest): Promise<TopicSelectorResponse> => {
      if (USE_MOCK || !isLlmApiConfigured()) {
        return mockApi.topicSelector.generate(request);
      }
      return apiClient.post<TopicSelectorResponse>('/topic-selector/generate', request);
    },
  },
  
  settings: {
    saveXiaohongshu: (settings: any): Promise<{ success: boolean }> => {
      if (USE_MOCK) {
        return mockApi.settings.saveXiaohongshu(settings);
      }
      return apiClient.post<{ success: boolean }>('/settings/xiaohongshu', settings);
    },
    
    saveLlm: (settings: any): Promise<{ success: boolean }> => {
      if (USE_MOCK) {
        return mockApi.settings.saveLlm(settings);
      }
      return apiClient.post<{ success: boolean }>('/settings/llm', settings);
    },
    
    testXiaohongshu: (settings: any): Promise<{ success: boolean; message?: string }> => {
      if (USE_MOCK) {
        return mockApi.settings.testXiaohongshu(settings);
      }
      return apiClient.post<{ success: boolean; message?: string }>('/settings/test/xiaohongshu', settings);
    },
    
    testLlm: (settings: any): Promise<{ success: boolean; message?: string }> => {
      if (USE_MOCK) {
        return mockApi.settings.testLlm(settings);
      }
      return apiClient.post<{ success: boolean; message?: string }>('/settings/test/llm', settings);
    },
  },
};

export default apiClient;
