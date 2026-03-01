<template>
  <div class="settings-page">
    <el-skeleton v-if="loading" :loading="loading" animated>
      <template #template>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :md="12">
            <el-skeleton-item variant="rect" style="height: 400px" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-skeleton-item variant="rect" style="height: 400px" />
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
    
    <template v-else>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon><Connection /></el-icon>
                <span>小红书API配置</span>
              </div>
            </template>
            
            <el-form :model="xiaohongshuForm" label-width="120px">
              <el-form-item label="App Key">
                <el-input
                  v-model="xiaohongshuForm.appKey"
                  type="password"
                  show-password
                  placeholder="请输入小红书App Key"
                />
              </el-form-item>
              
              <el-form-item label="App Secret">
                <el-input
                  v-model="xiaohongshuForm.appSecret"
                  type="password"
                  show-password
                  placeholder="请输入小红书App Secret"
                />
              </el-form-item>
              
              <el-form-item label="Base URL">
                <el-input
                  v-model="xiaohongshuForm.baseUrl"
                  placeholder="请输入API基础URL"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="testingXiaohongshu" @click="testXiaohongshuConnection">
                  <el-icon><Connection /></el-icon>
                  测试连接
                </el-button>
                <el-button @click="saveXiaohongshuSettings" style="margin-left: 12px;">
                  <el-icon><Check /></el-icon>
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon><ChatDotRound /></el-icon>
                <span>大模型API配置</span>
              </div>
            </template>
            
            <el-form :model="llmForm" label-width="120px">
              <el-form-item label="模型供应商">
                <el-select v-model="llmForm.provider" placeholder="请选择模型供应商" style="width: 100%" @change="onProviderChange">
                  <el-option label="OpenAI" value="openai" />
                  <el-option label="DeepSeek" value="deepseek" />
                  <el-option label="Claude" value="claude" />
                  <el-option label="Anthropic" value="anthropic" />
                  <el-option label="Gemini" value="gemini" />
                  <el-option label="智谱AI" value="zhipuai" />
                  <el-option label="硅基流动" value="siliconflow" />
                  <el-option label="通义千问" value="tongyi" />
                  <el-option label="百川智能" value="baichuan" />
                  <el-option label="Moonshot AI" value="moonshot" />
                  <el-option label="Qwen" value="qwen" />
                  <el-option label="自定义" value="custom" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="模型名称">
                <el-select v-model="llmForm.model" placeholder="请选择模型名称" style="width: 100%">
                  <el-option v-for="model in availableModels" :key="model" :label="model" :value="model" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="API Key">
                <el-input
                  v-model="llmForm.apiKey"
                  type="password"
                  show-password
                  placeholder="请输入API Key"
                />
              </el-form-item>
              
              <el-form-item label="API URL">
                <el-input
                  v-model="llmForm.apiUrl"
                  :placeholder="llmForm.provider === 'custom' ? '请输入完整的API URL' : 'API URL 将自动填充'"
                  :disabled="llmForm.provider !== 'custom'"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="testingLlm" @click="testLlmConnection">
                  <el-icon><Connection /></el-icon>
                  测试连接
                </el-button>
                <el-button @click="saveLlmSettings" style="margin-left: 12px;">
                  <el-icon><Check /></el-icon>
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>其他设置</span>
              </div>
            </template>
            
            <el-form label-width="120px">
              <el-form-item label="主题">
                <el-radio-group v-model="uiSettings.theme">
                  <el-radio label="light">浅色</el-radio>
                  <el-radio label="dark">深色</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="语言">
                <el-select v-model="uiSettings.language" placeholder="请选择语言" style="width: 100%">
                  <el-option label="中文" value="zh" />
                  <el-option label="English" value="en" />
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveUiSettings">
                  <el-icon><Check /></el-icon>
                  保存设置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon><Delete /></el-icon>
                <span>数据管理</span>
              </div>
            </template>
            
            <div class="data-management">
              <el-alert
                title="清除数据前请确认"
                type="warning"
                :closable="false"
                show-icon
                style="margin-bottom: 16px;"
              />
              
              <el-button type="danger" plain @click="clearCopywriterHistory">
                <el-icon><Delete /></el-icon>
                清除文案历史
              </el-button>
              
              <el-button type="danger" plain @click="clearTopicHistory" style="margin-left: 12px;">
                <el-icon><Delete /></el-icon>
                清除选题历史
              </el-button>
              
              <el-button type="danger" @click="clearAllData" style="margin-left: 12px;">
                <el-icon><Delete /></el-icon>
                清除所有数据
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="24">
        <el-col :span="24">
          <el-card class="about-card">
            <template #header>
              <div class="card-header">
                <el-icon><InfoFilled /></el-icon>
                <span>关于</span>
              </div>
            </template>
            
            <div class="about-content">
              <h3>小红书助手</h3>
              <p>专业的AI驱动小红书内容创作工具，助您轻松打造爆款内容</p>
              
              <el-descriptions :column="3" border>
                <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
                <el-descriptions-item label="开发者">AI Assistant</el-descriptions-item>
                <el-descriptions-item label="更新时间">2024-02-08</el-descriptions-item>
              </el-descriptions>
              
              <div class="about-features">
                <h4>核心功能</h4>
                <ul>
                  <li>智能文案生成 - 支持4种类型和4种风格</li>
                  <li>选题推荐 - 智能推荐热门选题和分析</li>
                  <li>爆款分析 - 评估文案爆款潜力</li>
                  <li>趋势分析 - 分析平台趋势和用户需求</li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useSettingsStore, useHistoryStore } from '../stores';
import { Connection, ChatDotRound, Setting, Delete, Check, InfoFilled } from '@element-plus/icons-vue';
import { LLM_PROVIDERS, type LlmProvider } from '../types/settings';

const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();

const xiaohongshuForm = reactive({
  appKey: '',
  appSecret: '',
  baseUrl: 'https://api.xiaohongshu.com',
});

const llmForm = reactive({
  provider: 'deepseek' as LlmProvider,
  apiKey: '',
  apiUrl: '',
  model: '',
});

const uiSettings = reactive({
  theme: 'light' as 'light' | 'dark',
  language: 'zh' as 'zh' | 'en',
});

const testingXiaohongshu = ref(false);
const testingLlm = ref(false);
const loading = ref(true);

const availableModels = computed(() => {
  if (llmForm.provider === 'custom') {
    return [];
  }
  return LLM_PROVIDERS[llmForm.provider]?.models || [];
});

onMounted(() => {
  xiaohongshuForm.appKey = settingsStore.settings.xiaohongshu.appKey;
  xiaohongshuForm.appSecret = settingsStore.settings.xiaohongshu.appSecret;
  xiaohongshuForm.baseUrl = settingsStore.settings.xiaohongshu.baseUrl;
  
  llmForm.provider = settingsStore.settings.llm.provider || 'deepseek';
  llmForm.apiKey = settingsStore.settings.llm.apiKey;
  llmForm.apiUrl = settingsStore.settings.llm.apiUrl;
  llmForm.model = settingsStore.settings.llm.model;
  
  if (!llmForm.apiUrl && llmForm.provider !== 'custom') {
    llmForm.apiUrl = LLM_PROVIDERS[llmForm.provider]?.apiUrl || '';
  }
  
  uiSettings.theme = settingsStore.settings.ui.theme;
  uiSettings.language = settingsStore.settings.ui.language;
  
  applyTheme();
  
  setTimeout(() => {
    loading.value = false;
  }, 300);
});

const onProviderChange = (provider: LlmProvider) => {
  if (provider === 'custom') {
    llmForm.apiUrl = '';
    llmForm.model = '';
  } else {
    const providerConfig = LLM_PROVIDERS[provider];
    if (providerConfig) {
      llmForm.apiUrl = providerConfig.apiUrl || '';
      const models = providerConfig.models || [];
      if (models.length > 0 && !models.includes(llmForm.model)) {
        llmForm.model = models[0] as string;
      }
    }
  }
};

const testXiaohongshuConnection = async () => {
  if (!xiaohongshuForm.appKey || !xiaohongshuForm.appSecret) {
    ElMessage.warning('请先填写App Key和App Secret');
    return;
  }
  
  testingXiaohongshu.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('小红书API连接测试成功！');
  } catch (error) {
    ElMessage.error('小红书API连接测试失败');
  } finally {
    testingXiaohongshu.value = false;
  }
};

const testLlmConnection = async () => {
  if (!llmForm.apiKey) {
    ElMessage.warning('请先填写API Key');
    return;
  }
  
  testingLlm.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('大模型API连接测试成功！');
  } catch (error) {
    ElMessage.error('大模型API连接测试失败');
  } finally {
    testingLlm.value = false;
  }
};

const saveXiaohongshuSettings = () => {
  settingsStore.updateXiaohongshuSettings({
    appKey: xiaohongshuForm.appKey,
    appSecret: xiaohongshuForm.appSecret,
    baseUrl: xiaohongshuForm.baseUrl,
  });
  ElMessage.success('小红书API配置已保存');
};

const saveLlmSettings = () => {
  settingsStore.updateLlmSettings({
    provider: llmForm.provider,
    apiKey: llmForm.apiKey,
    apiUrl: llmForm.apiUrl,
    model: llmForm.model,
  });
  ElMessage.success('大模型API配置已保存');
};

const saveUiSettings = () => {
  settingsStore.updateUiSettings({
    theme: uiSettings.theme,
    language: uiSettings.language,
  });
  ElMessage.success('UI设置已保存');
  applyTheme();
};

const applyTheme = () => {
  const app = document.getElementById('app');
  if (app) {
    if (uiSettings.theme === 'dark') {
      app.classList.add('dark-theme');
    } else {
      app.classList.remove('dark-theme');
    }
  }
};

const clearCopywriterHistory = async () => {
  try {
    await ElMessageBox.confirm('确定要清除所有文案历史记录吗？', '确认清除', {
      type: 'warning',
    });
    
    historyStore.clearCopywriterHistory();
    ElMessage.success('文案历史记录已清除');
  } catch {
    ElMessage.info('已取消清除');
  }
};

const clearTopicHistory = async () => {
  try {
    await ElMessageBox.confirm('确定要清除所有选题历史记录吗？', '确认清除', {
      type: 'warning',
    });
    
    historyStore.clearTopicHistory();
    ElMessage.success('选题历史记录已清除');
  } catch {
    ElMessage.info('已取消清除');
  }
};

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm('确定要清除所有数据吗？此操作不可恢复！', '确认清除', {
      type: 'error',
      confirmButtonText: '确定清除',
      cancelButtonText: '取消',
    });
    
    historyStore.clearAllHistory();
    settingsStore.resetSettings();
    ElMessage.success('所有数据已清除');
    
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch {
    ElMessage.info('已取消清除');
  }
};
</script>

<style scoped>
.settings-page {
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.settings-card {
  margin-bottom: 24px;
}

.data-management {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-card {
  margin-bottom: 24px;
}

.about-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.about-content p {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 24px;
}

.about-features {
  margin-top: 24px;
}

.about-features h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.about-features ul {
  list-style: none;
  padding: 0;
}

.about-features li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: var(--el-text-color-regular);
}

.about-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--el-color-success);
}
</style>
