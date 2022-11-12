import axios from 'axios';

export interface MenuRecord {
  id: number;
}

export interface MenuParams {
  current: number;
  pageSize: number;
}

export function menuList() {
  return axios.get<MenuRecord[]>('/system/menu/options');
}

export function destroyMenu(id: number) {
  return axios.delete(`/system/menu/${id}`);
}

export function menuInfo(id: number) {
  return axios.get(`/system/menu/${id}`);
}

export function submitMenu(id: number, data: any) {
  return id > 0
    ? axios.put(`/system/menu`, data)
    : axios.post(`/system/menu`, data);
}

export function getMenuCategoryOptions() {
  return axios.get('/business/haowuMenu/options');
}

export function getMenuMenuOptions() {
  return axios.get('/system/menu/options');
}
