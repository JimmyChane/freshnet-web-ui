import { API, Response } from '@/host/ServerApi';

export async function getPs2DiscList(): Promise<Response> {
  const response = await API.get('ps2/disc/');
  return new Response(response.data);
}
