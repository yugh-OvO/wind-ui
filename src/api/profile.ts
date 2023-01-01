import axios from 'axios';

export function profileInfo() {
  return axios.get(`/system/user/profile`);
}

export function submitProfile(data: any) {
  return axios.put(`/system/user/updateProfile`, data);
}
