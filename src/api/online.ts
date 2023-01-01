import axios from 'axios';
import qs from 'query-string';

export interface OnlineRecord {
  id: number;
}

export interface OnlineParams {
  current: number;
  pageSize: number;
}

export interface OnlineListRes {
  list: OnlineRecord[];
  total: number;
}

export function onlineList(params: OnlineParams) {
  return axios.get<OnlineListRes>('/system/online/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function quit(token: string) {
  return axios.delete(`/system/online/quit?token=${token}`);
}
