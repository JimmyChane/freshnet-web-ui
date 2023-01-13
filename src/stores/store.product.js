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
import List from "./tools/List.js";

export default {
   init(Stores) {
      const categoryStore = Stores.category;

      const productStore = new Vuex.Store({
         state: {
            dataLoader: DataLoader.withStore(() => productStore).loadData(async () => {
               const api = await ApiHost.request().url("productv2/list/").send();
               const error = api.getError();
               if (error) throw new Error(error);
               return Promise.all(
                  U.optArray(api.getContent()).map((content) => {
                     return new Product(Stores).fromData(content);
                  }),
               );
            }),
            processor: new Processor(),
            list: new List(),
         },
         getters: {
            isLoading: (state) => state.processor.isLoading(),
            lastModified: (state) => state.list.lastModified,
            items: (state) => state.list.items,
         },
         actions: {
            refresh: async (context) => {
               return await context.state.processor.acquire("refresh", async () => {
                  context.state.dataLoader.doTimeout();
                  await context.dispatch("getItems");
               });
            },

            getItems: async (context) => {
               return context.state.processor.acquire("getItems", async () => {
                  return context.state.dataLoader.data();
               });
            },
            getItemOfId: async (context, id = "") => {
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

            getGroupsByCategory: async (context) => {
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
            getGroupsByBrand: async (context) => {
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

            addItem: async (context, arg = { data }) => {
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
                     const inputItem = new Product(Stores).fromData(content);
                     return context.state.list.addItem(inputItem);
                  })
                  .catch((error) => {
                     console.error(error);
                     throw error;
                  });
            },
            removeItemOfId: async (context, arg = { id }) => {
               return context.state.processor.acquire("removeItemOfId", async () => {
                  let { id } = arg;
                  let api = await ApiHost.request()
                     .DELETE()
                     .url(`productv2/id/${id}`)
                     .body({ id })
                     .send();
                  let error = api.getError();
                  if (error) throw new Error(error);
                  context.state.list.removeItemById(id);
                  return true;
               });
            },

            updateTitleOfId: async (context, arg = { id, title }) => {
               return context.state.processor.acquire("updateTitleOfId", async () => {
                  let { id, title } = arg;
                  let api = await ApiHost.request()
                     .PUT()
                     .url("productv2/title/")
                     .body({ content: { productId: id, title } })
                     .send();
                  let error = api.getError();
                  let content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.title = U.optString(content.title);
                  });
               });
            },
            updateDescriptionOfId: async (context, arg = { id, description }) => {
               return context.state.processor.acquire(
                  "updateDescriptionOfId",
                  async () => {
                     let { id, description } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("productv2/description/")
                        .body({ content: { productId: id, description } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);

                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           const { description } = content;
                           item.description = U.isString(description)
                              ? description.trim()
                              : "";
                        },
                     );
                  },
               );
            },
            updateBrandIdOfId: async (context, arg = { id, brandId }) => {
               return context.state.processor.acquire("updateBrandIdOfId", async () => {
                  let { id, brandId } = arg;
                  let api = await ApiHost.request()
                     .PUT()
                     .url("productv2/brandId/")
                     .body({ content: { productId: id, brandId } })
                     .send();
                  let error = api.getError();
                  let content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.setBrandId(content.brandId);
                  });
               });
            },
            updateCategoryIdOfId: async (context, arg = { id, categoryId }) => {
               return context.state.processor.acquire(
                  "updateCategoryIdOfId",
                  async () => {
                     let { id, categoryId } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("productv2/categoryId/")
                        .body({ content: { productId: id, categoryId } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.setCategoryId(content.categoryId);
                        },
                     );
                  },
               );
            },
            updateAvailabilityOfId: async (context, arg = { id, isAvailable }) => {
               return context.state.processor.acquire(
                  "updateAvailabilityOfId",
                  async () => {
                     let { id, isAvailable } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("productv2/isAvailable/")
                        .body({ content: { productId: id, isAvailable } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.stock.isAvailable = content.isAvailable;
                        },
                     );
                  },
               );
            },
            updateSecondHandOfId: async (context, arg = { id, isSecondHand }) => {
               return context.state.processor.acquire(
                  "updateSecondHandOfId",
                  async () => {
                     let { id, isSecondHand } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("productv2/isSecondHand/")
                        .body({ content: { productId: id, isSecondHand } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.stock.isSecondHand = content.isSecondHand;
                        },
                     );
                  },
               );
            },
            updatePriceOfId: async (context, arg = { id, price }) => {
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
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.setPrice({
                        normal: content.price.normal,
                        promotion: content.price.promotion,
                     });
                  });
               });
            },

            addBundleOfId: async (context, arg = { id, bundle }) => {
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
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.addBundle(ModuleBundle.trim(content.bundle));
                  });
               });
            },
            removeBundleOfId: async (context, arg = { id, bundle }) => {
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
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.removeBundle(content.bundle);
                  });
               });
            },

            addGiftOfId: async (context, arg = { id, gift }) => {
               return context.state.processor.acquire("addGiftOfId", async () => {
                  let { id, gift } = arg;
                  let api = await ApiHost.request()
                     .POST()
                     .url("productv2/gift/")
                     .body({ content: { productId: id, gift } })
                     .send();
                  let error = api.getError();
                  let content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.addGift(content.gift);
                  });
               });
            },
            removeGiftOfId: async (context, arg = { id, gift }) => {
               return context.state.processor.acquire("removeGiftOfId", async () => {
                  let { id, gift } = arg;
                  let api = await ApiHost.request()
                     .DELETE()
                     .url("productv2/gift/")
                     .body({ content: { productId: id, gift } })
                     .send();
                  let error = api.getError();
                  let content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.removeGift(content.gift);
                  });
               });
            },

            addSpecificationOfId: async (context, arg = { id, specification }) => {
               return context.state.processor.acquire(
                  "addSpecificationOfId",
                  async () => {
                     let { id, specification } = arg;
                     let api = await ApiHost.request()
                        .POST()
                        .url("productv2/specification/")
                        .body({ content: { productId: id, specification } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.addSpecification(content.specification);
                        },
                     );
                  },
               );
            },
            removeSpecificationOfId: async (context, arg = { id, specification }) => {
               return context.state.processor.acquire(
                  "removeSpecificationOfId",
                  async () => {
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
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.removeSpecification(content.specification);
                        },
                     );
                  },
               );
            },
            updateSpecificationsOfId: async (context, arg = { id, specifications }) => {
               return context.state.processor.acquire(
                  "updateSpecificationsOfId",
                  async () => {
                     let { id, specifications } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("productv2/specification/list")
                        .body({ content: { productId: id, specifications } })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error(error);
                     return context.state.list.updateItemById(
                        content.productId,
                        (item) => {
                           item.setSpecifications(content.specifications);
                        },
                     );
                  },
               );
            },

            addImageOfId: async (context, arg = { id, imageFile }) => {
               return context.state.processor.acquire("addImageOfId", async () => {
                  let { id, imageFile } = arg;
                  const imageFileForm = new FormData();
                  imageFileForm.append(imageFile.name, imageFile);
                  let api = await ApiHost.request()
                     .POST()
                     .url(`productv2/id/${id}/image/`)
                     .bodyObject(imageFileForm)
                     .sendNotJson();
                  if (api.error) throw new Error(api.error);
                  let { content } = api;
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.addImages(content.images);
                  });
               });
            },
            removeImageOfId: async (context, arg = { id, image }) => {
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
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.removeImage(content.image);
                  });
               });
            },
         },
      });

      return productStore;
   },
};
