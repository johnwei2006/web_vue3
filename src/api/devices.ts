import request from './request';
import type { ApiResponse, Device, DownlinkPayload } from '@/types';

export function listDevices(): Promise<ApiResponse<Device[]>> {
  return request<Device[]>({ url: '/api/devices', method: 'GET' });
}

export function getDevice(id: string): Promise<ApiResponse<Device>> {
  return request<Device>({ url: `/api/devices/${id}`, method: 'GET' });
}

export function createDevice(data: Partial<Device>): Promise<ApiResponse<Device>> {
  return request<Device>({ url: '/api/devices', method: 'POST', data });
}

export function updateDevice(id: string, data: Partial<Device>): Promise<ApiResponse<Device>> {
  return request<Device>({ url: `/api/devices/${id}`, method: 'PUT', data });
}

export function deleteDevice(id: string): Promise<ApiResponse<null>> {
  return request<null>({ url: `/api/devices/${id}`, method: 'DELETE' });
}

/** 向设备下发指令（经 platform_java -> dtm -> 网关） */
export function sendDownlink(id: string, data: DownlinkPayload): Promise<ApiResponse<null>> {
  return request<null>({ url: `/api/devices/${id}/downlink`, method: 'POST', data });
}
