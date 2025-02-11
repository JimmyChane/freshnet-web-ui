import { apiServer } from '@/host/Server';

export function getOrderList(): Promise<any> {
  return apiServer.request().path('order/').sendJson();
}
export function addOrder(body: any): Promise<any> {
  return apiServer.request().POST().path('order/').bodyJson(body).sendJson();
}
export function deleteOrder(id: string): Promise<any> {
  return apiServer
    .request()
    .DELETE()
    .path('order/')
    .bodyJson({ id })
    .sendJson();
}
export function updateOrderStatus(id: string, status: number): Promise<any> {
  return apiServer
    .request()
    .PUT()
    .path('order/')
    .bodyJson({ id, status })
    .sendJson();
}
