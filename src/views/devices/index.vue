<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listDevices, createDevice, updateDevice, deleteDevice, sendDownlink } from '@/api/devices';
import type { Device, DownlinkPayload } from '@/types';

const router = useRouter();
const loading = ref(false);
const devices = ref<Device[]>([]);

const dialogVisible = ref(false);
const editing = ref<Device | null>(null);
const form = reactive<Partial<Device>>({
  deviceId: '',
  name: '',
  nodeId: '',
  identifierType: 'DEVICEID',
  status: 'OFFLINE',
});

const downlinkVisible = ref(false);
const downlinkTarget = ref<Device | null>(null);
const downlinkForm = reactive<DownlinkPayload>({
  serviceType: 1,
  serviceVersion: 1,
  serviceData: '',
  serviceDataEncoding: 0,
  serviceDataProtocolVersion: 1,
  serviceEncryption: 0,
});

async function load() {
  loading.value = true;
  try {
    const res = await listDevices();
    devices.value = res.data ?? [];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = null;
  Object.assign(form, {
    deviceId: '',
    name: '',
    nodeId: '',
    identifierType: 'DEVICEID',
    status: 'OFFLINE',
  });
  dialogVisible.value = true;
}

function openEdit(row: Device) {
  editing.value = row;
  Object.assign(form, row);
  dialogVisible.value = true;
}

async function submit() {
  if (!form.deviceId) {
    ElMessage.warning('请填写 deviceId');
    return;
  }
  if (editing.value?.id) {
    await updateDevice(editing.value.id, form);
    ElMessage.success('已更新');
  } else {
    await createDevice(form);
    ElMessage.success('已创建');
  }
  dialogVisible.value = false;
  load();
}

async function remove(row: Device) {
  await ElMessageBox.confirm(`确认删除设备 ${row.deviceId}？`, '提示', { type: 'warning' });
  await deleteDevice(row.id as string);
  ElMessage.success('已删除');
  load();
}

function openDownlink(row: Device) {
  downlinkTarget.value = row;
  downlinkVisible.value = true;
}

async function submitDownlink() {
  if (!downlinkTarget.value?.id) return;
  await sendDownlink(downlinkTarget.value.id, downlinkForm);
  ElMessage.success('指令已下发');
  downlinkVisible.value = false;
}

onMounted(load);
</script>

<template>
  <div class="devices">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新增设备</el-button>
    </div>
    <el-table :data="devices" v-loading="loading" border>
      <el-table-column prop="deviceId" label="设备ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="nodeId" label="节点ID" />
      <el-table-column prop="identifierType" label="标识类型" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ONLINE' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后在线" prop="lastSeen" />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="router.push(`/devices/${row.id}`)">详情</el-button>
          <el-button size="small" type="warning" @click="openDownlink(row)">下发</el-button>
          <el-button size="small" type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑设备' : '新增设备'" width="480px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="设备ID">
          <el-input v-model="form.deviceId" :disabled="!!editing" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="节点ID">
          <el-input v-model="form.nodeId" />
        </el-form-item>
        <el-form-item label="标识类型">
          <el-select v-model="form.identifierType" style="width: 100%">
            <el-option label="DEVICEID" value="DEVICEID" />
            <el-option label="VIN" value="VIN" />
            <el-option label="TERMINALNO" value="TERMINALNO" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="ONLINE" value="ONLINE" />
            <el-option label="OFFLINE" value="OFFLINE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="downlinkVisible" title="下发指令" width="480px">
      <el-form :model="downlinkForm" label-width="120px">
        <el-form-item label="服务类型">
          <el-input-number v-model="downlinkForm.serviceType" :min="0" />
        </el-form-item>
        <el-form-item label="服务版本">
          <el-input-number v-model="downlinkForm.serviceVersion" :min="0" />
        </el-form-item>
        <el-form-item label="业务数据(base64)">
          <el-input v-model="downlinkForm.serviceData" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="编码">
          <el-input-number v-model="downlinkForm.serviceDataEncoding" :min="0" :max="2" />
        </el-form-item>
        <el-form-item label="协议版本">
          <el-input-number v-model="downlinkForm.serviceDataProtocolVersion" :min="0" />
        </el-form-item>
        <el-form-item label="加密">
          <el-input-number v-model="downlinkForm.serviceEncryption" :min="0" :max="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="downlinkVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDownlink">下发</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}
</style>
