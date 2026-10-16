import { defineStore } from 'pinia';
import { login as loginApi, getUserInfo } from '@/api/user';
import type { LoginPayload, UserInfo } from '@/types';
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
      this.token = res.data;
      storage.set('token', this.token);
      return res.data;
    },
    async fetchUserInfo() {
      const res = await getUserInfo();
      this.userInfo = res.data;
      return res.data;
    },
    logout() {
      this.token = '';
      this.userInfo = null;
      storage.remove('token');
    },
  },
});
