import { API, Response } from '@/host/ServerApi';

export async function getBrandList(): Promise<Response> {
  const response = await API.get('brand/');
  return new Response(response.data);
}
