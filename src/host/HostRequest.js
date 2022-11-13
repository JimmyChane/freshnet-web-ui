class HostRequest {
   #host;
   #bind = {
      method: "GET",
      url: "",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: undefined,
   };

   constructor(host) {
      this.#host = host;
   }

   GET() {
      return this.method("GET");
   }
   POST() {
      return this.method("POST");
   }
   PUT() {
      return this.method("PUT");
   }
   DELETE() {
      return this.method("DELETE");
   }
   method(method = "GET") {
      this.#bind.method = method;
      return this;
   }

   url(url = "") {
      this.#bind.url = url;
      return this;
   }
   headers(headers = {}) {
      if (!headers["Content-Type"]) {
         headers["Content-Type"] = "application/json;charset=UTF-8";
      }
      this.#bind.headers = headers;
      return this;
   }
   body(body = undefined) {
      this.#bind.body = body ? JSON.stringify(body) : undefined;
      return this;
   }

   async send() {
      let api = await this.#host.fetch(this.#bind);
      if (api.getError()) {
         throw new Error(api.getError());
      }
      return api;
   }
}

export default HostRequest;
