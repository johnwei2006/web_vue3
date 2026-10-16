import request from './request';
import type { ApiResponse, DataRecord } from '@/types';

/** 查询设备数据，可选时间范围（毫秒时间戳） */
export function queryData(
  deviceId: string,
  from?: number,
  to?: number,
): Promise<ApiResponse<DataRecord[]>> {
  return request<DataRecord[]>({
    url: '/api/data',
    method: 'GET',
    params: { deviceId, from, to },
  });
}

/** 设备最新一条数据 */
export function latestData(deviceId: string): Promise<ApiResponse<DataRecord>> {
  return request<DataRecord>({
    url: '/api/data/latest',
    method: 'GET',
    params: { deviceId },
  });
}
