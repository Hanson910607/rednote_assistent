<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <div class="logo-icon">
          <span class="logo-icon-text">📕</span>
        </div>
        <div class="logo-content">
          <span class="logo-text">小红书助手</span>
          <span class="logo-subtitle">AI驱动的内容创作工具</span>
        </div>
      </div>
    </div>
    
    <div class="header-right">
      <el-button text @click="toggleTheme" class="theme-toggle">
        <el-icon>
          <Sunny v-if="!isDark" />
          <Moon v-else />
        </el-icon>
      </el-button>
      
      <el-dropdown trigger="click" class="user-dropdown">
        <el-button text class="user-button">
          <el-icon><User /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/history')">
              <el-icon><Clock /></el-icon>
              历史记录
            </el-dropdown-item>
            <el-dropdown-item @click="router.push('/settings')">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleAbout">
              <el-icon><InfoFilled /></el-icon>
              关于
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useSettingsStore } from '../../stores';
import { ElMessage } from 'element-plus';
import { Notebook, Sunny, Moon, User, Setting, InfoFilled, Clock } from '@element-plus/icons-vue';

const router = useRouter();
const settingsStore = useSettingsStore();

const isDark = computed(() => settingsStore.isDarkTheme);

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  settingsStore.updateUiSettings({ theme: newTheme });
  
  const app = document.getElementById('app');
  if (app) {
    if (newTheme === 'dark') {
      app.classList.add('dark-theme');
    } else {
      app.classList.remove('dark-theme');
    }
  }
  
  ElMessage.success(`已切换到${newTheme === 'light' ? '浅色' : '深色'}主题`);
};

const handleAbout = () => {
  ElMessage.info('小红书助手 v1.0.0');
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.3s;
  z-index: 1;
  position: relative;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff2442;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
  transition: all 0.3s;
  flex-shrink: 0;
  z-index: 1;
  position: relative;
  border: 3px solid #ff2442;
}

.logo-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 36, 66, 0.4);
  background: #ff364d;
  border-color: #ff364d;
}

.logo-icon :deep(.el-icon) {
  font-size: 32px;
  color: white;
}

.logo-icon-text {
  font-size: 32px;
  line-height: 1;
}

.logo-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #ff2442;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background: var(--el-fill-color-light);
  transform: scale(1.05);
}

.user-button {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s;
}

.user-button:hover {
  background: var(--el-fill-color-light);
  transform: scale(1.05);
}

.user-dropdown :deep(.el-dropdown-menu) {
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--el-border-color-light);
}

.user-dropdown :deep(.el-dropdown-menu__item) {
  padding: 10px 16px;
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s;
}

.user-dropdown :deep(.el-dropdown-menu__item:hover) {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: white;
}

.user-dropdown :deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
}
</style>
