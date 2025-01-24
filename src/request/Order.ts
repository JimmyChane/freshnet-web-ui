import Server from '@/host/Server';

export function getOrderList(): Promise<any> {
  return Server.request().path('order/').sendJson();
}
export function addOrder(body: any): Promise<any> {
  return Server.request().POST().path('order/').bodyJson(body).sendJson();
}
export function deleteOrder(id: string): Promise<any> {
  return Server.request().DELETE().path('order/').bodyJson({ id }).sendJson();
}
export function updateOrderStatus(id: string, status: number): Promise<any> {
  return Server.request()
    .PUT()
    .path('order/')
    .bodyJson({ id, status })
    .sendJson();
}
