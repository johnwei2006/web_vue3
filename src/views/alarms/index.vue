<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { listAlarms, resolveAlarm } from '@/api/alarms';
import type { Alarm } from '@/types';

const loading = ref(false);
const alarms = ref<Alarm[]>([]);
const statusFilter = ref<string>('');

async function load() {
  loading.value = true;
  try {
    const res = await listAlarms(statusFilter.value || undefined);
    alarms.value = res.data ?? [];
  } finally {
    loading.value = false;
  }
}

async function resolve(row: Alarm) {
  await resolveAlarm(row.id as string);
  ElMessage.success('已处理');
  load();
}

const levelType: Record<string, string> = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'danger',
};

onMounted(load);
</script>

<template>
  <div class="alarms">
    <div class="toolbar">
      <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 160px" @change="load">
        <el-option label="未处理" value="OPEN" />
        <el-option label="已处理" value="RESOLVED" />
      </el-select>
      <el-button @click="load">刷新</el-button>
    </div>
    <el-table :data="alarms" v-loading="loading" border>
      <el-table-column prop="deviceId" label="设备ID" />
      <el-table-column prop="rule" label="规则" />
      <el-table-column prop="level" label="级别">
        <template #default="{ row }">
          <el-tag :type="(levelType[row.level] as any) || 'info'">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="信息" show-overflow-tooltip />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'OPEN' ? 'danger' : 'success'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            :disabled="row.status === 'RESOLVED'"
            @click="resolve(row)"
          >
            处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}
</style>
