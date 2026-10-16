import request from './request';
import type { ApiResponse, Alarm } from '@/types';

/** 告警列表，可选按状态过滤（OPEN/RESOLVED） */
export function listAlarms(status?: string): Promise<ApiResponse<Alarm[]>> {
  return request<Alarm[]>({
    url: '/api/alarms',
    method: 'GET',
    params: status ? { status } : undefined,
  });
}

/** 处理告警 */
export function resolveAlarm(id: string): Promise<ApiResponse<Alarm>> {
  return request<Alarm>({ url: `/api/alarms/${id}/resolve`, method: 'POST' });
}
