import { API, ServerResponse } from '@/entity/Server';

export async function getBrandList(): Promise<ServerResponse> {
  const response = await API.get('brand/');
  return new ServerResponse(response.data);
}
