import { API_SERVER } from '@/host/Server';

export function getInfo(): Promise<any> {
  return API_SERVER.request().POST().path('database/info').sendJson();
}

export function getDatabases(): Promise<any> {
  return API_SERVER.request().POST().path('database/databases').sendJson();
}

export function getCollections(database: string): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`database/database/${database}/collections`)
    .sendJson();
}

export function getDocuments(
  database: string,
  collection: string,
): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`database/database/${database}/collection/${collection}/documents`)
    .sendJson();
}

export function getImport(body: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path('database/imports')
    .bodyJson(body)
    .sendJson();
}

export function getExport(database: string): Promise<any> {
  return API_SERVER.request()
    .path(`database/database/${database}/exportv2`)
    .sendJson();
}
