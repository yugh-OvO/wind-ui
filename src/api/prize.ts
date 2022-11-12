import axios from 'axios';
import qs from 'query-string';

export interface PrizeRecord {
  id: number;
}

export interface PrizeParams {
  current: number;
  pageSize: number;
}

export interface PrizeListRes {
  list: PrizeRecord[];
  total: number;
}

export function prizeList(params: PrizeParams) {
  return axios.get<PrizeListRes>('/business/prize/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changePrizeStatus(id: number, status: number) {
  return axios.put('/business/prize/changeStatus', {
    id,
    status,
  });
}

export function destroyPrize(id: number) {
  return axios.delete(`/business/prize/delete?id=${id}`);
}

export function prizeInfo(id: number) {
  return axios.get(`/business/prize/find?id=${id}`);
}

export function submitPrize(id: number, data: any) {
  return id > 0
    ? axios.put(`/business/prize/update`, data)
    : axios.post(`/business/prize/create`, data);
}

export function getPrizeOptions() {
  return axios.get('/business/prize/options');
}
