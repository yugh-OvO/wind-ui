import axios from 'axios';
import qs from 'query-string';

export interface RoleRecord {
  id: number;
}

export interface RoleParams {
  current: number;
  pageSize: number;
}

export interface RoleListRes {
  list: RoleRecord[];
  total: number;
}

export function roleList(params: RoleParams) {
  return axios.get<RoleListRes>('/system/role/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changeRoleStatus(id: number, status: number) {
  return axios.post('/system/role/changeStatus', {
    id,
    status,
  });
}

export function destroyRole(id: number) {
  return axios.delete(`/system/role/${id}`);
}

export function roleInfo(id: number) {
  return axios.get(`/system/role/${id}`);
}

export function submitRole(id: number, data: any) {
  return id > 0
    ? axios.put(`/system/role`, data)
    : axios.post(`/system/role`, data);
}

export function getRoleOptions() {
  return axios.get('/system/role/options');
}
