export default class Item {
   constructor(stores) {
      this.stores = stores;
   }

   fromData(data = {}) {
      return this;
   }

   toData() {
      return {};
   }

   toCount(strs = [""]) {
      return 0;
   }

   compare(item = Item) {
      return 0;
   }
}
