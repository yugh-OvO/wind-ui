import axios from 'axios';
import qs from 'query-string';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export interface UserRecord {
  id: number;
}

export interface UserParams {
  current: number;
  pageSize: number;
}

export interface UserListRes {
  list: UserRecord[];
  total: number;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/getInfo');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export function userList(params: UserParams) {
  return axios.get<UserListRes>('/system/user/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changeUserStatus(id: number, status: number) {
  return axios.put(`/system/user/status`, {
    id,
    status,
  });
}

export function destroyUser(id: number) {
  return axios.delete(`/system/user/${id}`);
}

export function userInfo(id: number) {
  return axios.get(`/system/user/${id}`);
}

export function submitUser(id: number, data: any) {
  return id > 0
    ? axios.put(`/system/user`, data)
    : axios.post(`/system/user`, data);
}

export function changePassword(data: any) {
  return axios.put(`/system/user/profile/updatePwd`, data);
}
