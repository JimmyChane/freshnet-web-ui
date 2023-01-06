class ItemAdder {
   #context;

   constructor(context) {
      this.#context = context;
   }

   #eItem;

   withItem(item) {
      this.#eItem = item;
      return this;
   }

   commitThenGetItem() {
      const items = this.#context.state.list.items;
      const existingItem = items.find((item) => item.id === this.#eItem.id);

      if (existingItem) {
         const index = items.indexOf(existingItem);
         items[index] = this.#eItem;
         this.#context.commit("items", items);
         this.#context.commit("lastModified", Date.now());
         return this.#eItem;
      }

      items.push(this.#eItem);
      this.#context.commit("items", items);
      this.#context.commit("lastModified", Date.now());

      return this.#eItem;
   }
}
class ItemRemover {
   #context;

   constructor(context) {
      this.#context = context;
   }

   #eItem;
   #eId;

   withItem(item) {
      this.#eItem = item;
      return this;
   }
   withId(id) {
      this.#eId = id;
      return this;
   }

   commitThenGetItem() {
      const id = this.#eItem ? this.#eItem.id : this.#eId;
      const items = this.#context.state.list.items;
      const existingItem = items.find((item) => item.id === id);

      if (!existingItem) return this.#eItem;

      const index = items.indexOf(existingItem);
      items.splice(index, 1);
      this.#context.commit("items", items);
      this.#context.commit("lastModified", Date.now());

      return existingItem;
   }
}
class ItemUpdater {
   #context;

   constructor(context) {
      this.#context = context;
   }

   #eItem;
   #eId;

   withItem(item) {
      this.#eItem = item;
      return this;
   }
   withId(id) {
      this.#eId = id;
      return this;
   }

   updateThenCommitThenGetItem(updater = (existingItem, item) => {}) {
      const id = this.#eItem ? this.#eItem.id : this.#eId;
      const items = this.#context.state.list.items;
      const existingItem = items.find((item) => item.id === id);

      if (!existingItem) {
         if (!this.#eItem) return this.#eItem;
         items.push(this.#eItem);
         this.#context.commit("items", items);
         this.#context.commit("lastModified", Date.now());
         return this.#eItem;
      }

      updater(existingItem, this.#eItem);
      this.#context.commit("items", items);
      this.#context.commit("lastModified", Date.now());
      return existingItem;
   }
}

export default class CollectionUpdater {
   #context;

   constructor(context) {
      this.#context = context;
   }

   toAdd() {
      return new ItemAdder(this.#context);
   }
   toRemove() {
      return new ItemRemover(this.#context);
   }
   toUpdate() {
      return new ItemUpdater(this.#context);
   }
}
