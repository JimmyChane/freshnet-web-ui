import U from "@/U";

const getClientProtocol = () => window.location.protocol;
const getClientHostname = () => window.location.hostname;
const getClientPort = () => window.location.port;
const parsePort = (port) => {
   if (!U.isNumber(port)) port = Number.parseInt(port);
   if (Number.isNaN(port)) port = 80;
   return port;
};

class AppHost {
   static #dev_port = 8080;
   static #parseOrigin(protocol, hostname, port) {
      port = parsePort(port);
      return port === 80
         ? `${protocol}//${hostname}`
         : `${protocol}//${hostname}:${port}`;
   }

   get origin() {
      return AppHost.#parseOrigin(
         getClientProtocol(),
         getClientHostname(),
         getClientPort(),
      );
   }
   get path() {
      return getClientPort() == AppHost.#dev_port
         ? `${this.origin}/#`
         : `${this.origin}/page/#`;
   }
}

export default new AppHost();
