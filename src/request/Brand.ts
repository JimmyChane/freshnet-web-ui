import { API, ServerResponse } from '@/host/Server';

export async function getBrandList(): Promise<ServerResponse> {
  const response = await API.get('brand/');
  return new ServerResponse(response.data);
}
