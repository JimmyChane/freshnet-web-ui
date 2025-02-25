import { isNumber } from '@/U';

export function getAppPath() {
  return parseOrigin(
    window.location.protocol,
    window.location.hostname,
    window.location.port,
  );
}

function parseOrigin(protocol: string, hostname: string, port: string) {
  port = parsePort(port);
  return port === '80'
    ? `${protocol}//${hostname}`
    : `${protocol}//${hostname}:${port}`;
}

function parsePort(port: string | any): string {
  if (!isNumber(port)) port = Number.parseInt(port);
  if (Number.isNaN(port)) port = 80;
  return `${port}`;
}
