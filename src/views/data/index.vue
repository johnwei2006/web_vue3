<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { queryData } from '@/api/data';
import type { DataRecord } from '@/types';

const deviceId = ref('');
const records = ref<DataRecord[]>([]);
const loading = ref(false);

async function search() {
  if (!deviceId.value) {
    ElMessage.warning('请输入设备ID');
    return;
  }
  loading.value = true;
  try {
    const res = await queryData(deviceId.value);
    records.value = res.data ?? [];
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="data">
    <el-card>
      <template #header>数据查询</template>
      <el-form inline>
        <el-form-item label="设备ID">
          <el-input v-model="deviceId" placeholder="请输入 deviceId" style="width: 260px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="block">
      <el-table :data="records" v-loading="loading" border max-height="520">
        <el-table-column prop="deviceId" label="设备ID" />
        <el-table-column prop="serviceType" label="服务类型" />
        <el-table-column prop="serviceVersion" label="版本" />
        <el-table-column prop="serviceData" label="业务数据(base64)" show-overflow-tooltip />
        <el-table-column prop="eventId" label="事件ID" />
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.data {
  padding: 8px;
}
.block {
  margin-top: 12px;
}
</style>
