import request from './request';
import type { ApiResponse, LoginResult } from '@/types';

/** 登录，返回 LoginResult（含 token） */
export function login(data: {
  username: string;
  password: string;
}): Promise<ApiResponse<LoginResult>> {
  return request<LoginResult>({ url: '/api/auth/login', method: 'POST', data });
}
