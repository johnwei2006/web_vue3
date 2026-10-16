/** 后端统一响应结构（按实际后端约定调整 code 取值） */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
  roles: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

/** 记住密码时持久化的凭证（密码为轻量混淆，非加密，生产需加密或改用后端会话） */
export interface RememberedCredentials {
  username: string;
  password: string;
}
