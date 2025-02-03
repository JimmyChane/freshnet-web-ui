import { isNumber } from '@/U';

class AppHost {
  get origin() {
    return parseOrigin(
      getClientProtocol(),
      getClientHostname(),
      getClientPort(),
    );
  }
  get path() {
    return `${this.origin}`;
  }
}

export const APP_HOST = new AppHost();

export function parseOrigin(protocol: string, hostname: string, port: string) {
  port = parsePort(port);
  return port === '80'
    ? `${protocol}//${hostname}`
    : `${protocol}//${hostname}:${port}`;
}

export function getClientProtocol(): string {
  return window.location.protocol;
}
export function getClientHostname(): string {
  return window.location.hostname;
}
export function getClientPort(): string {
  return window.location.port;
}
export function parsePort(port: string | any): string {
  if (!isNumber(port)) port = Number.parseInt(port);
  if (Number.isNaN(port)) port = 80;
  return `${port}`;
}
