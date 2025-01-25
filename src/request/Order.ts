import { requestServer } from '@/host/Server';

export function getOrderList(): Promise<any> {
  return requestServer().path('order/').sendJson();
}
export function addOrder(body: any): Promise<any> {
  return requestServer().POST().path('order/').bodyJson(body).sendJson();
}
export function deleteOrder(id: string): Promise<any> {
  return requestServer().DELETE().path('order/').bodyJson({ id }).sendJson();
}
export function updateOrderStatus(id: string, status: number): Promise<any> {
  return requestServer()
    .PUT()
    .path('order/')
    .bodyJson({ id, status })
    .sendJson();
}
