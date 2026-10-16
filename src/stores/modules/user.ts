import { defineStore } from 'pinia';
import { login as loginApi } from '@/api/user';
import type { LoginPayload, LoginResult, UserInfo } from '@/types';
import { storage } from '@/utils/storage';

interface UserState {
  token: string;
  userInfo: UserInfo | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: storage.get<string>('token') || '',
    userInfo: null,
  }),
  getters: {
    isLogin: (state) => !!state.token,
    roles: (state) => state.userInfo?.roles ?? [],
  },
  actions: {
    async login(payload: LoginPayload) {
      const res = await loginApi(payload);
      const data: LoginResult = res.data;
      this.token = data.token;
      this.userInfo = { name: data.username, roles: [data.role] };
      storage.set('token', data.token);
      return data.token;
    },
    logout() {
      this.token = '';
      this.userInfo = null;
      storage.remove('token');
    },
  },
});
