import U from "@/U";

const getClientProtocol = (): string => window.location.protocol;
const getClientHostname = (): string => window.location.hostname;
const getClientPort = (): string => window.location.port;
const parsePort = (port: string | any): string => {
  if (!U.isNumber(port)) port = Number.parseInt(port);
  if (Number.isNaN(port)) port = 80;
  return `${port}`;
};

class AppHost {
  private static dev_port: string | number = 8080;
  private static parseOrigin(protocol: string, hostname: string, port: string) {
    port = parsePort(port);
    return port === "80"
      ? `${protocol}//${hostname}`
      : `${protocol}//${hostname}:${port}`;
  }

  get origin() {
    return AppHost.parseOrigin(
      getClientProtocol(),
      getClientHostname(),
      getClientPort(),
    );
  }
  get path() {
    return getClientPort() == AppHost.dev_port
      ? `${this.origin}/#`
      : `${this.origin}/#`;
  }
}

export default new AppHost();
