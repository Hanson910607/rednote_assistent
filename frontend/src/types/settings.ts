export interface XiaohongshuSettings {
  appKey: string;
  appSecret: string;
  baseUrl: string;
}

export type LlmProvider = 'openai' | 'deepseek' | 'claude' | 'anthropic' | 'gemini' | 'zhipuai' | 'siliconflow' | 'tongyi' | 'baichuan' | 'moonshot' | 'qwen' | 'custom';

export interface LlmSettings {
  provider: LlmProvider;
  apiKey: string;
  apiUrl: string;
  model: string;
}

export const LLM_PROVIDERS: Record<LlmProvider, { name: string; apiUrl: string; models: string[] }> = {
  openai: {
    name: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-3.5', 'gpt-4o', 'gpt-4o-mini'],
  },
  deepseek: {
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
  claude: {
    name: 'Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022'],
  },
  anthropic: {
    name: 'Anthropic',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022'],
  },
  gemini: {
    name: 'Gemini',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  zhipuai: {
    name: '智谱AI',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    models: ['glm-4', 'glm-4-flash', 'glm-4-air', 'glm-3-turbo'],
  },
  siliconflow: {
    name: '硅基流动',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    models: ['deepseek-ai/DeepSeek-V3', 'Qwen/Qwen2.5-7B-Instruct', 'internlm/internlm2_5-20b-chat'],
  },
  tongyi: {
    name: '通义千问',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-longcontext'],
  },
  baichuan: {
    name: '百川智能',
    apiUrl: 'https://api.baichuan-ai.com/v1/chat/completions',
    models: ['Baichuan2-Turbo', 'Baichuan2-53B', 'Baichuan-13B-Chat'],
  },
  moonshot: {
    name: 'Moonshot AI',
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  },
  qwen: {
    name: 'Qwen',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-longcontext'],
  },
  custom: {
    name: '自定义',
    apiUrl: '',
    models: [],
  },
};

export interface UiSettings {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

export interface Settings {
  xiaohongshu: XiaohongshuSettings;
  llm: LlmSettings;
  ui: UiSettings;
}
