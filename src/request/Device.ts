import { apiServer } from '@/host/Server';

export function getDeviceList(): Promise<any> {
  return apiServer.request().path('customer/device/list').sendJson();
}
export function addDevice(body: any): Promise<any> {
  return apiServer
    .request()
    .POST()
    .path('customer/device/add')
    .bodyJson(body)
    .sendJson();
}
export function removeDevice(body: any): Promise<any> {
  return apiServer
    .request()
    .DELETE()
    .path('customer/device/remove')
    .bodyJson(body)
    .sendJson();
}
export function updateDeviceSpecification(body: any): Promise<any> {
  return apiServer
    .request()
    .PUT()
    .path('customer/device/update/specifications')
    .bodyJson(body)
    .sendJson();
}
export function updateDeviceDescription(body: any): Promise<any> {
  return apiServer
    .request()
    .PUT()
    .path('customer/device/update/description')
    .bodyJson(body)
    .sendJson();
}
