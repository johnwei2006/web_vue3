import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import type { ApiResponse } from '@/types';

/** Axios 实例：已配置 baseURL、超时与拦截器 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_APP_TIMEOUT) || 15000,
});

// 请求拦截器：统一附加鉴权头
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('app_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：解包 ApiResponse、统一错误提示
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    // 业务成功码：按后端约定调整（此处兼容 0 与 200）
    if (res.code !== 0 && res.code !== 200) {
      ElMessage.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    const status = error.response?.status;
    const messages: Record<number, string> = {
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求地址出错',
      500: '服务器内部错误',
    };
    const message = messages[status] ?? error.response?.data?.message ?? error.message;
    ElMessage.error(message);
    if (status === 401) {
      localStorage.removeItem('app_token');
    }
    return Promise.reject(error);
  },
);

/**
 * 通用请求方法。返回 Promise<ApiResponse<T>>，
 * 业务层通过 res.data 获取真实数据。
 */
export function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.request<unknown, ApiResponse<T>>(config);
}

/** 便捷方法：直接返回响应体中的 data 字段 */
export const http = {
  get<T = unknown>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ method: 'GET', url, params, ...config }).then((r) => r.data);
  },
  post<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ method: 'POST', url, data, ...config }).then((r) => r.data);
  },
  put<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ method: 'PUT', url, data, ...config }).then((r) => r.data);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ method: 'DELETE', url, ...config }).then((r) => r.data);
  },
};

export { service };
export default request;
