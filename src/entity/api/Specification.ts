import { API, ServerResponse } from '@/entity/Server';

export async function getSpecificationList() {
  const response = await API.get('spec/');
  return new ServerResponse(response.data);
}
