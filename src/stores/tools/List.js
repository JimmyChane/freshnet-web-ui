export default class List {
   lastModified = 0;
   items = [];

   constructor() {}

   clear() {
      this.items.slice(0, this.items.length);
      this.lastModified = Date.now();
      return this;
   }

   addItems(...items) {
      const replacedItems = [];
      for (const item of items) {
         const found = this.items.find((found) => found.id === item.id);
         if (!found) continue;

         const index = this.items.indexOf(found);
         this.items[index] = item;
         replacedItems.push(item);
      }

      const filteredItems = items.filter((item) => {
         return !this.items.find((found) => found.id === item.id);
      });

      this.items.push(...filteredItems);

      if (replacedItems.length > 0 || filteredItems.length > 0) {
         this.lastModified = Date.now();
      }
      return [...replacedItems, ...filteredItems];
   }
   addItem(item) {
      const addedItems = this.addItems(item);
      return addedItems.length > 0 ? addedItems[0] : null;
   }

   removeItemsByIds(...ids) {
      const removedItems = [];

      for (const id of ids) {
         const item = this.items.find((item) => item.id === id);
         if (!item) continue;
         this.items.splice(this.items.indexOf(item), 1);
         removedItems.push(item);
      }

      if (removedItems.length > 0) this.lastModified = Date.now();
      return removedItems;
   }
   removeItemById(id) {
      const removedItems = this.removeItemsByIds(id);
      return removedItems.length > 0 ? removedItems[0] : null;
   }

   updateItemById(id, updater = (item) => {}) {
      const item = this.items.find((item) => item.id === id);
      if (!item) return null;

      const inputItem = updater(item);
      if (inputItem !== null && inputItem !== undefined && inputItem !== item) {
         this.items[this.items.indexOf(item)] = inputItem;
      }
      this.lastModified = Date.now();
      return item;
   }
}
