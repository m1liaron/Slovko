import { createAuthorizedInstance } from '@/utils';
import { AxiosInstance } from 'axios';

const withAuth = async <T>(cb: (api: AxiosInstance) => Promise<T>) => {
  const api = await createAuthorizedInstance();
  return cb(api);
};

export { withAuth };
