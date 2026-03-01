<template>
  <div v-loading="loading" class="loading-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<style scoped>
.loading-container {
  min-height: 200px;
}
</style>
