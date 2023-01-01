import axios from 'axios';
import qs from 'query-string';

export interface ConfigRecord {
  id: number;
}

export interface ConfigParams {
  current: number;
  pageSize: number;
}

export interface ConfigListRes {
  list: ConfigRecord[];
  total: number;
}

export function configList(params: ConfigParams) {
  return axios.get<ConfigListRes>('/system/config/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changeConfigStatus(id: number, status: number) {
  return axios.post('/system/config/changeStatus', {
    id,
    status,
  });
}

export function destroyConfig(id: number) {
  return axios.delete(`/system/config/${id}`);
}

export function configInfo(id: number) {
  return axios.get(`/system/config/${id}`);
}

export function submitConfig(id: number, data: any) {
  return id > 0
    ? axios.put(`/system/config`, data)
    : axios.post(`/system/config`, data);
}

export function getConfigOptions() {
  return axios.get('/system/config/options');
}
