<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getDevice, updateDevice } from '@/api/devices';
import { latestData, queryData } from '@/api/data';
import type { Device, DataRecord } from '@/types';

const route = useRoute();
const id = route.params.id as string;

const device = ref<Device | null>(null);
const latest = ref<DataRecord | null>(null);
const records = ref<DataRecord[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const d = await getDevice(id);
    device.value = d.data;
    const l = await latestData(device.value!.deviceId);
    latest.value = l.data;
    const r = await queryData(device.value!.deviceId);
    records.value = r.data ?? [];
  } finally {
    loading.value = false;
  }
}

async function toggleStatus() {
  if (!device.value?.id) return;
  const next = device.value.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
  await updateDevice(device.value.id, { status: next });
  ElMessage.success('已更新');
  load();
}

onMounted(load);
</script>

<template>
  <div class="detail" v-loading="loading">
    <el-page-header @back="$router.push('/devices')" title="返回" />
    <el-card v-if="device" class="block">
      <template #header>设备信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备ID">{{ device.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ device.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="节点ID">{{ device.nodeId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="标识类型">{{ device.identifierType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="device.status === 'ONLINE' ? 'success' : 'info'">{{ device.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后在线">{{ device.lastSeen || '-' }}</el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" @click="toggleStatus" style="margin-top: 12px">
        切换为 {{ device.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' }}
      </el-button>
    </el-card>

    <el-card class="block">
      <template #header>最新数据</template>
      <pre v-if="latest">{{ JSON.stringify(latest, null, 2) }}</pre>
      <el-empty v-else description="暂无数据" />
    </el-card>

    <el-card class="block">
      <template #header>历史数据</template>
      <el-table :data="records" border max-height="360">
        <el-table-column prop="serviceType" label="服务类型" />
        <el-table-column prop="serviceVersion" label="版本" />
        <el-table-column prop="serviceData" label="业务数据(base64)" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.detail {
  padding: 8px;
}
.block {
  margin-top: 12px;
}
</style>
