import { API, ServerResponse } from '@/host/Server';

export async function getPs2DiscList(): Promise<ServerResponse> {
  const response = await API.get('ps2/disc/');
  return new ServerResponse(response.data);
}
