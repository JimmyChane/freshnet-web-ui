import ApiHost from "./ApiHost.js";

let { protocol, hostname, port } = window.location;

class AppHost {
   static #dev_port = 8080;
   static #parseOrigin(protocol, hostname, port) {
      port = port === 80 ? "" : `:${port}`;
      return `${protocol}//${hostname}${port}`;
   }

   get origin() {
      return AppHost.#parseOrigin(protocol, hostname, port);
   }
   get path() {
      return port == AppHost.#dev_port ? `${this.origin}/#` : `${ApiHost.origin}/page/#`;
   }
}

export default new AppHost();
