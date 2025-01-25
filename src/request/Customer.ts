import { requestServer } from '@/host/Server';

interface CustomerContent {
  _id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
}

export function getCustomerList(): Promise<any> {
  return requestServer().path('customer/list').sendJson();
}

export function addCustomer(content: CustomerContent = {}): Promise<any> {
  return requestServer()
    .POST()
    .path('customer/add')
    .bodyJson({ content })
    .sendJson();
}

export function removeCustomer(id: string = ''): Promise<any> {
  return requestServer()
    .DELETE()
    .path('customer/remove')
    .bodyJson({ content: { _id: id } })
    .sendJson();
}

export function updateCustomerNamePhoneNumber(
  id: string = '',
  name: string = '',
  phoneNumber: string = '',
): Promise<any> {
  return requestServer()
    .PUT()
    .path('customer/update/namePhoneNumber')
    .bodyJson({ content: { _id: id, name, phoneNumber } })
    .sendJson();
}

export function updateCustomerDescription(
  id: string = '',
  description: string = '',
): Promise<any> {
  return requestServer()
    .PUT()
    .path('customer/update/description')
    .bodyJson({ content: { id, description } })
    .sendJson();
}
