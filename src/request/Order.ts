import { API_SERVER } from '@/host/Server';

export function getOrderList(): Promise<any> {
  return API_SERVER.request().path('order/').sendJson();
}
export function addOrder(body: any): Promise<any> {
  return API_SERVER.request().POST().path('order/').bodyJson(body).sendJson();
}
export function deleteOrder(id: string): Promise<any> {
  return API_SERVER.request()
    .DELETE()
    .path('order/')
    .bodyJson({ id })
    .sendJson();
}
export function updateOrderStatus(id: string, status: number): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path('order/')
    .bodyJson({ id, status })
    .sendJson();
}
