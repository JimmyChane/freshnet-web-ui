import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { optArray, optString, trimText } from '@/U';
import { Brand } from '@/items/Brand';
import { Category, CategoryKey } from '@/items/Category';
import { Image } from '@/items/Image';
import { Product, type ProductData } from '@/items/Product';
import { ProductBundle } from '@/items/ProductBundle';
import { ProductPrices } from '@/items/ProductPrices';
import { Specification } from '@/items/Specification';
import {
  addProduct,
  addProductBundle,
  addProductGift,
  addProductImage,
  addProductSpecification,
  getProductList,
  removeProduct,
  removeProductBundle,
  removeProductGift,
  removeProductImage,
  removeProductSpecification,
  updateProductAvailability,
  updateProductBrand,
  updateProductCategory,
  updateProductDescription,
  updateProductPrice,
  updateProductSecondHand,
  updateProductSpecifications,
  updateProductTitle,
} from '@/request/Product';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

import { useCategoryStore } from './category.store';

export const useProductStore = defineStore('product', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items as Product[])
    .loadData(async () => {
      const api = await getProductList();
      const content = optArray(api.optArrayContent());
      const promises = content.map((content) => {
        return new Product().fromData(content);
      });
      return Promise.all(promises);
    });

  const processor = ref(new Processor());
  const list = ref(new List<Product>());

  async function refresh() {
    dataLoader.doTimeout();
    return await getItems();
  }
  async function getItems() {
    // return dataLoader.data();

    const data = await dataLoader.data();
    return data.at(0);
  }
  async function getItemOfId(id: string) {
    let items: Product[] = await getItems();
    let item: Product | undefined = items.find((item) => item.id === id);
    if (!item) {
      items = await refresh();
      item = items.find((item) => item.id === id);
    }
    return item;
  }
  async function getGroupsByCategory() {
    const items = await getItems();

    const categoryOther = await useCategoryStore().getItemOfKey(
      CategoryKey.Other,
    );

    interface Group {
      category: Category;
      items: Product[];
    }

    const groups: Group[] = [];
    for (const item of items) {
      let category = await item.fetchCategory();
      if (!category) category = categoryOther;
      let categoryId = category?.id ?? '';

      let group = groups.find((group) => {
        return group.category?.id === categoryId;
      });

      if (!group) {
        groups.push((group = { category: category, items: [] }));
      }

      group.items.push(item);
    }

    return groups;
  }
  async function getGroupsByBrand() {
    const items: Product[] = await getItems();

    interface Group {
      brand: Brand | null | undefined;
      items: Product[];
    }

    const groups: Group[] = [];
    for (const item of items) {
      let group = groups.find((group) => {
        const brandId = group.brand?.id ?? '';
        return brandId === item.brandId;
      });

      let brand: Brand | null | undefined = await item.fetchBrand();
      if (!group) {
        groups.push((group = { brand: brand, items: [] }));
      }

      group.items.push(item);
    }

    return groups;
  }
  async function addItem(arg: { data: any }) {
    const { data } = arg;
    if (!data) throw new Error('data not valid');
    const api = await addProduct(data);
    const inputItem = new Product().fromData(
      api.optObjectContent() as ProductData,
    );
    return list.value.addItem(inputItem);
  }
  async function removeItemOfId(arg: { id: string }) {
    const { id } = arg;
    const api = await removeProduct(id);
    api.getContent();
    list.value.removeItemById(id);
    return true;
  }
  async function updateTitleOfId(arg: { id: string; title: string }) {
    const { id, title } = arg;
    const api = await updateProductTitle(id, title);
    const content = api.optObjectContent() as {
      productId: string;
      title: string;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.title = optString(content.title);
    });
  }
  async function updateDescriptionOfId(arg: {
    id: string;
    description: string;
  }) {
    const { id, description } = arg;
    const api = await updateProductDescription(id, description);
    const content = api.optObjectContent() as {
      productId: string;
      description: string;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      const { description } = content;
      item.description =
        typeof description === 'string' ? description.trim() : '';
    });
  }
  async function updateBrandIdOfId(arg: { id: string; brandId: string }) {
    const { id, brandId } = arg;
    const api = await updateProductBrand(id, brandId);
    const content = api.optObjectContent() as {
      productId: string;
      brandId: string;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setBrandId(content.brandId);
    });
  }
  async function updateCategoryIdOfId(arg: { id: string; categoryId: string }) {
    const { id, categoryId } = arg;
    const api = await updateProductCategory(id, categoryId);
    const content = api.optObjectContent() as {
      productId: string;
      categoryId: string;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setCategoryId(content.categoryId);
    });
  }
  async function updateAvailabilityOfId(arg: {
    id: string;
    isAvailable: boolean;
  }) {
    const { id, isAvailable } = arg;
    const api = await updateProductAvailability(id, isAvailable);
    const content = api.optObjectContent() as {
      productId: string;
      isAvailable: boolean;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      if (item.stock) item.stock.isAvailable = content.isAvailable;
    });
  }
  async function updateSecondHandOfId(arg: {
    id: string;
    isSecondHand: boolean;
  }) {
    const { id, isSecondHand } = arg;
    const api = await updateProductSecondHand(id, isSecondHand);
    const content = api.optObjectContent() as {
      productId: string;
      isSecondHand: boolean;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      if (item.stock) item.stock.isSecondHand = content.isSecondHand;
    });
  }
  async function updatePriceOfId(arg: { id: string; price: any }) {
    const { id, price } = arg;
    const api = await updateProductPrice(
      id,
      new ProductPrices().fromData(price).toData(),
    );

    const content = api.optObjectContent() as {
      productId: string;
      price: any;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setPrice(new ProductPrices().fromData(content.price).toData());
    });
  }
  async function addBundleOfId(arg: { id: string; bundle: any }) {
    const { id, bundle } = arg;
    const api = await addProductBundle(id, bundle);
    const content = api.optObjectContent() as {
      productId: string;
      bundle: any;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addBundle(
        new ProductBundle().fromData({ title: trimText(content.bundle.title) }),
      );
    });
  }
  async function removeBundleOfId(arg: { id: string; bundle: any }) {
    const { id, bundle } = arg;
    const api = await removeProductBundle(id, bundle);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeBundle(content.bundle);
    });
  }
  async function addGiftOfId(arg: { id: string; gift: any }) {
    const { id, gift } = arg;
    const api = await addProductGift(id, gift);
    const content = api.optObjectContent() as {
      productId: string;
      gift: any;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addGift(content.gift);
    });
  }
  async function removeGiftOfId(arg: { id: string; gift: any }) {
    const { id, gift } = arg;
    const api = await removeProductGift(id, gift);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeGift(content.gift);
    });
  }

  async function addSpecificationOfId(arg: { id: string; specification: any }) {
    const { id, specification } = arg;
    const api = await addProductSpecification(id, specification);
    const content = api.optObjectContent() as {
      productId: string;
      specification: any;
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addSpecification(content.specification);
    });
  }
  async function removeSpecificationOfId(arg: {
    id: string;
    specification: any;
  }) {
    const { id } = arg;
    let { specification } = arg;
    specification =
      specification instanceof Specification
        ? specification.toData()
        : specification;
    specification.type = specification.key;
    const api = await removeProductSpecification(id, specification);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeSpecification(content.specification);
    });
  }
  async function updateSpecificationsOfId(arg: {
    id: string;
    specifications: any[];
  }) {
    const { id, specifications } = arg;
    const api = await updateProductSpecifications(id, specifications);
    const content = api.optObjectContent() as {
      productId: string;
      specifications: any[];
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setSpecifications(content.specifications);
    });
  }
  async function addImageOfId(arg: { id: string; files: any }) {
    const { id, files } = arg;

    const imageFileForm = new FormData();
    for (const file of files) {
      imageFileForm.append(file.name, file);
    }

    const api = await addProductImage(id, imageFileForm);
    const content = api.optObjectContent() as {
      productId: string;
      images: any[];
    };
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addImages(content.images);
    });
  }
  async function removeImageOfId(arg: { id: string; image: any }) {
    const { id } = arg;
    let { image } = arg;
    image = image instanceof Image ? image.toData() : image;
    const api = await removeProductImage(id, image);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeImage(content.image);
    });
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getGroupsByCategory,
    getGroupsByBrand,
    addItem,
    removeItemOfId,
    updateTitleOfId,
    updateDescriptionOfId,
    updateBrandIdOfId,
    updateCategoryIdOfId,
    updateAvailabilityOfId,
    updateSecondHandOfId,
    updatePriceOfId,
    addBundleOfId,
    removeBundleOfId,
    addGiftOfId,
    removeGiftOfId,
    addSpecificationOfId,
    removeSpecificationOfId,
    updateSpecificationsOfId,
    addImageOfId,
    removeImageOfId,
  };
});
