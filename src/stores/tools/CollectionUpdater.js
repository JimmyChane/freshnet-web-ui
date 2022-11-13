module.exports = class CollectionUpdater {
	#context;

	#itemIdGetter;
	#updater;

	constructor(context) {
		this.#context = context;
	}

	onId(itemIdGetter) {
		this.#itemIdGetter = itemIdGetter;
		return this;
	}
	onUpdate(updater) {
		this.#updater = updater;
		return this;
	}

	getItem(itemOccured) {
		const items = this.#context.getters.items;
		const existingItem = items.find(
			(item) => this.#itemIdGetter(item) === this.#itemIdGetter(itemOccured),
		);

		if (existingItem) {
			if (this.#updater) {
				this.#updater(existingItem, itemOccured);
				return existingItem;
			} else {
				const existingIndex = items.indexOf(existingItem);
				items[existingIndex] = itemOccured;
				return itemOccured;
			}
		} else {
			items.push(itemOccured);
			this.#context.commit("items", items);
			this.#context.commit("lastModified", Date.now());
			return itemOccured;
		}
	}

	getItemById(id) {
		const items = this.#context.getters.items;
		const existingItem = items.find((item) => this.#itemIdGetter(item) === id);

		if (existingItem) {
			if (this.#updater) {
				this.#updater(existingItem);
				return existingItem;
			}
		}
		return null;
	}
};
