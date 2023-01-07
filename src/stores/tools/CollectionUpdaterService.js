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
      const addedItem = this.#context.state.list.addItem(this.#eItem);
      // this.#context.commit("items", this.#context.state.list.items);
      // this.#context.commit(
      //    "lastModified",
      //    this.#context.state.list.lastModified,
      // );
      this.#context.commit("list", this.#context.state.list);
      return addedItem;
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

      const item = this.#context.state.list.removeItemById(id);
      if (!item) return this.#eItem;

      // this.#context.commit("items", this.#context.state.list.items);
      // this.#context.commit(
      //    "lastModified",
      //    this.#context.state.list.lastModified,
      // );
      this.#context.commit("list", this.#context.state.list);
      return item;
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
         this.#context.state.list.addItem(this.#eItem);
         // this.#context.commit("items", this.#context.state.list.items);
         // this.#context.commit(
         //    "lastModified",
         //    this.#context.state.list.lastModified,
         // );
         this.#context.commit("list", this.#context.state.list);
         return this.#eItem;
      }

      const outputItem = this.#context.state.list.updateItemById(id, (item) => {
         updater(item, this.#eItem);
         return item;
      });
      // this.#context.commit("items", this.#context.state.list.items);
      // this.#context.commit(
      //    "lastModified",
      //    this.#context.state.list.lastModified,
      // );
      this.#context.commit("list", this.#context.state.list);
      return outputItem;
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
