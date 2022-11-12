import axios from 'axios';
import qs from 'query-string';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface MemberRecord {
  id: number;
}

export interface MemberParams {
  current: number;
  pageSize: number;
  source: number;
}

export interface MemberListRes {
  list: MemberRecord[];
  total: number;
}

export interface GameLogRecord {
  id: number;
}

export interface GameLogParams {
  current: number;
  pageSize: number;
  memberId: number;
}

export interface GameLogListRes {
  list: GameLogRecord[];
  total: number;
}

export function gameLog(params: GameLogParams) {
  return axios.get<GameLogListRes>('/business/member/gameLog', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function memberList(params: MemberParams) {
  return axios.get<MemberListRes>('/business/member/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function memberRank(params: MemberParams) {
  return axios.get<MemberListRes>('/business/member/rank', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function memberTableList() {
  return axios.get<TableData[]>('/business/member/list', {
    params: {
      current: 1,
      pageSize: 5,
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function memberInfo(id: number) {
  return axios.get(`/business/member/find?id=${id}`);
}

export function changeMemberStatus(id: number, status: number) {
  return axios.put(`/business/member/changeStatus`, {
    id,
    status,
  });
}
