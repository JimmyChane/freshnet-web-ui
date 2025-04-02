import { API, ServerResponse } from '@/entity/Server';

export async function getUserList() {
  const response = await API.get('users');
  return new ServerResponse(response.data);
}
