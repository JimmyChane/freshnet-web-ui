import U from "@/U";
import { RouterMode } from "vue-router";

class AppHost {
  private static readonly dev_port: string | number = 8080;

  private static parseOrigin(protocol: string, hostname: string, port: string) {
    port = this.parsePort(port);
    return port === "80"
      ? `${protocol}//${hostname}`
      : `${protocol}//${hostname}:${port}`;
  }

  private static getClientProtocol(): string {
    return window.location.protocol;
  }
  private static getClientHostname(): string {
    return window.location.hostname;
  }
  private static getClientPort(): string {
    return window.location.port;
  }
  private static parsePort(port: string | any): string {
    if (!U.isNumber(port)) port = Number.parseInt(port);
    if (Number.isNaN(port)) port = 80;
    return `${port}`;
  }

  public readonly ROUTER_MODE: RouterMode = "hash";

  get origin() {
    return AppHost.parseOrigin(
      AppHost.getClientProtocol(),
      AppHost.getClientHostname(),
      AppHost.getClientPort(),
    );
  }
  get path() {
    return this.ROUTER_MODE === "hash" ? `${this.origin}/#` : `${this.origin}`;
  }
}

export default new AppHost();
