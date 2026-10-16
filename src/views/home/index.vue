<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();
const count = ref(0);
</script>

<template>
  <el-card>
    <template #header>欢迎使用 Vue3 Starter</template>
    <el-space direction="vertical" :size="16">
      <el-text>当前用户：{{ userStore.userInfo?.name || '未登录' }}</el-text>
      <el-button type="primary" @click="count++">点击次数：{{ count }}</el-button>
    </el-space>
  </el-card>
</template>
