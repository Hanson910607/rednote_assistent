<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <ErrorBoundary>
      <Header />
      <div class="main-container">
        <Sidebar />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSettingsStore } from './stores';
import Header from './components/common/Header.vue';
import Sidebar from './components/common/Sidebar.vue';
import ErrorBoundary from './components/common/ErrorBoundary.vue';

const settingsStore = useSettingsStore();
const isDarkTheme = computed(() => settingsStore.isDarkTheme);

onMounted(() => {
  document.documentElement.setAttribute('data-theme', settingsStore.settings.ui.theme);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark-theme {
  --el-bg-color: #1a1a1a;
  --el-bg-color-page: #141414;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-border-color: #363637;
  --el-border-color-light: #4c4d4f;
  --el-border-color-lighter: #414243;
  --el-border-color-extra-light: #4c4d4f;
  --el-border-color-dark: #414243;
  --el-border-color-darker: #363637;
  --el-fill-color-light: #2c2c2c;
  --el-fill-color: #1f1f1f;
  --el-fill-color-blank: #141414;
  --el-fill-color-lighter: #262727;
  --el-fill-color-extra-light: #2b2b2c;
  --el-mask-color: rgba(0, 0, 0, 0.8);
  --el-overlay-color-light: rgba(0, 0, 0, 0.7);
  --el-overlay-color-lighter: rgba(0, 0, 0, 0.5);
  --el-overlay-color-extra-light: rgba(0, 0, 0, 0.3);
  --el-disabled-bg-color: #262727;
  --el-disabled-text-color: #8c8d8f;
  --el-disabled-border-color: #4c4d4f;
  --el-box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.36), 0 8px 20px rgba(0, 0, 0, 0.2);
  --el-box-shadow-light: 0 12px 32px 4px rgba(0, 0, 0, 0.24), 0 8px 20px rgba(0, 0, 0, 0.12);
  --el-box-shadow-lighter: 0 12px 32px 4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05);
  --el-box-shadow-dark: 0 12px 32px 4px rgba(0, 0, 0, 0.48), 0 8px 20px rgba(0, 0, 0, 0.24);
}

.main-container {
  min-height: calc(100vh - 64px);
  margin-left: 240px;
  transition: margin-left 0.3s;
  background: var(--el-bg-color-page);
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
}

.main-content {
  min-height: calc(100vh - 64px);
  overflow-y: auto;
  background: var(--el-bg-color-page);
  padding: 24px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}
</style>
