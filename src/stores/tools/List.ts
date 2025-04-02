const isUndefinedOrNull = (value: any) => value === null || value === undefined;

export interface Item {
  getUnique(): string;
}

export class List<T extends Item> {
  lastModified: number = 0;
  items: T[] = [];

  clear(): this {
    this.items = [];
    this.lastModified = Date.now();
    return this;
  }

  addItems(...items: T[]): T[] {
    const replacedItems: any[] = [];
    for (const item of items) {
      const found = this.items.find((found) => {
        return found.getUnique() === item.getUnique();
      });
      if (!found) continue;

      const index = this.items.indexOf(found);
      this.items[index] = item;
      replacedItems.push(item);
    }

    const filteredItems = items.filter((item) => {
      return !this.items.find((found) => {
        return found.getUnique() === item.getUnique();
      });
    });

    this.items.push(...filteredItems);

    if (replacedItems.length > 0 || filteredItems.length > 0) {
      this.lastModified = Date.now();
    }
    return [...replacedItems, ...filteredItems];
  }
  addItem(item: T): T | null {
    const addedItems = this.addItems(item);
    return addedItems.length > 0 ? addedItems[0] : null;
  }

  removeItemsByIds(...ids: string[]): T[] {
    const removedItems: any[] = [];

    for (const id of ids) {
      const item = this.items.find((item) => item.getUnique() === id);
      if (!item) continue;
      this.items.splice(this.items.indexOf(item), 1);
      removedItems.push(item);
    }

    if (removedItems.length > 0) {
      this.lastModified = Date.now();
    }
    return removedItems;
  }
  removeItemById(id: string): T | null {
    const removedItems = this.removeItemsByIds(id);
    return removedItems.length > 0 ? removedItems[0] : null;
  }
  removeItemByItems(...items: T[]): T[] {
    const ids = items.map((item) => item.getUnique());
    const removedItems = this.removeItemsByIds(...ids);

    return items.map((item) => {
      const removedItem = removedItems.find((removedItem) => {
        return removedItem.getUnique() === item.getUnique();
      });
      return removedItem ?? item;
    });
  }
  removeItemByItem(item: T): T | null {
    const removedItems = this.removeItemByItems(item);
    return removedItems.length > 0 ? removedItems[0] : null;
  }

  updateItemById(id: string, updater: (item: T | undefined) => T | any): T {
    const item = this.items.find((item) => item.getUnique() === id);

    const inputItem = updater(item);
    const isReadableObject =
      !isUndefinedOrNull(inputItem) && typeof inputItem === 'object';
    const inputItemId = isReadableObject ? inputItem.getId() : '';
    const itemId = item === null || item === undefined ? '' : item.getUnique();

    if (isReadableObject && inputItem !== item && inputItemId === itemId) {
      const index = item ? this.items.indexOf(item) : -1;

      if (index === -1) {
        this.addItem(inputItem);
      } else {
        this.items[index] = inputItem;
      }
    }
    this.lastModified = Date.now();
    return inputItem;
  }
}
