import axios from 'axios';
import qs from 'query-string';

export interface WinLogRecord {
  id: number;
}

export interface WinLogParams {
  current: number;
  pageSize: number;
}

export interface WinLogListRes {
  list: WinLogRecord[];
  total: number;
}

export function winLogExport(params: WinLogParams) {
  return axios.get<any>('/business/prize/winLogExport', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function winLogList(params: WinLogParams) {
  return axios.get<WinLogListRes>('/business/prize/winLog', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
