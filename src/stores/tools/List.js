export default class List {
   lastModified = 0;
   items = [];

   constructor() {}

   replaceItems(...items) {
      this.items.splice(0, this.items.length);
      this.items.push(...items);

      this.lastModified = Date.now();
   }
}
