import { API, ServerResponse } from '@/host/Server';

export async function getCategoryList(): Promise<ServerResponse> {
  const response = await API.get('productv2/category/list/');
  return new ServerResponse(response.data);
}
