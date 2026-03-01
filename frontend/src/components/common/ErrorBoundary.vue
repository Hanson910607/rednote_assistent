<template>
  <div class="error-boundary">
    <slot v-if="!error" />
    <div v-else class="error-content">
      <el-result
        icon="error"
        :title="errorTitle"
        :sub-title="errorMessage"
      >
        <template #extra>
          <el-button type="primary" @click="goHome">
            返回首页
          </el-button>
          <el-button @click="reload">
            刷新页面
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const error = ref<Error | null>(null);

const errorTitle = ref('发生错误');
const errorMessage = ref('应用遇到了一些问题，请稍后重试');

onErrorCaptured((err: Error) => {
  console.error('Error caught by ErrorBoundary:', err);
  error.value = err;
  
  if (err.message) {
    errorMessage.value = err.message;
  }
  
  if (err.name) {
    errorTitle.value = `${err.name} 错误`;
  }
});

const goHome = () => {
  error.value = null;
  router.push('/');
};

const reload = () => {
  error.value = null;
  window.location.reload();
};

provide('errorBoundary', {
  clearError: () => {
    error.value = null;
  }
});
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
}

.error-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}
</style>
