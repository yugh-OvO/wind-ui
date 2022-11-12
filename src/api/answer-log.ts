import axios from 'axios';
import qs from 'query-string';

export interface AnswerLogRecord {
  id: number;
}

export interface AnswerLogParams {
  current: number;
  pageSize: number;
}

export interface AnswerLogListRes {
  list: AnswerLogRecord[];
  total: number;
}

export function answerLogExport(params: AnswerLogParams) {
  return axios.get<any>('/business/answerLog/export', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function answerLogList(params: AnswerLogParams) {
  return axios.get<AnswerLogListRes>('/business/answerLog/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
