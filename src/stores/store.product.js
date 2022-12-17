import Product from "../items/Product.js";
import ProductSpecContent from "../items/ProductSpecContent.js";
import Image from "../items/Image.js";

import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

import ModuleBundle from "@/items/data/ProductBundle.js";
import ModulePrice from "@/items/data/ProductPrice.js";
import Category from "@/items/Category.js";

import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import U from "@/U.js";
import CollectionUpdater from "./tools/CollectionUpdater.js";

export default {
	init(Stores) {
		const categoryStore = Stores.category;

		const productStore = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => productStore.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("productv2/list/").send();
						const error = api.getError();
						const contents = api.getContent();
						if (error) throw new Error(error);
						if (!Array.isArray(contents)) throw new Error("content is not array");
						return Promise.all(
							contents.map((content) => new Product(Stores).fromData(content)),
						);
					})
					.setData((data) => {
						productStore.commit("items", Array.isArray(data) ? data : []);
						productStore.commit("lastModified", Date.now());
					})
					.getData(() => productStore.getters.items),
				items: [],
				processor: new Processor(),
			},
			mutations: {
				lastModified: (state, time) => (state.lastModified = time),
				items: (state, items) => (state.items = items),
			},
			getters: {
				lastModified: (state) => state.lastModified,
				isLoading: (state) => state.processor.isLoading(),
				items: (state) => state.items,
			},
			actions: {
				async refresh(context) {
					return await context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("getItems");
					});
				},

				async getItems(context) {
					return context.state.processor.acquire("getItems", async () => {
						return context.state.dataLoader.data();
					});
				},
				async getItemOfId(context, id = "") {
					return context.state.processor.acquire("getItemOfId", async () => {
						let items = await context.dispatch("getItems");
						let item = items.find((item) => item.id === id);
						if (!item) {
							items = await context.dispatch("refresh");
							item = items.find((item) => item.id === id);
						}
						return item;
					});
				},

				async getGroupsByCategory(context) {
					const items = await context.dispatch("getItems");

					const categoryOther = await categoryStore.dispatch(
						"getItemOfKey",
						Category.Key.Other,
					);

					const groups = [];
					for (const item of items) {
						let category = await item.fetchCategory();
						if (!category) category = categoryOther;
						let categoryId = category ? category.id : "";

						let group = groups.find((group) => {
							return group.category.id === categoryId;
						});

						if (!group) {
							groups.push((group = { category, items: [] }));
						}

						group.items.push(item);
					}

					return groups;
				},
				async getGroupsByBrand(context) {
					const items = await context.dispatch("getItems");

					const groups = [];
					for (const item of items) {
						let group = groups.find((group) => {
							const brandId = group.brand ? group.brand.id : "";
							return brandId === item.brandId;
						});

						let brand = await item.fetchBrand();
						if (!group) {
							groups.push((group = { brand, items: [] }));
						}

						group.items.push(item);
					}

					return groups;
				},

				async addItem(context, arg = { data }) {
					return context.state.processor
						.acquire("addItem", async () => {
							let { data } = arg;
							if (!data) throw new Error("data not valid");
							let api = await ApiHost.request()
								.POST()
								.url("productv2/")
								.body({ content: data })
								.send();
							let error = api.getError();
							let content = api.getContent();
							if (error) throw new Error(error);
							return new CollectionUpdater(context)
								.toAdd()
								.withItem(new Product(Stores).fromData(content))
								.commitThenGetItem();
						})
						.catch((error) => {
							console.error(error);
							throw error;
						});
				},
				async removeItemOfId(context, arg = { id }) {
					return context.state.processor.acquire("removeItemOfId", async () => {
						let { id } = arg;
						let api = await ApiHost.request()
							.DELETE()
							.url(`productv2/id/${id}`)
							.body({ id })
							.send();
						let error = api.getError();
						if (error) throw new Error(error);
						let items = context.state.items.filter((item) => {
							return item.id !== id;
						});
						context.commit("items", items);
						context.commit("lastModified", Date.now());
						return true;
					});
				},

				async onUpdateItem(context, arg = { id, callback }) {
					return context.state.processor.acquire("onUpdateItem", async () => {
						let { id, callback } = arg;
						let item = await context.dispatch("getItemOfId", id);
						if (item) callback(item);
						return item;
					});
				},

				async updateTitleOfId(context, arg = { id, title }) {
					return context.state.processor.acquire("updateTitleOfId", async () => {
						let { id, title } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/title/")
							.body({ content: { productId: id, title } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.title = U.optString(content.title);
							},
						});
						return item;
					});
				},
				async updateDescriptionOfId(context, arg = { id, description }) {
					return context.state.processor.acquire("updateDescriptionOfId", async () => {
						let { id, description } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/description/")
							.body({ content: { productId: id, description } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.description = U.isString(content.description)
									? content.description.trim()
									: "";
							},
						});
						return item;
					});
				},
				async updateBrandIdOfId(context, arg = { id, brandId }) {
					return context.state.processor.acquire("updateBrandIdOfId", async () => {
						let { id, brandId } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/brandId/")
							.body({ content: { productId: id, brandId } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => item.setBrandId(content.brandId),
						});
						return item;
					});
				},
				async updateCategoryIdOfId(context, arg = { id, categoryId }) {
					return context.state.processor.acquire("updateCategoryIdOfId", async () => {
						let { id, categoryId } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/categoryId/")
							.body({ content: { productId: id, categoryId } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => item.setCategoryId(content.categoryId),
						});
						return item;
					});
				},
				async updateAvailabilityOfId(context, arg = { id, isAvailable }) {
					return context.state.processor.acquire("updateAvailabilityOfId", async () => {
						let { id, isAvailable } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/isAvailable/")
							.body({ content: { productId: id, isAvailable } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.stock.isAvailable = content.isAvailable;
							},
						});
						return item;
					});
				},
				async updateSecondHandOfId(context, arg = { id, isSecondHand }) {
					return context.state.processor.acquire("updateSecondHandOfId", async () => {
						let { id, isSecondHand } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/isSecondHand/")
							.body({ content: { productId: id, isSecondHand } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.stock.isSecondHand = content.isSecondHand;
							},
						});
						return item;
					});
				},
				async updatePriceOfId(context, arg = { id, price }) {
					return context.state.processor.acquire("updatePriceOfId", async () => {
						let { id, price } = arg;
						price = ModulePrice.trim(price);

						let api = await ApiHost.request()
							.PUT()
							.url("productv2/price/")
							.body({ content: { productId: id, price } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.setPrice({
									normal: content.price.normal,
									promotion: content.price.promotion,
								});
							},
						});
						return item;
					});
				},

				async addBundleOfId(context, arg = { id, bundle }) {
					return context.state.processor.acquire("addBundleOfId", async () => {
						let { id, bundle } = arg;
						let api = await ApiHost.request()
							.POST()
							.url("productv2/bundle/")
							.body({ content: { productId: id, bundle } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => {
								item.addBundle(ModuleBundle.trim(content.bundle));
							},
						});
						return item;
					});
				},
				async removeBundleOfId(context, arg = { id, bundle }) {
					return context.state.processor.acquire("removeBundleOfId", async () => {
						let { id, bundle } = arg;
						let api = await ApiHost.request()
							.DELETE()
							.url("productv2/bundle/")
							.body({
								content: {
									productId: id,
									bundle: ModuleBundle.trim(bundle),
								},
							})
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => item.removeBundle(content.bundle),
						});
						return item;
					});
				},

				async addGiftOfId(context, arg = { id, gift }) {
					return context.state.processor.acquire("addGiftOfId", async () => {
						let { id, gift } = arg;
						let api = await ApiHost.request()
							.POST()
							.url("productv2/gift/")
							.body({ content: { productId: id, gift } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => item.addGift(content.gift),
						});
						return item;
					});
				},
				async removeGiftOfId(context, arg = { id, gift }) {
					return context.state.processor.acquire("removeGiftOfId", async () => {
						let { id, gift } = arg;
						let api = await ApiHost.request()
							.DELETE()
							.url("productv2/gift/")
							.body({ content: { productId: id, gift } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) {
							throw new Error(error);
						}
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback: (item) => item.removeGift(content.gift),
						});
						return item;
					});
				},

				async addSpecificationOfId(context, arg = { id, specification }) {
					return context.state.processor.acquire("addSpecificationOfId", async () => {
						let { id, specification } = arg;
						let api = await ApiHost.request()
							.POST()
							.url("productv2/specification/")
							.body({ content: { productId: id, specification } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback(item) {
								item.addSpecification(content.specification);
							},
						});
						return item;
					});
				},
				async removeSpecificationOfId(context, arg = { id, specification }) {
					return context.state.processor.acquire("removeSpecificationOfId", async () => {
						let { id, specification } = arg;
						specification =
							specification instanceof ProductSpecContent
								? specification.toData()
								: specification;
						specification.type = specification.key;
						let api = await ApiHost.request()
							.DELETE()
							.url("productv2/specification/")
							.body({ content: { productId: id, specification } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback(item) {
								item.removeSpecification(content.specification);
							},
						});
						return item;
					});
				},
				async updateSpecificationsOfId(context, arg = { id, specifications }) {
					return context.state.processor.acquire("updateSpecificationsOfId", async () => {
						let { id, specifications } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("productv2/specification/list")
							.body({ content: { productId: id, specifications } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback(item) {
								item.setSpecifications(content.specifications);
							},
						});
						return item;
					});
				},

				async addImageOfId(context, arg = { id, imageFile }) {
					return context.state.processor.acquire("addImageOfId", async () => {
						let { id, imageFile } = arg;
						const imageFileForm = new FormData();
						imageFileForm.append(imageFile.name, imageFile);
						let api = await ApiHost.fetch({
							method: "POST",
							url: `productv2/id/${id}/image/`,
							body: imageFileForm,
						});
						if (api.error) throw new Error(api.error);
						let { content } = api;
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback(item) {
								item.addImages(content.images);
							},
						});
						return item;
					});
				},
				async removeImageOfId(context, arg = { id, image }) {
					return context.state.processor.acquire("removeImageOfId", async () => {
						let { id, image } = arg;
						image = image instanceof Image ? image.toData() : image;
						let api = await ApiHost.request()
							.DELETE()
							.url(`productv2/id/${id}/image/`)
							.body({ content: { image } })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error(error);
						let item = await context.dispatch("onUpdateItem", {
							id: content.productId,
							callback(item) {
								item.removeImage(content.image);
							},
						});
						return item;
					});
				},
			},
		});

		return productStore;
	},
};
