import Server from '@/host/Server';

export default class Order {
  static list(): Promise<any> {
    return Server.request().path('order/').sendJson();
  }
  static add(body: any): Promise<any> {
    return Server.request().POST().path('order/').bodyJson(body).sendJson();
  }
  static delete(id: string): Promise<any> {
    return Server.request().DELETE().path('order/').bodyJson({ id }).sendJson();
  }
  static updateStatus(id: string, status: number): Promise<any> {
    return Server.request()
      .PUT()
      .path('order/')
      .bodyJson({ id, status })
      .sendJson();
  }
}
