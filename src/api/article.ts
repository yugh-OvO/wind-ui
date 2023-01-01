import axios from 'axios';
import qs from 'query-string';

export interface ArticleRecord {
  id: number;
}

export interface ArticleParams {
  current: number;
  pageSize: number;
}

export interface ArticleListRes {
  list: ArticleRecord[];
  total: number;
}

export function articleList(params: ArticleParams) {
  return axios.get<ArticleListRes>('/blog/article/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function changeArticleStatus(id: number, status: number) {
  return axios.put('/blog/article/changeStatus', {
    id,
    status,
  });
}

export function changeArticleRecommen(id: number, isRecommen: number) {
  return axios.post('/blog/article/changeRecommen', {
    id,
    isRecommen,
  });
}

export function articleInfo(id: number) {
  return axios.get(`/blog/article/${id}`);
}

export function submitArticle(id: number, data: any) {
  return id > 0
    ? axios.put(`/blog/article/update`, data)
    : axios.post(`/blog/article/create`, data);
}

export function getArticleCategoryOptions() {
  return axios.get('/blog/articleCategories/options');
}

export function getArticleTagsOptions() {
  return axios.get('/business/tags/options');
}
