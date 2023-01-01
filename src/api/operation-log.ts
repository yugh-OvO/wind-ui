import axios from 'axios';
import qs from 'query-string';

export interface OperationLogRecord {
  id: number;
}

export interface OperationLogParams {
  current: number;
  pageSize: number;
}

export interface OperationLogListRes {
  list: OperationLogRecord[];
  total: number;
}

export function operationLogList(params: OperationLogParams) {
  return axios.get<OperationLogListRes>('/system/operationLog/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
