import axios from 'axios';
import qs from 'query-string';

export interface LoginLogRecord {
  id: number;
}

export interface LoginLogParams {
  current: number;
  pageSize: number;
}

export interface LoginLogListRes {
  list: LoginLogRecord[];
  total: number;
}

export function loginLogList(params: LoginLogParams) {
  return axios.get<LoginLogListRes>('/system/loginLog/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
