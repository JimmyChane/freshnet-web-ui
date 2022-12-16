import DataLoader from "./tools/DataLoader";
import CollectionUpdater from "./tools/CollectionUpdater";
import Processor from "./tools/Processor.js";

import Service from "@/items/Service.js";
import ServiceCustomer from "@/items/ServiceCustomer";
import ServiceImage from "@/items/ServiceImage";

import Vuex from "vuex";
import ServiceModule from "@/items/data/Service.js";
import ApiHost from "@/host/ApiHost.js";

class Event {
	constructor(key, manager) {}
}
const events = [
	new Event("service", "item-add"),
	new Event("service", "item-remove"),
	new Event("service", "item-image-add"),
	new Event("service", "item-image-remove"),
	new Event("service", "item-event-add"),
	new Event("service", "item-event-remove"),
	new Event("service", "item-label-add"),
	new Event("service", "item-label-remove"),
	new Event("service", "item-state-update"),
	new Event("service", "item-description-update"),
	new Event("service", "item-belongings-update"),
	new Event("service", "item-customer-update"),
];

export default {
	init(Stores) {
		const storeService = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => storeService.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("service_v2/get/items").send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						const contents = Array.isArray(content) ? content : [];
						const items = contents.map((content) => {
							return new Service(Stores).fromData(content);
						});
						return items;
					})
					.setData((data) => {
						storeService.commit("items", Array.isArray(data) ? data : []);
						storeService.commit("lastModified", Date.now());
					})
					.getData(() => storeService.getters.items),
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
				items(state) {
					return (Array.isArray(state.items) ? state.items : [])
						.map((service) => {
							if (Array.isArray(service.events))
								service.events.sort((event1, event2) => event1.compare(event2));
							return service;
						})
						.sort((service1, service2) => service1.compare(service2));
				},
			},
			actions: {
				// socketNotify(context, data) {
				// 	const { key, content } = data;
				// 	console.log("service", { key, content });

				// 	if (key === "item-add") {
				// 		let service = new Service(Stores).fromData(content);
				// 		new CollectionUpdater(context).onId((item) => item.id).getItem(service);
				// 	}
				// },

				async refresh(context) {
					return context.state.processor.acquire("refresh", async () => {
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
						let items = await context.dispatch("getServices");
						return items.find((service) => service.id === id);
					});
				},

				async getGroupsByCustomer(context) {
					const items = await context.dispatch("getItems");
					const groups = items.reduce((groups, item) => {
						let group = groups.find((group) => {
							return group.customer.isEqual(item.customer);
						});

						if (!group) {
							group = { customer: item.customer, items: [] };
							groups.push(group);
						}

						group.items.push(item);
						return groups;
					}, []);

					return groups;
				},

				async importItem(context, arg = { data }) {
					return context.state.processor.acquire("importItem", async () => {
						let { data } = arg;
						if (!data) throw new Error();
						let service = ServiceModule.trim(data);
						let api = await ApiHost.request()
							.POST()
							.url("service_v2/import/item/")
							.body({ content: service })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error();
						service = new Service(Stores).fromData(content);
						let items = context.getters.items;
						items.push(service);
						context.commit("items", items);
						context.commit("lastModified", Date.now());
						return service;
					});
				},

				async addItem(context, arg = { data }) {
					return context.state.processor.acquire("addItem", async () => {
						let { data } = arg;
						if (!data) return null;
						if (!data) throw new Error("invalid data");
						let images =
							!Array.isArray(data.imageFiles) || data.imageFiles.length <= 0
								? []
								: await ApiHost.imgFile
										.upload(data.imageFiles)
										.then((json) => json.content);
						data.imageFiles = images;
						let api = await ApiHost.request()
							.POST()
							.url("service_v2/add/item/")
							.body({ content: data })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error();
						let service = new Service(Stores).fromData(content);

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.getItem(service);
					});
				},
				async removeItemOfId(context, arg = { id }) {
					return context.state.processor.acquire("removeItemOfId", async () => {
						let { id } = arg;
						let api = await ApiHost.request()
							.DELETE()
							.url(`service_v2/delete/item/${id}`)
							.send();
						let error = api.getError();
						if (error) throw new Error();
						let found = context.state.items.find((service) => service.id === id);
						if (!found) throw new Error();
						let items = context.state.items;
						items.splice(items.indexOf(found), 1);
						context.commit("items", items);
						context.commit("lastModified", Date.now());
					});
				},
				async updateStateOfId(context, arg = { serviceID, state }) {
					return context.state.processor.acquire("updateStateOfId", async () => {
						let { serviceID, state } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url(`service_v2/item/${serviceID}/update/state/`)
							.body({ content: state })
							.send();
						let error = api.getError();
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => (item.state = state))
							.getItemById(serviceID);
					});
				},
				async updateDescriptionOfId(context, arg = { serviceID, description }) {
					return context.state.processor.acquire(
						"updateDescriptionOfId",
						async () => {
							let { serviceID, description } = arg;
							let api = await ApiHost.request()
								.PUT()
								.url(`service_v2/item/${serviceID}/update/description/`)
								.body({ content: description })
								.send();
							let error = api.getError();
							if (error) throw new Error();

							return new CollectionUpdater(context)
								.onId((item) => item.id)
								.onUpdate((item) => (item.description = description))
								.getItemById(serviceID);
						},
					);
				},
				async updateBelongingsOfId(context, arg = { serviceID, belongings }) {
					return context.state.processor.acquire(
						"updateBelongingsOfId",
						async () => {
							let { serviceID, belongings } = arg;
							let api = await ApiHost.request()
								.PUT()
								.url(`service_v2/item/${serviceID}/update/belonging/`)
								.body({ content: belongings })
								.send();
							let error = api.getError();
							let content = api.getContent();
							if (error) throw new Error();

							return new CollectionUpdater(context)
								.onId((item) => item.id)
								.onUpdate((item) => (item.belongings = content.belongings))
								.getItemById(serviceID);
						},
					);
				},
				async updateCustomerOfId(context, arg = { serviceID, customer }) {
					return context.state.processor.acquire("updateCustomerOfId", async () => {
						let { serviceID, customer } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url(`service_v2/item/${serviceID}/update/customer/`)
							.body({ content: customer })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => {
								return (item.customer = new ServiceCustomer(Stores).fromData(
									content.customer,
								));
							})
							.getItemById(serviceID);
					});
				},

				async addEventToId(context, arg = { serviceID, data }) {
					return context.state.processor.acquire("addEventToId", async () => {
						let { serviceID, data } = arg;
						if (!serviceID || !data) return null;
						let api = await ApiHost.request()
							.POST()
							.url(`service_v2/item/${serviceID}/add/event/`)
							.body({ content: data })
							.send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error();

						let serviceParse = new Service(Stores).fromData(content);

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item1, item2) => {
								item1.events = item2.events.sort((event1, event2) =>
									event1.compare(event2),
								);
							})
							.getItem(serviceParse);
					});
				},
				async removeEventFromId(context, arg = { serviceID, time }) {
					return context.state.processor.acquire("removeEventFromId", async () => {
						let { serviceID, time } = arg;
						let api = await ApiHost.request()
							.DELETE()
							.url(`service_v2/item/${serviceID}/delete/event/`)
							.body({ serviceID, time })
							.send();
						let error = api.getError();
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => {
								item.events = item.events.filter((event) => {
									return event.timestamp.time !== time;
								});
							})
							.getItemById(serviceID);
					});
				},

				async updateUrgentOfId(context, arg = { serviceID, isUrgent }) {
					console.warn("updateUrgentOfId is deprecated, please use addLabelToId");
					return context.state.processor.acquire("updateUrgentOfId", async () => {
						let { serviceID, isUrgent } = arg;
						const api = await ApiHost.request()
							.PUT()
							.url("service/urgent")
							.body({ serviceID, isUrgent })
							.send();

						let error = api.getError();
						if (error) throw new Error();
						const content = api.getContent();

						let service = new Service(Stores).fromData(content);
						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => item.setUrgent(service.isUrgent()))
							.getItemById(service.id);
					});
				},
				async updateWarrantyOfId(context, arg = { serviceID, isWarranty }) {
					console.warn("updateWarrantyOfId is deprecated, please use addLabelToId");
					return context.state.processor.acquire("updateWarrantyOfId", async () => {
						let { serviceID, isWarranty } = arg;
						const api = await ApiHost.request()
							.PUT()
							.url("service/warranty")
							.body({ serviceID, isWarranty })
							.send();

						let error = api.getError();
						if (error) throw new Error();
						const content = api.getContent();

						let service = new Service(Stores).fromData(content);
						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => item.setWarranty(service.isWarranty()))
							.getItemById(service.id);
					});
				},

				async addLabelToId(context, arg = { serviceID, label }) {
					return context.state.processor.acquire("addLabelToId", async () => {
						let { serviceID, label } = arg;
						const api = await ApiHost.request()
							.POST()
							.url(`service_v2/item/${serviceID}/add/label/`)
							.body({ label })
							.send();

						let error = api.getError();
						if (error) throw new Error(error);
						const content = api.getContent();
						console.warn(content);
					});
				},
				async removeLabelFromId(context, arg = { serviceID, label }) {
					return context.state.processor.acquire("removeLabelFromId", async () => {
						let { serviceID, label } = arg;
						const api = await ApiHost.request()
							.DELETE()
							.url(`service_v2/item/${serviceID}/delete/label/`)
							.body({ label: label.toData() })
							.send();

						let error = api.getError();
						if (error) throw new Error(error);
						const content = api.getContent();

						let service = new Service(Stores).fromData(content);
						let items = context.state.items;
						let item = items.find((item) => {
							return item.id === service.id;
						});

						if (!item) {
							items.push(service);
							item = service;
						} else {
							item.setLabels(service.labels);
						}

						context.commit("items", items);
						context.commit("lastModified", Date.now());

						return item;
					});
				},

				async addImageToId(context, arg = { serviceID, imageFile }) {
					return context.state.processor.acquire("addImageToId", async () => {
						const { serviceID, imageFile } = arg;
						const imageFileForm = new FormData();
						imageFileForm.append(imageFile.name, imageFile);
						const api = await ApiHost.fetch({
							method: "POST",
							url: `service_v2/item/${serviceID}/add/image_files/`,
							body: imageFileForm,
						});
						if (api.error) throw new Error(api.error);
						const { content } = api;
						const { items, fail_count } = content;

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) =>
								item.imageFiles.push(
									...items.map((image) => new ServiceImage().fromData(image)),
								),
							)
							.getItemById(serviceID);
					});
				},
				async removeImageFromId(context, arg = { serviceID, image }) {
					return context.state.processor.acquire("removeImageFromId", async () => {
						let { serviceID, image } = arg;
						// let api = await ApiHost.imgFile.remove(image.name);
						// if (api.error) throw new Error();
						let api = ApiHost.request()
							.DELETE()
							.url(`service_v2/item/${serviceID}/delete/image/`)
							.body({ content: image.toData() })
							.send();
						let error = api.error;
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.onId((item) => item.id)
							.onUpdate((item) => {
								item.imageFiles = item.imageFiles.filter(
									(imageFile) => imageFile.name !== image.name,
								);
							})
							.getItemById(serviceID);
					});
				},
			},
		});

		return storeService;
	},
};
