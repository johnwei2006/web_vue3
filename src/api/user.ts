import request from './request';
import type { ApiResponse, LoginPayload, UserInfo } from '@/types';

/** 登录，返回 token 字符串 */
export function login(data: LoginPayload): Promise<ApiResponse<string>> {
  return request<string>({ url: '/user/login', method: 'POST', data });
}

/** 获取当前用户信息 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return request<UserInfo>({ url: '/user/info', method: 'GET' });
}
