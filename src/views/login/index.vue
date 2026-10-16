<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import type { LoginPayload, RememberedCredentials } from '@/types';
import { storage } from '@/utils/storage';
import Captcha from '@/components/Captcha.vue';

interface LoginForm extends LoginPayload {
  captcha: string;
  remember: boolean;
}

const REMEMBER_KEY = 'rememberedCredentials';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const captchaRef = ref<InstanceType<typeof Captcha>>();
const loading = ref(false);
const form = reactive<LoginForm>({
  username: '',
  password: '',
  captcha: '',
  remember: false,
});

const rules: FormRules<LoginForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value && captchaRef.value && !captchaRef.value.validate(value)) {
          callback(new Error('验证码不正确'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// 记住密码：密码做轻量 base64 混淆（非加密，生产环境需加密或改用后端会话）
function encodePassword(p: string): string {
  return btoa(encodeURIComponent(p));
}
function decodePassword(s: string): string {
  try {
    return decodeURIComponent(atob(s));
  } catch {
    return '';
  }
}

function applyRemembered(): void {
  const remembered = storage.get<RememberedCredentials>(REMEMBER_KEY);
  if (remembered) {
    form.username = remembered.username;
    form.password = decodePassword(remembered.password);
    form.remember = true;
  }
}

onMounted(applyRemembered);

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await userStore.login(form);
      await userStore.fetchUserInfo();

      if (form.remember) {
        storage.set(REMEMBER_KEY, {
          username: form.username,
          password: encodePassword(form.password),
        });
      } else {
        storage.remove(REMEMBER_KEY);
      }

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
          <span class="login-title">欢迎登录</span>
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
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-row">
            <el-input v-model="form.captcha" placeholder="请输入验证码" maxlength="4" />
            <Captcha ref="captchaRef" class="captcha-item" />
          </div>
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false" class="forget-link">忘记密码？</el-link>
        </div>
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.login-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 50px rgba(31, 45, 61, 0.18);
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
.captcha-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}
.captcha-row .el-input {
  flex: 1;
}
.captcha-item {
  flex-shrink: 0;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 18px;
}
.login-options :deep(.el-checkbox__label) {
  color: #606266;
}
.forget-link {
  font-size: 13px;
}
.login-btn {
  width: 100%;
  letter-spacing: 4px;
  border-radius: 8px;
  transition: filter 0.2s ease, transform 0.1s ease;
}
.login-btn:hover {
  filter: brightness(1.05);
}
.login-btn:active {
  transform: scale(0.99);
}
</style>
