<template>
  <div class="home-page">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎使用小红书助手</span>
            </div>
          </template>
          <div class="welcome-content">
            <p>专业的AI驱动小红书内容创作工具，助您轻松打造爆款内容</p>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value">4</div>
                <div class="stat-label">文案类型</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">4</div>
                <div class="stat-label">文案风格</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">4</div>
                <div class="stat-label">内容领域</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">AI</div>
                <div class="stat-label">智能推荐</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="feature-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="feature-card" shadow="hover" @click="router.push('/topic-selector')">
          <div class="feature-icon">
            <el-icon :size="48" color="#ff2442">
              <TrendCharts />
            </el-icon>
          </div>
          <h3>选题推荐</h3>
          <p>智能推荐热门选题，分析趋势和竞品</p>
          <el-button type="primary" link>立即使用 →</el-button>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="feature-card" shadow="hover" @click="router.push('/copywriter')">
          <div class="feature-icon">
            <el-icon :size="48" color="#ff2442">
              <Edit />
            </el-icon>
          </div>
          <h3>文案生成</h3>
          <p>智能生成爆款文案，支持多种类型和风格</p>
          <el-button type="primary" link>立即使用 →</el-button>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="feature-card" shadow="hover" @click="router.push('/settings')">
          <div class="feature-icon">
            <el-icon :size="48" color="#ff2442">
              <Setting />
            </el-icon>
          </div>
          <h3>API配置</h3>
          <p>配置小红书和大模型API，解锁全部功能</p>
          <el-button type="primary" link>立即配置 →</el-button>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="feature-card" shadow="hover" @click="showHistory">
          <div class="feature-icon">
            <el-icon :size="48" color="#ff2442">
              <Clock />
            </el-icon>
          </div>
          <h3>历史记录</h3>
          <p>查看历史生成记录，快速复用内容</p>
          <el-button type="primary" link>查看记录 →</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="quick-start-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速开始</span>
            </div>
          </template>
          <div class="quick-start-content">
            <el-steps :active="currentStep" finish-status="success" align-center>
              <el-step title="配置API" description="在设置中配置API密钥" />
              <el-step title="选择功能" description="选择文案生成或选题推荐" />
              <el-step title="输入需求" description="输入您的创作需求" />
              <el-step title="生成内容" description="AI智能生成优质内容" />
            </el-steps>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Edit, TrendCharts, Setting, Clock } from '@element-plus/icons-vue';

const router = useRouter();
const currentStep = ref(0);

const showHistory = () => {
  router.push('/history');
};
</script>

<style scoped>
.home-page {
  padding: 24px;
}

.welcome-card {
  margin-bottom: 24px;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.welcome-content p {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin-bottom: 24px;
}

.stats {
  display: flex;
  justify-content: space-around;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.feature-row {
  margin-bottom: 24px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.feature-card p {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 16px;
  min-height: 40px;
}

.quick-start-row {
  margin-bottom: 24px;
}

.quick-start-content {
  padding: 24px 0;
}
</style>
