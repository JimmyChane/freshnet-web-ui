import Product from "../items/Product.js";
import ProductSpecContent from "../items/ProductSpecContent.js";
import Image from "../items/Image.js";
import ModuleBundle from "@/items/data/ProductBundle.js";
import ModulePrice from "@/items/data/ProductPrice.js";
import Category from "@/items/Category.js";
import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import U from "@/U.js";
import StoreBuilder from "./tools/StoreBuilder.js";

const requestList = async () => {
   return ApiHost.request().url("productv2/list/").send();
};
const requestAddItem = async (data) => {
   return ApiHost.request().POST().url("productv2/").body({ content: data }).send();
};
const requestDeleteItem = async (id) => {
   return ApiHost.request().DELETE().url(`productv2/id/${id}`).body({ id }).send();
};
const requestUpdateTitle = async (id, title) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/title/")
      .body({ content: { productId: id, title } })
      .send();
};
const requestUpdateDescription = async (id, description) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/description/")
      .body({ content: { productId: id, description } })
      .send();
};
const requestUpdateBrand = async (id, brandId) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/brandId/")
      .body({ content: { productId: id, brandId } })
      .send();
};
const requestUpdateCategory = async (id, categoryId) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/categoryId/")
      .body({ content: { productId: id, categoryId } })
      .send();
};
const requestUpdateAvailability = async (id, isAvailable) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/isAvailable/")
      .body({ content: { productId: id, isAvailable } })
      .send();
};
const requestUpdateSecondHand = async (id, isSecondHand) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/isSecondHand/")
      .body({ content: { productId: id, isSecondHand } })
      .send();
};
const requestUpdatePrice = async (id, price) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/price/")
      .body({ content: { productId: id, price } })
      .send();
};
const requestAddBundle = async (id, bundle) => {
   return ApiHost.request()
      .POST()
      .url("productv2/bundle/")
      .body({ content: { productId: id, bundle } })
      .send();
};
const requestRemoveBundle = async (id, bundle) => {
   return ApiHost.request()
      .DELETE()
      .url("productv2/bundle/")
      .body({ content: { productId: id, bundle: ModuleBundle.trim(bundle) } })
      .send();
};
const requestAddGift = async (id, gift) => {
   return ApiHost.request()
      .POST()
      .url("productv2/gift/")
      .body({ content: { productId: id, gift } })
      .send();
};
const requestRemoveGift = async (id, gift) => {
   return ApiHost.request()
      .DELETE()
      .url("productv2/gift/")
      .body({ content: { productId: id, gift } })
      .send();
};

const requestAddSpecification = async (id, specification) => {
   return ApiHost.request()
      .POST()
      .url("productv2/specification/")
      .body({ content: { productId: id, specification } })
      .send();
};
const requestRemoveSpecification = async (id, specification) => {
   return ApiHost.request()
      .DELETE()
      .url("productv2/specification/")
      .body({ content: { productId: id, specification } })
      .send();
};
const requestUpdateSpecifications = async (id, specifications) => {
   return ApiHost.request()
      .PUT()
      .url("productv2/specification/list")
      .body({ content: { productId: id, specifications } })
      .send();
};
const requestAddImage = async (id, imageForm) => {
   return ApiHost.request()
      .POST()
      .url(`productv2/id/${id}/image/`)
      .bodyObject(imageForm)
      .sendNotJson();
};
const requestRemoveImage = async (id, image) => {
   return ApiHost.request()
      .DELETE()
      .url(`productv2/id/${id}/image/`)
      .body({ content: { image } })
      .send();
};

export default {
   init(Stores) {
      const categoryStore = Stores.category;

      const context = new StoreBuilder().onFetchItems(async () => {
         const api = await requestList();
         const error = api.getError();
         if (error) throw new Error(error);
         return Promise.all(
            U.optArray(api.getContent()).map((content) => {
               return new Product(Stores).fromData(content);
            }),
         );
      });
      context.onGetStore(() => Stores.product);
      context.build();
      context.actions = {
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
            return context.state.processor.acquire("addItem", async () => {
               const { data } = arg;
               if (!data) throw new Error("data not valid");
               const api = await requestAddItem(data);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               const inputItem = new Product(Stores).fromData(content);
               return context.state.list.addItem(inputItem);
            });
         },
         removeItemOfId: async (context, arg = { id }) => {
            return context.state.processor.acquire("removeItemOfId", async () => {
               const { id } = arg;
               const api = await requestDeleteItem(id);
               const error = api.getError();
               if (error) throw new Error(error);
               context.state.list.removeItemById(id);
               return true;
            });
         },

         updateTitleOfId: async (context, arg = { id, title }) => {
            return context.state.processor.acquire("updateTitleOfId", async () => {
               const { id, title } = arg;
               const api = await requestUpdateTitle(id, title);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.title = U.optString(content.title);
               });
            });
         },
         updateDescriptionOfId: async (context, arg = { id, description }) => {
            return context.state.processor.acquire("updateDescriptionOfId", async () => {
               const { id, description } = arg;
               const api = await requestUpdateDescription(id, description);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  const { description } = content;
                  item.description = U.isString(description) ? description.trim() : "";
               });
            });
         },
         updateBrandIdOfId: async (context, arg = { id, brandId }) => {
            return context.state.processor.acquire("updateBrandIdOfId", async () => {
               const { id, brandId } = arg;
               const api = await requestUpdateBrand(id, brandId);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.setBrandId(content.brandId);
               });
            });
         },
         updateCategoryIdOfId: async (context, arg = { id, categoryId }) => {
            return context.state.processor.acquire("updateCategoryIdOfId", async () => {
               const { id, categoryId } = arg;
               const api = await requestUpdateCategory(id, categoryId);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.setCategoryId(content.categoryId);
               });
            });
         },
         updateAvailabilityOfId: async (context, arg = { id, isAvailable }) => {
            return context.state.processor.acquire("updateAvailabilityOfId", async () => {
               const { id, isAvailable } = arg;
               const api = await requestUpdateAvailability(id, isAvailable);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.stock.isAvailable = content.isAvailable;
               });
            });
         },
         updateSecondHandOfId: async (context, arg = { id, isSecondHand }) => {
            return context.state.processor.acquire("updateSecondHandOfId", async () => {
               const { id, isSecondHand } = arg;
               const api = await requestUpdateSecondHand(id, isSecondHand);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.stock.isSecondHand = content.isSecondHand;
               });
            });
         },
         updatePriceOfId: async (context, arg = { id, price }) => {
            return context.state.processor.acquire("updatePriceOfId", async () => {
               const { id, price } = arg;
               const api = await requestUpdatePrice(id, ModulePrice.trim(price));
               const error = api.getError();
               const content = api.getContent();
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
               const { id, bundle } = arg;
               const api = await requestAddBundle(id, bundle);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.addBundle(ModuleBundle.trim(content.bundle));
               });
            });
         },
         removeBundleOfId: async (context, arg = { id, bundle }) => {
            return context.state.processor.acquire("removeBundleOfId", async () => {
               const { id, bundle } = arg;
               const api = await requestRemoveBundle(id, bundle);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.removeBundle(content.bundle);
               });
            });
         },

         addGiftOfId: async (context, arg = { id, gift }) => {
            return context.state.processor.acquire("addGiftOfId", async () => {
               const { id, gift } = arg;
               const api = requestAddGift(id, gift);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.addGift(content.gift);
               });
            });
         },
         removeGiftOfId: async (context, arg = { id, gift }) => {
            return context.state.processor.acquire("removeGiftOfId", async () => {
               const { id, gift } = arg;
               const api = await requestRemoveGift(id, gift);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.removeGift(content.gift);
               });
            });
         },

         addSpecificationOfId: async (context, arg = { id, specification }) => {
            return context.state.processor.acquire("addSpecificationOfId", async () => {
               const { id, specification } = arg;
               const api = await requestAddSpecification(id, specification);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.addSpecification(content.specification);
               });
            });
         },
         removeSpecificationOfId: async (context, arg = { id, specification }) => {
            return context.state.processor.acquire(
               "removeSpecificationOfId",
               async () => {
                  const { id } = arg;
                  let { specification } = arg;
                  specification =
                     specification instanceof ProductSpecContent
                        ? specification.toData()
                        : specification;
                  specification.type = specification.key;
                  const api = await requestRemoveSpecification(id, specification);
                  const error = api.getError();
                  const content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.removeSpecification(content.specification);
                  });
               },
            );
         },
         updateSpecificationsOfId: async (context, arg = { id, specifications }) => {
            return context.state.processor.acquire(
               "updateSpecificationsOfId",
               async () => {
                  const { id, specifications } = arg;
                  const api = await requestUpdateSpecifications(id, specifications);
                  const error = api.getError();
                  const content = api.getContent();
                  if (error) throw new Error(error);
                  return context.state.list.updateItemById(content.productId, (item) => {
                     item.setSpecifications(content.specifications);
                  });
               },
            );
         },

         addImageOfId: async (context, arg = { id, imageFile }) => {
            return context.state.processor.acquire("addImageOfId", async () => {
               const { id, imageFile } = arg;
               const imageFileForm = new FormData();
               imageFileForm.append(imageFile.name, imageFile);
               const api = await requestAddImage(id, imageFileForm);
               if (api.error) throw new Error(api.error);
               const { content } = api;
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.addImages(content.images);
               });
            });
         },
         removeImageOfId: async (context, arg = { id, image }) => {
            return context.state.processor.acquire("removeImageOfId", async () => {
               const { id } = arg;
               let { image } = arg;
               image = image instanceof Image ? image.toData() : image;
               const api = await requestRemoveImage(id, image);
               const error = api.getError();
               const content = api.getContent();
               if (error) throw new Error(error);
               return context.state.list.updateItemById(content.productId, (item) => {
                  item.removeImage(content.image);
               });
            });
         },
      };

      return new Vuex.Store(context);
   },
};
