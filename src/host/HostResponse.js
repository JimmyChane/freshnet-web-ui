class HostResponse {
   #apiJson = null;

   constructor(apiJson) {
      this.#apiJson = apiJson;
   }

   getError() {
      return this.#apiJson.error;
   }
   getErrorFriendly() {
      return this.#apiJson.friendlyError;
   }
   getContent() {
      return this.#apiJson.content;
   }

   get error() {
      return this.getError();
   }
   get friendlyError() {
      return this.getErrorFriendly();
   }
   get content() {
      return this.getContent();
   }
}

export default HostResponse;
