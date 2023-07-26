import Product from "../items/Product.js";
import ProductSpecContent from "../items/ProductSpecContent.js";
import Image from "../items/Image.js";
import Category from "@/items/Category.js";
import Vuex from "vuex";
import U from "@/U.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import ProductRequest from "@/request/Product";
import ProductPrices from "@/items/ProductPrices.js";
import ProductBundle from "@/items/ProductBundle.js";
const init = (Stores) => {
    const categoryStore = Stores.category;
    const context = new StoreBuilder()
        .onFetchItems(async () => {
        const api = await ProductRequest.list();
        const content = api.optArrayContent();
        const promises = content.map((content) => {
            return new Product(Stores).fromData(content);
        });
        return Promise.all(promises);
    })
        .onGetStore(() => Stores.product)
        .action("refresh", async (context) => {
        context.state.dataLoader.doTimeout();
        await context.dispatch("getItems");
    })
        .action("getItems", async (context) => {
        return context.state.dataLoader.data();
    })
        .action("getItemOfId", async (context, id = "") => {
        let items = await context.dispatch("getItems");
        let item = items.find((item) => item.id === id);
        if (!item) {
            items = await context.dispatch("refresh");
            item = items.find((item) => item.id === id);
        }
        return item;
    })
        .action("getGroupsByCategory", async (context) => {
        const items = await context.dispatch("getItems");
        const categoryOther = await categoryStore.dispatch("getItemOfKey", Category.Key.Other);
        const groups = [];
        for (const item of items) {
            let category = await item.fetchCategory();
            if (!category)
                category = categoryOther;
            let categoryId = category?.id ?? "";
            let group = groups.find((group) => {
                return group.category.id === categoryId;
            });
            if (!group) {
                groups.push((group = { category, items: [] }));
            }
            group.items.push(item);
        }
        return groups;
    })
        .action("getGroupsByBrand", async (context) => {
        const items = await context.dispatch("getItems");
        const groups = [];
        for (const item of items) {
            let group = groups.find((group) => {
                const brandId = group.brand?.id ?? "";
                return brandId === item.brandId;
            });
            let brand = await item.fetchBrand();
            if (!group) {
                groups.push((group = { brand, items: [] }));
            }
            group.items.push(item);
        }
        return groups;
    })
        .action("addItem", async (context, arg) => {
        const { data } = arg;
        if (!data)
            throw new Error("data not valid");
        const api = await ProductRequest.addItem(data);
        const inputItem = new Product(Stores).fromData(api.optObjectContent());
        return context.state.list.addItem(inputItem);
    })
        .action("removeItemOfId", async (context, arg) => {
        const { id } = arg;
        const api = await ProductRequest.removeItem(id);
        api.getContent();
        context.state.list.removeItemById(id);
        return true;
    })
        .action("updateTitleOfId", async (context, arg) => {
        const { id, title } = arg;
        const api = await ProductRequest.updateTitle(id, title);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.title = U.optString(content.title);
        });
    })
        .action("updateDescriptionOfId", async (context, arg) => {
        const { id, description } = arg;
        const api = await ProductRequest.updateDescription(id, description);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            const { description } = content;
            item.description = U.isString(description)
                ? description.trim()
                : "";
        });
    })
        .action("updateBrandIdOfId", async (context, arg) => {
        const { id, brandId } = arg;
        const api = await ProductRequest.updateBrand(id, brandId);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.setBrandId(content.brandId);
        });
    })
        .action("updateCategoryIdOfId", async (context, arg) => {
        const { id, categoryId } = arg;
        const api = await ProductRequest.updateCategory(id, categoryId);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.setCategoryId(content.categoryId);
        });
    })
        .action("updateAvailabilityOfId", async (context, arg) => {
        const { id, isAvailable } = arg;
        const api = await ProductRequest.updateAvailability(id, isAvailable);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            if (item.stock)
                item.stock.isAvailable = content.isAvailable;
        });
    })
        .action("updateSecondHandOfId", async (context, arg) => {
        const { id, isSecondHand } = arg;
        const api = await ProductRequest.updateSecondHand(id, isSecondHand);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            if (item.stock)
                item.stock.isSecondHand = content.isSecondHand;
        });
    })
        .action("updatePriceOfId", async (context, arg) => {
        const { id, price } = arg;
        const api = await ProductRequest.updatePrice(id, new ProductPrices(Stores).fromData(price).toData());
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.setPrice(new ProductPrices(Stores).fromData(content.price).toData());
        });
    })
        .action("addBundleOfId", async (context, arg) => {
        const { id, bundle } = arg;
        const api = await ProductRequest.addBundle(id, bundle);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.addBundle(new ProductBundle(Stores).fromData({
                title: U.trimText(content.bundle.title),
            }));
        });
    })
        .action("removeBundleOfId", async (context, arg) => {
        const { id, bundle } = arg;
        const api = await ProductRequest.removeBundle(id, bundle);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.removeBundle(content.bundle);
        });
    })
        .action("addGiftOfId", async (context, arg) => {
        const { id, gift } = arg;
        const api = await ProductRequest.addGift(id, gift);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.addGift(content.gift);
        });
    })
        .action("removeGiftOfId", async (context, arg) => {
        const { id, gift } = arg;
        const api = await ProductRequest.removeGift(id, gift);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.removeGift(content.gift);
        });
    })
        .action("addSpecificationOfId", async (context, arg) => {
        const { id, specification } = arg;
        const api = await ProductRequest.addSpecification(id, specification);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.addSpecification(content.specification);
        });
    })
        .action("removeSpecificationOfId", async (context, arg) => {
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
    })
        .action("updateSpecificationsOfId", async (context, arg) => {
        const { id, specifications } = arg;
        const api = await ProductRequest.updateSpecifications(id, specifications);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.setSpecifications(content.specifications);
        });
    })
        .action("addImageOfId", async (context, arg) => {
        const { id, files } = arg;
        const imageFileForm = new FormData();
        for (const file of files) {
            imageFileForm.append(file.name, file);
        }
        const api = await ProductRequest.addImage(id, imageFileForm);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.addImages(content.images);
        });
    })
        .action("removeImageOfId", async (context, arg) => {
        const { id } = arg;
        let { image } = arg;
        image = image instanceof Image ? image.toData() : image;
        const api = await ProductRequest.removeImage(id, image);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
            item.removeImage(content.image);
        });
    })
        .build();
    return new Vuex.Store(context);
};
export default { init };
