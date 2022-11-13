module.exports = class ValidationChecker {
   #timeout = 0;
   #checkpoint = 0;

   constructor(param = { timeout }) {
      this.#timeout = param.timeout;
   }

   get timeout() {
      return this.#timeout;
   }

   get checkpoint() {
      return this.#checkpoint;
   }

   isValid() {
      return Date.now() - this.checkpoint < this.timeout;
   }

   makeCheckpoint() {
      this.#checkpoint = Date.now();
   }
   resetCheckpoint() {
      this.#checkpoint = 0;
   }
};
