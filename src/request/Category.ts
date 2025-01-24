import { API, Response } from '@/host/ServerApi';

export async function getCategoryList(): Promise<Response> {
  const response = await API.get('productv2/category/list/');
  return new Response(response.data);
}
