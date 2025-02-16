import { API, ServerResponse } from '@/host/Server';

export async function getSpecificationList() {
  const response = await API.get('spec/');
  return new ServerResponse(response.data);
}
