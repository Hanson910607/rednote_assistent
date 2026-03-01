<template>
  <aside class="app-sidebar" :class="{ 'is-collapse': isCollapse, 'mobile-open': isMobileOpen }">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      class="sidebar-menu"
      :key="menuKey"
      @select="handleMenuSelect"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>主页</template>
      </el-menu-item>
      
      <el-menu-item index="/topic-selector">
        <el-icon><TrendCharts /></el-icon>
        <template #title>选题推荐</template>
      </el-menu-item>
      
      <el-menu-item index="/copywriter">
        <el-icon><Edit /></el-icon>
        <template #title>文案生成</template>
      </el-menu-item>
      
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>设置</template>
      </el-menu-item>
      
      <el-menu-item index="/history">
        <el-icon><Clock /></el-icon>
        <template #title>历史记录</template>
      </el-menu-item>
    </el-menu>
    
    <div class="sidebar-footer">
      <el-button
        :icon="isCollapse ? Expand : Fold"
        circle
        @click="toggleCollapse"
      />
    </div>
    
    <div v-if="isMobile" class="mobile-toggle" @click="toggleMobileMenu">
      <el-icon><Menu /></el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HomeFilled, Edit, TrendCharts, Setting, Expand, Fold, Clock, Menu } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const isCollapse = ref(false);
const isMobileOpen = ref(false);
const menuKey = ref(0);

const activeMenu = computed(() => route.path);

watch(() => route.path, () => {
  menuKey.value++;
  nextTick(() => {
    const menu = document.querySelector('.sidebar-menu');
    if (menu) {
      menu.scrollTop = 0;
    }
  });
});

const handleMenuSelect = async (index: string) => {
  await nextTick();
  await nextTick();
  window.location.href = index;
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
});
</script>

<style>
.app-sidebar {
  width: 240px;
  height: 100vh;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s, box-shadow 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .app-sidebar {
    left: -240px;
    box-shadow: none;
  }
  
  .app-sidebar.mobile-open {
    left: 0;
    box-shadow: 2px 0 24px rgba(0, 0, 0, 0.15);
  }
}

.app-sidebar:not(.is-collapse) {
  width: 240px;
}

.app-sidebar.is-collapse {
  width: 64px;
}

.sidebar-menu {
  flex: 1;
  border: none;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-menu :deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 10px;
  height: 48px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: white;
  transform: translateX(4px);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  margin-right: 12px;
  font-size: 20px;
  color: inherit;
}

.sidebar-footer {
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);
}

@media (max-width: 768px) {
  .sidebar-footer {
    padding: 12px;
  }
}

.sidebar-footer :deep(.el-button) {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s;
}

.sidebar-footer :deep(.el-button:hover) {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: white;
  transform: rotate(180deg);
}

.mobile-toggle {
  position: fixed;
  left: 240px;
  top: 60px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  cursor: pointer;
  z-index: 999;
  transition: left 0.3s, transform 0.3s;
  box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
}

.mobile-toggle:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 16px rgba(255, 36, 66, 0.4);
}

.mobile-toggle :deep(.el-icon) {
  color: white;
  font-size: 20px;
}

@media (max-width: 768px) {
  .mobile-toggle {
    left: 0;
    top: 72px;
  }
}
</style>
