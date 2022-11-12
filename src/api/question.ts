import axios from 'axios';
import qs from 'query-string';

export interface QuestionRecord {
  id: number;
}

export interface QuestionParams {
  current: number;
  pageSize: number;
}

export interface QuestionListRes {
  list: QuestionRecord[];
  total: number;
}

export function questionList(params: QuestionParams) {
  return axios.get<QuestionListRes>('/business/question/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changeQuestionStatus(id: number, status: number) {
  return axios.put('/business/question/changeStatus', {
    id,
    status,
  });
}

export function changeQuestionRecommen(id: number, isRecommen: number) {
  return axios.post('/business/question/changeRecommen', {
    id,
    isRecommen,
  });
}

export function questionInfo(id: number) {
  return axios.get(`/business/question/find?id=${id}`);
}

export function submitQuestion(id: number, data: any) {
  return id > 0
    ? axios.put(`/business/question/update`, data)
    : axios.post(`/business/question/create`, data);
}

export function destroyQuestion(id: number) {
  return axios.delete(`/business/question/delete?id=${id}`);
}
