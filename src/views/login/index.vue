<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import type { LoginPayload } from '@/types';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive<LoginPayload>({
  username: '',
  password: '',
});

const rules: FormRules<LoginPayload> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await userStore.login(form);
      ElMessage.success('登录成功');
      const redirect = (route.query.redirect as string) || '/home';
      router.push(redirect);
    } finally {
      loading.value = false;
    }
  });
};
</script>

<template>
  <div class="login">
    <el-card class="login-card" shadow="always">
      <template #header>
        <div class="login-header">
          <span class="login-title">IoT 平台管理控制台</span>
          <span class="login-subtitle">请登录以继续</span>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" size="large">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleSubmit">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2f7 0%, #dce8fb 100%);
}
.login-card {
  width: 420px;
  border-radius: 14px;
  border: none;
  box-shadow: 0 12px 40px rgba(31, 45, 61, 0.12);
}
.login-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.login-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
.login-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
}
.login-btn {
  width: 100%;
  letter-spacing: 4px;
  border-radius: 8px;
}
</style>
