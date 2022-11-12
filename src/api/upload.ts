import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function uploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/system/upload', data, config);
}
