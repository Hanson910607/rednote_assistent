<template>
  <div class="topic-selector-page">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <el-icon><TrendCharts /></el-icon>
              <span>选题推荐</span>
            </div>
          </template>
          
          <el-form label-width="100px">
            <el-form-item label="内容领域">
              <el-select v-model="domain" placeholder="请选择内容领域" style="width: 100%" clearable>
                <el-option label="美妆时尚" value="beauty" />
                <el-option label="美食生活" value="food" />
                <el-option label="旅行户外" value="travel" />
                <el-option label="知识科普" value="knowledge" />
                <el-option label="职场成长" value="career" />
                <el-option label="娱乐休闲" value="entertainment" />
                <el-option label="健康养生" value="health" />
                <el-option label="家居生活" value="home" />
                <el-option label="数码科技" value="digital" />
                <el-option label="宠物日记" value="pet" />
                <el-option label="母婴育儿" value="parenting" />
                <el-option label="运动健身" value="fitness" />
                <el-option label="情感治愈" value="healing" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="目标受众">
              <el-row :gutter="8">
                <el-col :span="24">
                  <el-select v-model="age" placeholder="年龄" style="width: 100%" clearable>
                    <el-option label="18-25岁" value="18-25" />
                    <el-option label="26-35岁" value="26-35" />
                    <el-option label="36-45岁" value="36-45" />
                    <el-option label="45岁以上" value="45+" />
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="gender" placeholder="性别" style="width: 100%" clearable>
                    <el-option label="女" value="female" />
                    <el-option label="男" value="male" />
                    <el-option label="不限" value="all" />
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="region" placeholder="地域" style="width: 100%" clearable>
                    <el-option label="一线城市" value="tier1" />
                    <el-option label="二线城市" value="tier2" />
                    <el-option label="三四线城市" value="tier3" />
                    <el-option label="不限" value="all" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            
            <el-form-item label="创作方向">
              <el-select v-model="direction" placeholder="请选择创作方向" style="width: 100%" clearable>
                <el-option label="实用干货" value="practical" />
                <el-option label="情感分享" value="emotional" />
                <el-option label="产品推荐" value="product" />
                <el-option label="教程教学" value="tutorial" />
                <el-option label="测评体验" value="review" />
                <el-option label="经验分享" value="sharing" />
                <el-option label="故事叙述" value="story" />
                <el-option label="反内卷生活" value="anti-rat-race" />
                <el-option label="治愈日常" value="healing" />
                <el-option label="平替测评" value="dupe-review" />
                <el-option label="副业变现" value="side-hustle" />
                <el-option label="明星热点" value="celebrity" />
                <el-option label="沉浸体验" value="immersive" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="特殊要求">
              <el-input
                v-model="requirements"
                type="textarea"
                :rows="3"
                placeholder="可选：季节性、节日性、时效性等特殊要求"
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
                {{ loading ? '生成中...' : '生成选题' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="16">
        <el-card v-if="result && result.data" class="result-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>推荐结果</span>
              <div class="header-actions">
                <el-button text @click="handleExport">
                  <el-icon><Download /></el-icon>
                  导出
                </el-button>
              </div>
            </div>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="选题列表" name="topics">
              <div class="topics-section">
                <div class="filter-bar">
                  <el-select v-model="filterType" placeholder="筛选类型" style="width: 150px; margin-right: 12px;">
                    <el-option label="全部" value="" />
                    <el-option label="热点" value="hot" />
                    <el-option label="季节" value="seasonal" />
                    <el-option label="经典" value="classic" />
                    <el-option label="潜力" value="potential" />
                  </el-select>
                  
                  <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px;">
                    <el-option label="热度" value="level" />
                    <el-option label="评分" value="score" />
                  </el-select>
                </div>
                
                <div class="topic-list">
                  <el-card
                    v-for="(topic, index) in filteredTopics"
                    :key="topic.name + topic.type"
                    class="topic-card"
                    shadow="hover"
                  >
                    <div class="topic-header">
                      <h4>{{ topic.name }}</h4>
                      <el-tag :type="getTopicTypeTag(topic.type)" size="small">
                        {{ getTopicTypeLabel(topic.type) }}
                      </el-tag>
                      <el-tag :type="getTopicLevelTag(topic.level)" size="small">
                        {{ topic.level }}级
                      </el-tag>
                    </div>
                    <p class="topic-description">{{ topic.description }}</p>
                    <div class="topic-evaluation">
                      <div class="evaluation-item">
                        <span class="label">用户需求度</span>
                        <el-progress :percentage="topic.evaluation.userDemand" :stroke-width="6" />
                      </div>
                      <div class="evaluation-item">
                        <span class="label">竞争激烈度</span>
                        <el-progress :percentage="topic.evaluation.competition" :stroke-width="6" />
                      </div>
                      <div class="evaluation-item">
                        <span class="label">创新可能性</span>
                        <el-progress :percentage="topic.evaluation.innovation" :stroke-width="6" />
                      </div>
                      <div class="evaluation-item">
                        <span class="label">自身匹配度</span>
                        <el-progress :percentage="topic.evaluation.selfMatch" :stroke-width="6" />
                      </div>
                      <div class="total-score">
                        <span class="label">综合得分</span>
                        <span class="score">{{ topic.evaluation.total }}分</span>
                      </div>
                    </div>
                    <div class="topic-actions">
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleGenerateCopywriter(topic)"
                      >
                        <el-icon><Edit /></el-icon>
                        生成文案
                      </el-button>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="趋势分析" name="trends">
              <div class="trends-section">
                <el-collapse v-model="activeTrends">
                  <el-collapse-item title="当前热门趋势" name="current">
                    <ul class="trend-list">
                      <li v-for="trend in result.data.trendAnalysis.currentTrends" :key="trend">
                        {{ trend }}
                      </li>
                    </ul>
                  </el-collapse-item>
                  
                  <el-collapse-item title="跨平台趋势" name="crossPlatform">
                    <ul class="trend-list">
                      <li v-for="trend in result.data.trendAnalysis.crossPlatformTrends" :key="trend">
                        {{ trend }}
                      </li>
                    </ul>
                  </el-collapse-item>
                  
                  <el-collapse-item title="时效性因素" name="seasonal">
                    <ul class="trend-list">
                      <li v-for="factor in result.data.trendAnalysis.seasonalFactors" :key="factor">
                        {{ factor }}
                      </li>
                    </ul>
                  </el-collapse-item>
                  
                  <el-collapse-item title="用户需求" name="userNeeds">
                    <ul class="trend-list">
                      <li v-for="need in result.data.trendAnalysis.userNeeds" :key="need">
                        {{ need }}
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        
        <el-empty v-else description="请填写左侧表单并生成选题" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useTopicSelector } from '../composables';
import { setStorage, getStorage } from '../utils/storage';
import type { TopicDomain, TopicAudience, TopicDirection, Topic } from '../types';
import { TrendCharts, DataLine, MagicStick, Download, Edit } from '@element-plus/icons-vue';

const router = useRouter();
const { loading, result, generateTopics } = useTopicSelector();

// 从 localStorage 恢复表单数据
const savedForm = getStorage<any>('topic_selector_form', null);

const domain = ref<TopicDomain>(savedForm?.domain || 'beauty');
const age = ref<string>(savedForm?.audience?.age || '18-25');
const gender = ref<string>(savedForm?.audience?.gender || 'female');
const region = ref<string>(savedForm?.audience?.region || 'tier1');
const direction = ref<TopicDirection>(savedForm?.direction || 'practical');
const requirements = ref<string>(savedForm?.requirements || '');

const form = computed(() => ({
  domain: domain.value,
  audience: {
    age: age.value,
    gender: gender.value,
    region: region.value,
  },
  direction: direction.value,
  requirements: requirements.value,
}));

// 监听表单数据变化，自动保存到 localStorage
watch([domain, age, gender, region, direction, requirements], () => {
  setStorage('topic_selector_form', form.value);
}, { deep: true });

const activeTab = ref('topics');
const filterType = ref('');
const sortBy = ref('level');
const activeTrends = ref(['current']);

const filteredTopics = computed(() => {
  if (!result.value || !result.value.data) return [];
  const topics = result.value!.data.topics.slice();
  
  if (filterType.value) {
    topics.sort((a, b) => {
      const typeMatchA = a.type === filterType.value;
      const typeMatchB = b.type === filterType.value;
      if (typeMatchA && !typeMatchB) return -1;
      if (!typeMatchA && typeMatchB) return 1;
      return 0;
    });
  }
  
  if (sortBy.value === 'level') {
    const levelOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
    topics.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  } else if (sortBy.value === 'score') {
    topics.sort((a, b) => b.evaluation.total - a.evaluation.total);
  }
  
  return topics;
});

const handleGenerate = async () => {
  if (!domain.value) {
    ElMessage.warning('请选择内容领域');
    return;
  }
  if (!age.value) {
    ElMessage.warning('请选择年龄');
    return;
  }
  if (!gender.value) {
    ElMessage.warning('请选择性别');
    return;
  }
  if (!region.value) {
    ElMessage.warning('请选择地域');
    return;
  }
  if (!direction.value) {
    ElMessage.warning('请选择创作方向');
    return;
  }
  
  result.value = null;
  await generateTopics(form.value);
  if (result.value) {
    activeTab.value = 'topics';
  }
};

const handleGenerateCopywriter = (topic: Topic) => {
  const topicWithMetadata = {
    ...topic,
    domain: domain.value,
    direction: direction.value,
  };
  setStorage('selected_topic', topicWithMetadata);
  ElMessage.success('已选择选题，即将跳转到文案生成页面');
  setTimeout(() => {
    router.push('/copywriter');
  }, 500);
};

const handleExport = () => {
  if (!result.value) return;
  
  const text = `
选题推荐结果

选题列表：
${filteredTopics.value.map((topic, i) => `
${i + 1}. ${topic.name}
   类型：${getTopicTypeLabel(topic.type)}
   热度：${topic.level}级
   描述：${topic.description}
   用户需求度：${topic.evaluation.userDemand}%
   竞争激烈度：${topic.evaluation.competition}%
   创新可能性：${topic.evaluation.innovation}%
   自身匹配度：${topic.evaluation.selfMatch}%
   综合得分：${topic.evaluation.total}分
`).join('\n')}

趋势分析：
${result.value.data?.trendAnalysis ? `当前热门趋势：
${result.value.data.trendAnalysis.currentTrends.map(t => `- ${t}`).join('\n')}

跨平台趋势：
${result.value.data.trendAnalysis.crossPlatformTrends.map(t => `- ${t}`).join('\n')}

时效性因素：
${result.value.data.trendAnalysis.seasonalFactors.map(f => `- ${f}`).join('\n')}

用户需求：
${result.value.data.trendAnalysis.userNeeds.map(n => `- ${n}`).join('\n')}` : '暂无趋势分析'}
  `.trim();
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `小红书选题_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('导出成功');
};

const getTopicTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    hot: '热点',
    seasonal: '季节',
    classic: '经典',
    potential: '潜力',
    trend: '趋势',
    niche: '小众',
    sharing: '分享',
    pet: '宠物',
    parenting: '母婴',
    fitness: '运动',
    healing: '治愈',
    life: '生活',
    fashion: '美妆',
    knowledge: '知识',
    product: '产品',
    emotional: '情感',
    career: '职场',
    entertainment: '娱乐',
    dupe: '平替',
  };
  return labels[type] || type;
};

const getTopicTypeTag = (type: string): 'success' | 'info' | 'primary' | 'warning' | 'danger' => {
  const tags: Record<string, 'success' | 'info' | 'primary' | 'warning' | 'danger'> = {
    hot: 'danger',
    seasonal: 'warning',
    classic: 'info',
    potential: 'success',
    trend: 'danger',
    niche: 'info',
    sharing: 'success',
    pet: 'success',
    parenting: 'info',
    fitness: 'warning',
    healing: 'primary',
    life: 'info',
    fashion: 'success',
    knowledge: 'primary',
    product: 'warning',
    emotional: 'danger',
    career: 'info',
    entertainment: 'success',
    dupe: 'warning',
  };
  return tags[type] || 'info';
};

const getTopicLevelTag = (level: string): 'success' | 'info' | 'primary' | 'warning' | 'danger' => {
  const tags: Record<string, 'success' | 'info' | 'primary' | 'warning' | 'danger'> = {
    S: 'danger',
    A: 'warning',
    B: 'primary',
    C: 'success',
    D: 'info',
  };
  return tags[level] || 'info';
};
</script>

<style scoped>
.topic-selector-page {
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

.topics-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.topic-card:hover {
  transform: translateY(-2px);
}

.topic-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.topic-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.topic-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.topic-evaluation {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evaluation-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evaluation-item .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.total-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}

.total-score .label {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

.total-score .score {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.topic-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color);
}

.trends-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trend-list li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: var(--el-text-color-regular);
}

.trend-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--el-color-primary);
}

.form-card :deep(.el-select) {
  min-width: 100%;
}

.form-card :deep(.el-select .el-input__wrapper) {
  min-width: 100%;
}

.form-card :deep(.el-select .el-input__inner) {
  min-height: 32px;
}
</style>
