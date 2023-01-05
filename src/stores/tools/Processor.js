class Processor {
   #keys = [];

   async #add(key) {
      return new Promise((resolve, reject) => {
         const run = () => {
            if (this.isLoading(key)) return setTimeout(run, 10);

            this.#keys.push(key);
            resolve(key);
         };
         run();
      });
   }
   #remove(key) {
      const index = this.#keys.indexOf(key);
      if (index > -1) this.#keys.splice(index, 1);
   }

   async acquire(key, callback) {
      try {
         await this.#add(key);
         const result = await callback();
         this.#remove(key);
         return result;
      } catch (error) {
         this.#remove(key);
         throw error;
      }
   }

   isLoading(key) {
      if (typeof key !== "string") return this.#keys.length > 0;
      return !!this.#keys.find((loading) => loading === key);
   }
}

export default Processor;
