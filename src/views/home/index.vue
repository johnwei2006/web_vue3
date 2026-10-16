<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { listDevices } from '@/api/devices';
import { listAlarms } from '@/api/alarms';
import { Monitor, Warning, Connection } from '@element-plus/icons-vue';

const userStore = useUserStore();
const router = useRouter();

const deviceCount = ref(0);
const onlineCount = ref(0);
const alarmOpen = ref(0);

onMounted(async () => {
  try {
    const d = await listDevices();
    deviceCount.value = d.data?.length ?? 0;
    onlineCount.value = (d.data ?? []).filter((x) => x.status === 'ONLINE').length;
  } catch {
    /* 忽略 */
  }
  try {
    const a = await listAlarms('OPEN');
    alarmOpen.value = a.data?.length ?? 0;
  } catch {
    /* 忽略 */
  }
});

const cards = [
  { label: '设备总数', value: deviceCount, icon: Monitor, color: '#409eff' },
  { label: '在线设备', value: onlineCount, icon: Connection, color: '#67c23a' },
  { label: '未处理告警', value: alarmOpen, icon: Warning, color: '#e6a23c' },
];
</script>

<template>
  <div class="home">
    <h2>欢迎使用，{{ userStore.userInfo?.name || '用户' }}</h2>
    <el-row :gutter="16" class="stats">
      <el-col v-for="c in cards" :key="c.label" :span="8">
        <el-card shadow="hover" @click="router.push('/devices')">
          <div class="stat">
            <el-icon :size="36" :color="c.color"><component :is="c.icon" /></el-icon>
            <div>
              <div class="stat-value">{{ c.value }}</div>
              <div class="stat-label">{{ c.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home {
  padding: 8px;
}
.stats {
  margin-top: 16px;
}
.stat {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
}
.stat-label {
  color: #909399;
  font-size: 13px;
}
</style>
