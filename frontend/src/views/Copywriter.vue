<template>
  <div class="copywriter-page">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <el-icon><Edit /></el-icon>
              <span>文案生成</span>
            </div>
          </template>
          
          <el-form :model="form" label-width="100px">
            <el-form-item label="文案类型">
              <el-select v-model="form.type" placeholder="请选择文案类型" style="width: 100%" clearable>
                <el-option label="生活分享/Vlog" value="life" />
                <el-option label="穿搭/美妆" value="fashion" />
                <el-option label="知识科普/教程" value="knowledge" />
                <el-option label="产品种草/测评" value="product" />
                <el-option label="情感故事/分享" value="emotional" />
                <el-option label="职场成长/经验" value="career" />
                <el-option label="娱乐休闲/搞笑" value="entertainment" />
                <el-option label="宠物日记" value="pet" />
                <el-option label="母婴育儿" value="parenting" />
                <el-option label="运动健身" value="fitness" />
                <el-option label="情感治愈" value="healing" />
                <el-option label="平替测评" value="dupe" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="文案风格">
              <el-select v-model="form.style" placeholder="请选择文案风格" style="width: 100%" clearable>
                <el-option label="简洁明了风" value="simple" />
                <el-option label="专业干货风" value="professional" />
                <el-option label="情感共鸣风" value="emotional" />
                <el-option label="活泼可爱风" value="cute" />
                <el-option label="高端奢华风" value="luxury" />
                <el-option label="接地气风" value="grounded" />
                <el-option label="幽默搞笑风" value="humorous" />
                <el-option label="闺蜜聊天风" value="bestie" />
                <el-option label="种草专用风" value="zhongcao" />
                <el-option label="反常识反转风" value="anti-common" />
                <el-option label="沉浸体验风" value="immersive" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="主题">
              <el-input
                v-model="form.topic"
                type="textarea"
                :rows="4"
                placeholder="请输入文案主题或核心内容"
              />
            </el-form-item>
            
            <el-form-item label="特殊要求">
              <el-input
                v-model="form.requirements"
                type="textarea"
                :rows="3"
                placeholder="可选：字数限制、重点突出等特殊要求"
              />
            </el-form-item>
            
            <el-alert
              title="合规提示"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            >
              <template #default>
                <div class="compliance-tips">
                  <p><strong>真诚分享原则：</strong>请分享真实体验和感受，不夸大宣传</p>
                  <p><strong>避免虚假宣传：</strong>不使用"绝了"、"yyds"、"太香了"等绝对化用语</p>
                  <p><strong>避免医疗内容：</strong>不涉及医美、药品、保健品等医疗相关内容</p>
                  <p><strong>遵守社区公约：</strong>尊重不同观点，不制造对立，对自己发布的内容负责</p>
                  <p><strong>添加真实性提示：</strong>建议添加"个人体验"、"仅供参考"等提示</p>
                </div>
              </template>
            </el-alert>
            
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleGenerate"
                style="width: 100%"
              >
                <el-icon v-if="!loading"><MagicStick /></el-icon>
                {{ loading ? '生成中...' : '生成文案' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="16">
        <el-card v-if="result && result.data" class="result-card">
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              <span>生成结果</span>
              <div class="header-actions">
                <el-button text @click="handleCopy">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
                <el-button text @click="handleExport">
                  <el-icon><Download /></el-icon>
                  导出
                </el-button>
              </div>
            </div>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="标题选项" name="titles">
              <div class="titles-section">
                <div
                  v-for="(title, index) in result.data.titles"
                  :key="title"
                  class="title-item"
                >
                  <span class="title-index">{{ index + 1 }}.</span>
                  <span class="title-text">{{ title }}</span>
                  <el-button
                    text
                    size="small"
                    @click="copyText(title)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="正文内容" name="content">
              <el-input
                v-model="result.data.content"
                type="textarea"
                :rows="12"
                placeholder="正文内容"
              />
            </el-tab-pane>
            
            <el-tab-pane label="Emoji建议" name="emojis">
              <div class="emojis-section">
                <div class="emoji-list">
                  <span
                    v-for="emoji in result.data.emojis"
                    :key="emoji"
                    class="emoji-item"
                  >
                    {{ emoji }}
                  </span>
                </div>
                <el-button
                  text
                  @click="copyText(result.data.emojis.join(''))"
                >
                  <el-icon><CopyDocument /></el-icon>
                  复制全部
                </el-button>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="标签推荐" name="hashtags">
              <div class="hashtags-section">
                <div class="hashtag-list">
                  <el-tag
                    v-for="tag in result.data.hashtags"
                    :key="tag"
                    class="hashtag-item"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <el-button
                  text
                  @click="copyText(result.data.hashtags.join(' '))"
                >
                  <el-icon><CopyDocument /></el-icon>
                  复制全部
                </el-button>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="爆款分析" name="analysis">
              <div class="analysis-section">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <div class="analysis-card">
                      <div class="analysis-label">爆款潜力等级</div>
                      <div :class="['analysis-level', `level-${result.data.analysis.level}`]">
                        {{ result.data.analysis.level }}级
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="analysis-card">
                      <div class="analysis-label">综合得分</div>
                      <div class="analysis-score">
                        {{ result.data.analysis.score }}分
                      </div>
                    </div>
                  </el-col>
                </el-row>
                
                <el-divider />
                
                <div class="analysis-detail">
                  <h4>优势</h4>
                  <ul>
                    <li v-for="item in result.data.analysis.advantages" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  
                  <h4>不足</h4>
                  <ul>
                    <li v-for="item in result.data.analysis.disadvantages" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  
                  <h4>优化建议</h4>
                  <ul>
                    <li v-for="item in result.data.analysis.suggestions" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        
        <el-empty v-else description="请填写左侧表单并生成文案" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useCopywriter } from '../composables';
import { getStorage, setStorage } from '../utils/storage';
import type { CopywriterType, CopywriterStyle, Topic } from '../types';
import { Edit, Document, MagicStick, CopyDocument, Download } from '@element-plus/icons-vue';

const { loading, result, generateCopywriter } = useCopywriter();

// 从 localStorage 恢复表单数据
const savedForm = getStorage<any>('copywriter_form', null);

const form = reactive<{
  type: CopywriterType;
  style: CopywriterStyle;
  topic: string;
  requirements: string;
}>({
  type: savedForm?.type || 'life',
  style: savedForm?.style || 'simple',
  topic: savedForm?.topic || '',
  requirements: savedForm?.requirements || '',
});

const activeTab = ref('titles');
const selectedTopic = ref<Topic | null>(null);

// 监听表单数据变化，自动保存到 localStorage
watch([() => form.type, () => form.style, () => form.topic, () => form.requirements], () => {
  setStorage('copywriter_form', {
    type: form.type,
    style: form.style,
    topic: form.topic,
    requirements: form.requirements,
  });
}, { deep: true });

onMounted(() => {
  const topic = getStorage<any>('selected_topic', null);
  if (topic) {
    selectedTopic.value = topic;
    form.topic = topic.name;
    
    const domain = topic.domain || 'beauty';
    const direction = topic.direction || 'practical';
    
    const domainToType: Record<string, CopywriterType> = {
      'beauty': 'fashion',
      'food': 'life',
      'travel': 'life',
      'knowledge': 'knowledge',
      'career': 'career',
      'entertainment': 'entertainment',
      'health': 'life',
      'home': 'life',
      'digital': 'knowledge',
      'pet': 'pet',
      'parenting': 'parenting',
      'fitness': 'fitness',
      'healing': 'healing',
    };
    
    const directionToStyle: Record<string, CopywriterStyle> = {
      'practical': 'simple',
      'emotional': 'emotional',
      'product': 'simple',
      'tutorial': 'professional',
      'review': 'professional',
      'sharing': 'simple',
      'story': 'emotional',
      'anti-rat-race': 'emotional',
      'healing': 'emotional',
      'dupe-review': 'simple',
      'side-hustle': 'professional',
      'celebrity': 'emotional',
      'immersive': 'emotional',
    };
    
    form.type = domainToType[domain] || 'life';
    form.style = directionToStyle[direction] || 'simple';
    form.requirements = `选题类型：${topic.type}\n热度等级：${topic.level}级\n描述：${topic.description}\n用户需求度：${topic.evaluation.userDemand}%\n竞争激烈度：${topic.evaluation.competition}%\n创新可能性：${topic.evaluation.innovation}%\n自身匹配度：${topic.evaluation.selfMatch}%`;
    ElMessage.info('已自动填充从选题推荐页面选择的选题');
  }
});

const handleGenerate = async () => {
  if (!form.topic.trim()) {
    ElMessage.warning('请输入文案主题');
    return;
  }
  
  result.value = null;
  await generateCopywriter(form);
  if (result.value) {
    activeTab.value = 'titles';
  }
};

const handleCopy = () => {
  if (!result.value || !result.value.data) return;
  
  const text = `
标题选项：
${result.value.data.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

正文内容：
${result.value.data.content}

Emoji建议：
${result.value.data.emojis.join('')}

标签推荐：
${result.value.data.hashtags.join(' ')}
  `.trim();
  
  copyText(text);
};

const handleExport = () => {
  if (!result.value || !result.value.data) return;
  
  const text = `
标题选项：
${result.value.data.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

正文内容：
${result.value.data.content}

Emoji建议：
${result.value.data.emojis.join('')}

标签推荐：
${result.value.data.hashtags.join(' ')}
  `.trim();
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `小红书文案_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('导出成功');
};

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功');
  }).catch(() => {
    ElMessage.error('复制失败');
  });
};
</script>

<style scoped>
.copywriter-page {
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.result-card {
  min-height: 500px;
}

.titles-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.title-index {
  font-weight: 600;
  color: var(--el-color-primary);
}

.title-text {
  flex: 1;
}

.emojis-section,
.hashtags-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.emoji-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.emoji-item {
  font-size: 24px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  cursor: pointer;
}

.emoji-item:hover {
  background: var(--el-fill-color);
}

.hashtag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtag-item {
  cursor: pointer;
}

.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analysis-card {
  padding: 20px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  text-align: center;
}

.analysis-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

.analysis-level {
  font-size: 32px;
  font-weight: 700;
}

.analysis-level.level-S {
  color: #f56c6c;
}

.analysis-level.level-A {
  color: #e6a23c;
}

.analysis-level.level-B {
  color: #409eff;
}

.analysis-level.level-C {
  color: #67c23a;
}

.analysis-level.level-D {
  color: #909399;
}

.analysis-score {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.analysis-detail h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.analysis-detail ul {
  list-style: none;
  padding: 0;
}

.analysis-detail li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: var(--el-text-color-regular);
}

.analysis-detail li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--el-color-primary);
}
</style>
