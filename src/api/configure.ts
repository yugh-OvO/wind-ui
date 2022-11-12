import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function strategyInfo() {
  return axios.get('/business/configure/find?code=strategy');
}

export function submitConfigure(data: any) {
  return axios.put(`/business/configure/update`, data);
}

export function prizeInfo() {
  return axios.get('/business/configure/find?code=prize');
}
