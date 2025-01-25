import { API, Response } from '@/host/ServerApi';

export async function getSpecificationList() {
  const response = await API.get('spec/');
  return new Response(response.data);
}
