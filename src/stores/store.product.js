import Product from "../items/Product.js";
import ProductSpecContent from "../items/ProductSpecContent.js";
import Image from "../items/Image.js";
import ModuleBundle from "@/items/data/ProductBundle.js";
import ModulePrice from "@/items/data/ProductPrice.js";
import Category from "@/items/Category.js";
import Vuex from "vuex";
import U from "@/U.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import ProductRequest from "@/request/Product";

const init = (Stores) => {
   const categoryStore = Stores.category;

   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await ProductRequest.list();
      return Promise.all(
         api.optArrayContent().map((content) => {
            return new Product(Stores).fromData(content);
         }),
      );
   });
   context.onGetStore(() => Stores.product);
   context.build();

   context.actions.refresh = async (context) => {
      return await context.state.processor.acquire("refresh", async () => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      });
   };
   context.actions.getItems = async (context) => {
      return context.state.processor.acquire("getItems", async () => {
         return context.state.dataLoader.data();
      });
   };
   context.actions.getItemOfId = async (context, id = "") => {
      return context.state.processor.acquire("getItemOfId", async () => {
         let items = await context.dispatch("getItems");
         let item = items.find((item) => item.id === id);
         if (!item) {
            items = await context.dispatch("refresh");
            item = items.find((item) => item.id === id);
         }
         return item;
      });
   };
   context.actions.getGroupsByCategory = async (context) => {
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
   };
   context.actions.getGroupsByBrand = async (context) => {
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
   };
   context.actions.addItem = async (context, arg = { data }) => {
      return context.state.processor.acquire("addItem", async () => {
         const { data } = arg;
         if (!data) throw new Error("data not valid");
         const api = await ProductRequest.addItem(data);
         const inputItem = new Product(Stores).fromData(api.optObjectContent());
         return context.state.list.addItem(inputItem);
      });
   };
   context.actions.removeItemOfId = async (context, arg = { id }) => {
      return context.state.processor.acquire("removeItemOfId", async () => {
         const { id } = arg;
         const api = await ProductRequest.removeItem(id);
         api.getContent();
         context.state.list.removeItemById(id);
         return true;
      });
   };
   context.actions.updateTitleOfId = async (context, arg = { id, title }) => {
      return context.state.processor.acquire("updateTitleOfId", async () => {
         const { id, title } = arg;
         const api = await ProductRequest.updateTitle(id, title);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.title = U.optString(content.title);
         });
      });
   };
   context.actions.updateDescriptionOfId = async (context, arg = { id, description }) => {
      return context.state.processor.acquire("updateDescriptionOfId", async () => {
         const { id, description } = arg;
         const api = await ProductRequest.updateDescription(id, description);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            const { description } = content;
            item.description = U.isString(description) ? description.trim() : "";
         });
      });
   };
   context.actions.updateBrandIdOfId = async (context, arg = { id, brandId }) => {
      return context.state.processor.acquire("updateBrandIdOfId", async () => {
         const { id, brandId } = arg;
         const api = await ProductRequest.updateBrand(id, brandId);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.setBrandId(content.brandId);
         });
      });
   };
   context.actions.updateCategoryIdOfId = async (context, arg = { id, categoryId }) => {
      return context.state.processor.acquire("updateCategoryIdOfId", async () => {
         const { id, categoryId } = arg;
         const api = await ProductRequest.updateCategory(id, categoryId);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.setCategoryId(content.categoryId);
         });
      });
   };
   context.actions.updateAvailabilityOfId = async (
      context,
      arg = { id, isAvailable },
   ) => {
      return context.state.processor.acquire("updateAvailabilityOfId", async () => {
         const { id, isAvailable } = arg;
         const api = await ProductRequest.updateAvailability(id, isAvailable);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.stock.isAvailable = content.isAvailable;
         });
      });
   };
   context.actions.updateSecondHandOfId = async (context, arg = { id, isSecondHand }) => {
      return context.state.processor.acquire("updateSecondHandOfId", async () => {
         const { id, isSecondHand } = arg;
         const api = await ProductRequest.updateSecondHand(id, isSecondHand);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.stock.isSecondHand = content.isSecondHand;
         });
      });
   };
   context.actions.updatePriceOfId = async (context, arg = { id, price }) => {
      return context.state.processor.acquire("updatePriceOfId", async () => {
         const { id, price } = arg;
         const api = await ProductRequest.updatePrice(id, ModulePrice.trim(price));
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.setPrice({
               normal: content.price.normal,
               promotion: content.price.promotion,
            });
         });
      });
   };
   context.actions.addBundleOfId = async (context, arg = { id, bundle }) => {
      return context.state.processor.acquire("addBundleOfId", async () => {
         const { id, bundle } = arg;
         const api = await ProductRequest.addBundle(id, bundle);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.addBundle(ModuleBundle.trim(content.bundle));
         });
      });
   };
   context.actions.removeBundleOfId = async (context, arg = { id, bundle }) => {
      return context.state.processor.acquire("removeBundleOfId", async () => {
         const { id, bundle } = arg;
         const api = await ProductRequest.removeBundle(id, bundle);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.removeBundle(content.bundle);
         });
      });
   };
   context.actions.addGiftOfId = async (context, arg = { id, gift }) => {
      return context.state.processor.acquire("addGiftOfId", async () => {
         const { id, gift } = arg;
         const api = ProductRequest.addGift(id, gift);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.addGift(content.gift);
         });
      });
   };
   context.actions.removeGiftOfId = async (context, arg = { id, gift }) => {
      return context.state.processor.acquire("removeGiftOfId", async () => {
         const { id, gift } = arg;
         const api = await ProductRequest.removeGift(id, gift);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.removeGift(content.gift);
         });
      });
   };
   context.actions.addSpecificationOfId = async (
      context,
      arg = { id, specification },
   ) => {
      return context.state.processor.acquire("addSpecificationOfId", async () => {
         const { id, specification } = arg;
         const api = await ProductRequest.addSpecification(id, specification);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.addSpecification(content.specification);
         });
      });
   };
   context.actions.removeSpecificationOfId = async (
      context,
      arg = { id, specification },
   ) => {
      return context.state.processor.acquire("removeSpecificationOfId", async () => {
         const { id } = arg;
         let { specification } = arg;
         specification =
            specification instanceof ProductSpecContent
               ? specification.toData()
               : specification;
         specification.type = specification.key;
         const api = await ProductRequest.removeSpecification(id, specification);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.removeSpecification(content.specification);
         });
      });
   };
   context.actions.updateSpecificationsOfId = async (
      context,
      arg = { id, specifications },
   ) => {
      return context.state.processor.acquire("updateSpecificationsOfId", async () => {
         const { id, specifications } = arg;
         const api = await ProductRequest.updateSpecifications(id, specifications);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.setSpecifications(content.specifications);
         });
      });
   };
   context.actions.addImageOfId = async (context, arg = { id, imageFile }) => {
      return context.state.processor.acquire("addImageOfId", async () => {
         const { id, imageFile } = arg;
         const imageFileForm = new FormData();
         imageFileForm.append(imageFile.name, imageFile);
         const api = await ProductRequest.addImage(id, imageFileForm);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.addImages(content.images);
         });
      });
   };
   context.actions.removeImageOfId = async (context, arg = { id, image }) => {
      return context.state.processor.acquire("removeImageOfId", async () => {
         const { id } = arg;
         let { image } = arg;
         image = image instanceof Image ? image.toData() : image;
         const api = await ProductRequest.removeImage(id, image);
         const content = api.optObjectContent();
         return context.state.list.updateItemById(content.productId, (item) => {
            item.removeImage(content.image);
         });
      });
   };

   return new Vuex.Store(context);
};

export default { init };
