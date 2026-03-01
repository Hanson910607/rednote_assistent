<template>
  <div class="history-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="文案历史" name="copywriter">
          <div v-if="copywriterHistory.length > 0" class="history-list">
            <el-card
              v-for="item in copywriterHistory"
              :key="item.id"
              class="history-item"
              shadow="hover"
            >
              <div class="history-header">
                <div class="history-info">
                  <h4>{{ item.topic }}</h4>
                  <div class="history-meta">
                    <el-tag size="small">{{ getTypeLabel(item.type) }}</el-tag>
                    <el-tag size="small" type="info">{{ getStyleLabel(item.style) }}</el-tag>
                    <span class="history-time">{{ formatTime(item.timestamp) }}</span>
                  </div>
                </div>
                <div class="history-actions">
                  <el-button type="primary" size="small" @click="viewCopywriterItem(item)">
                    查看
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteCopywriterItem(item.id)">
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-empty v-else description="暂无文案历史记录" />
        </el-tab-pane>
        
        <el-tab-pane label="选题历史" name="topic">
          <div v-if="topicHistory.length > 0" class="history-list">
            <el-card
              v-for="item in topicHistory"
              :key="item.id"
              class="history-item"
              shadow="hover"
            >
              <div class="history-header">
                <div class="history-info">
                  <h4>{{ getDomainLabel(item.domain) }}</h4>
                  <div class="history-meta">
                    <el-tag size="small">{{ getAudienceLabel(item.audience) }}</el-tag>
                    <el-tag size="small" type="info">{{ getDirectionLabel(item.direction) }}</el-tag>
                    <span class="history-time">{{ formatTime(item.timestamp) }}</span>
                  </div>
                </div>
                <div class="history-actions">
                  <el-button type="primary" size="small" @click="viewTopicItem(item)">
                    查看
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteTopicItem(item.id)">
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-empty v-else description="暂无选题历史记录" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="70%"
      :destroy-on-close="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="handleDialogClose"
    >
      <div v-if="dialogType === 'copywriter' && isCopywriterItem(selectedItem)" class="dialog-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="主题">{{ selectedItem.topic }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getTypeLabel(selectedItem.type) }}</el-descriptions-item>
          <el-descriptions-item label="风格">{{ getStyleLabel(selectedItem.style) }}</el-descriptions-item>
          <el-descriptions-item label="生成时间">{{ formatTime(selectedItem.timestamp) }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <h4>标题选项</h4>
        <ul class="result-list">
          <li v-for="(title, index) in selectedItem.result?.titles || []" :key="index">
            {{ index + 1 }}. {{ title }}
          </li>
        </ul>
        
        <h4>正文内容</h4>
        <el-input
          :model-value="selectedItem.result?.content || ''"
          type="textarea"
          :rows="8"
          readonly
        />
        
        <h4>标签推荐</h4>
        <div class="tag-list">
          <el-tag
            v-for="(tag, index) in selectedItem.result?.hashtags || []"
            :key="index"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div v-if="selectedItem.result?.compliance" class="compliance-info">
          <h4>合规性检查</h4>
          <el-alert
            :type="selectedItem.result.compliance.isCompliant ? 'success' : 'warning'"
            :closable="false"
            show-icon
          >
            <template #default>
              <div v-if="selectedItem.result.compliance.isCompliant">
                <p>✅ 内容符合小红书社区公约</p>
              </div>
              <div v-else>
                <p>⚠️ 内容存在合规性问题</p>
                <ul>
                  <li v-for="(warning, index) in selectedItem.result.compliance.warnings" :key="index">
                    {{ warning }}
                  </li>
                </ul>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
      
      <div v-else-if="dialogType === 'topic' && isTopicItem(selectedItem)" class="dialog-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="内容领域">{{ getDomainLabel(selectedItem.domain) }}</el-descriptions-item>
          <el-descriptions-item label="目标受众">{{ getAudienceLabel(selectedItem.audience) }}</el-descriptions-item>
          <el-descriptions-item label="创作方向">{{ getDirectionLabel(selectedItem.direction) }}</el-descriptions-item>
          <el-descriptions-item label="生成时间">{{ formatTime(selectedItem.timestamp) }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <h4>推荐选题</h4>
        <div class="topic-list">
          <el-card
            v-for="(topic, index) in selectedItem.result?.topics || []"
            :key="index"
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
              <span>综合得分：{{ topic.evaluation.total }}分</span>
            </div>
          </el-card>
        </div>
        
        <div v-if="selectedItem.result?.trendAnalysis" class="trend-analysis">
          <h4>趋势分析</h4>
          <el-collapse>
            <el-collapse-item title="当前热门趋势" name="current">
              <ul class="trend-list">
                <li v-for="trend in selectedItem.result.trendAnalysis.currentTrends" :key="trend">
                  {{ trend }}
                </li>
              </ul>
            </el-collapse-item>
            
            <el-collapse-item title="跨平台趋势" name="crossPlatform">
              <ul class="trend-list">
                <li v-for="trend in selectedItem.result.trendAnalysis.crossPlatformTrends" :key="trend">
                  {{ trend }}
                </li>
              </ul>
            </el-collapse-item>
            
            <el-collapse-item title="时效性因素" name="seasonal">
              <ul class="trend-list">
                <li v-for="factor in selectedItem.result.trendAnalysis.seasonalFactors" :key="factor">
                  {{ factor }}
                </li>
              </ul>
            </el-collapse-item>
            
            <el-collapse-item title="用户需求" name="userNeeds">
              <ul class="trend-list">
                <li v-for="need in selectedItem.result.trendAnalysis.userNeeds" :key="need">
                  {{ need }}
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useHistoryStore } from '../stores';
import { Clock } from '@element-plus/icons-vue';
import type { CopywriterHistoryItem, TopicHistoryItem } from '../types/all';
import dayjs from 'dayjs';

const router = useRouter();
const historyStore = useHistoryStore();
const activeTab = ref('copywriter');
const dialogVisible = ref(false);
const dialogType = ref<'copywriter' | 'topic'>('copywriter');
const selectedItem = ref<CopywriterHistoryItem | TopicHistoryItem | null>(null);

onMounted(() => {
  historyStore.loadCopywriterHistory();
  historyStore.loadTopicHistory();
});

const copywriterHistory = computed(() => historyStore.copywriterHistory);
const topicHistory = computed(() => historyStore.topicHistory);

const dialogTitle = computed(() => {
  return dialogType.value === 'copywriter' ? '文案详情' : '选题详情';
});

onMounted(() => {
  historyStore.loadCopywriterHistory();
  historyStore.loadTopicHistory();
});

const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    life: '生活分享',
    fashion: '穿搭美妆',
    knowledge: '知识科普',
    product: '产品种草',
  };
  return labels[type] || type;
};

const getStyleLabel = (style: string) => {
  const labels: Record<string, string> = {
    simple: '简洁明了',
    professional: '专业干货',
    emotional: '情感共鸣',
    cute: '活泼可爱',
  };
  return labels[style] || style;
};

const getDomainLabel = (domain: string) => {
  const labels: Record<string, string> = {
    beauty: '美妆时尚',
    food: '美食生活',
    travel: '旅行户外',
    knowledge: '知识科普',
  };
  return labels[domain] || domain;
};

const getAudienceLabel = (audience: any) => {
  const ageLabels: Record<string, string> = {
    '18-25': '18-25岁',
    '26-35': '26-35岁',
    '36-45': '36-45岁',
    '45+': '45岁以上',
  };
  const genderLabels: Record<string, string> = {
    female: '女性',
    male: '男性',
    all: '不限',
  };
  const regionLabels: Record<string, string> = {
    tier1: '一线城市',
    tier2: '二线城市',
    tier3: '三四线城市',
    all: '不限',
  };
  return `${ageLabels[audience.age] || audience.age} / ${genderLabels[audience.gender] || audience.gender} / ${regionLabels[audience.region] || audience.region}`;
};

const getDirectionLabel = (direction: string) => {
  const labels: Record<string, string> = {
    practical: '实用干货',
    emotional: '情感分享',
    product: '产品推荐',
  };
  return labels[direction] || direction;
};

const getTopicTypeLabel = (type: string) => {
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

const isCopywriterItem = (item: any): item is CopywriterHistoryItem => {
  return item && 'type' in item && 'style' in item;
};

const isTopicItem = (item: any): item is TopicHistoryItem => {
  return item && 'domain' in item && 'audience' in item;
};

const viewCopywriterItem = (item: CopywriterHistoryItem) => {
  dialogType.value = 'copywriter';
  selectedItem.value = item;
  dialogVisible.value = true;
};

const viewTopicItem = (item: TopicHistoryItem) => {
  dialogType.value = 'topic';
  selectedItem.value = item;
  dialogVisible.value = true;
};

const deleteCopywriterItem = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '确认删除', {
      type: 'warning',
    });
    
    historyStore.deleteCopywriterHistoryItem(id);
    historyStore.loadCopywriterHistory();
    ElMessage.success('删除成功');
  } catch {
    ElMessage.info('已取消删除');
  }
};

const deleteTopicItem = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '确认删除', {
      type: 'warning',
    });
    
    historyStore.deleteTopicHistoryItem(id);
    historyStore.loadTopicHistory();
    ElMessage.success('删除成功');
  } catch {
    ElMessage.info('已取消删除');
  }
};

const handleDialogClose = () => {
  dialogVisible.value = false;
  selectedItem.value = null;
  dialogType.value = 'copywriter';
};
</script>

<style scoped>
.history-page {
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  cursor: pointer;
  transition: transform 0.3s;
}

.history-item:hover {
  transform: translateY(-2px);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.history-actions {
  display: flex;
  gap: 8px;
}

.dialog-content {
  max-height: 600px;
  overflow-y: auto;
}

.dialog-content h4 {
  margin: 16px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-list li {
  padding: 8px 0;
  color: var(--el-text-color-regular);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-card {
  cursor: pointer;
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
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.topic-evaluation {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
