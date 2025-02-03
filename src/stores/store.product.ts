import Vuex from 'vuex';

import { isString, optArray, optString, trimText } from '@/U';
import { Brand } from '@/items/Brand';
import { Category, CategoryKey } from '@/items/Category';
import { ProductBundle } from '@/items/ProductBundle';
import { ProductPrices } from '@/items/ProductPrices';
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

import { Image } from '../items/Image';
import { Product, ProductData } from '../items/Product';
import { Specification } from '../items/Specification';
import { StoreBuilder } from './tools/StoreBuilder';

export const initProduct = (Stores: any) => {
  const categoryStore = Stores.category;

  const context = new StoreBuilder<Product>()
    .onFetchItems(async () => {
      const api = await getProductList();
      const content = optArray(api.optArrayContent());
      const promises = content.map((content) => {
        return new Product(Stores).fromData(content);
      });
      return Promise.all(promises);
    })
    .onGetStore(() => Stores.product)

    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .action('getItemOfId', async (context, id = '') => {
      let items: Product[] = await context.dispatch('getItems');
      let item: Product | undefined = items.find((item) => item.id === id);
      if (!item) {
        items = await context.dispatch('refresh');
        item = items.find((item) => item.id === id);
      }
      return item;
    })
    .action('getGroupsByCategory', async (context) => {
      const items = await context.dispatch('getItems');

      const categoryOther: Category | null = await categoryStore.dispatch(
        'getItemOfKey',
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
          return group.category.id === categoryId;
        });

        if (!group) {
          groups.push((group = { category, items: [] }));
        }

        group.items.push(item);
      }

      return groups;
    })
    .action('getGroupsByBrand', async (context) => {
      const items: Product[] = await context.dispatch('getItems');

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
          groups.push((group = { brand, items: [] }));
        }

        group.items.push(item);
      }

      return groups;
    })
    .action('addItem', async (context, arg: { data: any }) => {
      const { data } = arg;
      if (!data) throw new Error('data not valid');
      const api = await addProduct(data);
      const inputItem = new Product(Stores).fromData(
        api.optObjectContent() as ProductData,
      );
      return context.state.list.addItem(inputItem);
    })
    .action('removeItemOfId', async (context, arg: { id: string }) => {
      const { id } = arg;
      const api = await removeProduct(id);
      api.getContent();
      context.state.list.removeItemById(id);
      return true;
    })
    .action(
      'updateTitleOfId',
      async (context, arg: { id: string; title: string }) => {
        const { id, title } = arg;
        const api = await updateProductTitle(id, title);
        const content = api.optObjectContent() as {
          productId: string;
          title: string;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.title = optString(content.title);
        });
      },
    )
    .action(
      'updateDescriptionOfId',
      async (context, arg: { id: string; description: string }) => {
        const { id, description } = arg;
        const api = await updateProductDescription(id, description);
        const content = api.optObjectContent() as {
          productId: string;
          description: string;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          const { description } = content;
          item.description = isString(description) ? description.trim() : '';
        });
      },
    )
    .action(
      'updateBrandIdOfId',
      async (context, arg: { id: string; brandId: string }) => {
        const { id, brandId } = arg;
        const api = await updateProductBrand(id, brandId);
        const content = api.optObjectContent() as {
          productId: string;
          brandId: string;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.setBrandId(content.brandId);
        });
      },
    )
    .action(
      'updateCategoryIdOfId',
      async (context, arg: { id: string; categoryId: string }) => {
        const { id, categoryId } = arg;
        const api = await updateProductCategory(id, categoryId);
        const content = api.optObjectContent() as {
          productId: string;
          categoryId: string;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.setCategoryId(content.categoryId);
        });
      },
    )
    .action(
      'updateAvailabilityOfId',
      async (context, arg: { id: string; isAvailable: boolean }) => {
        const { id, isAvailable } = arg;
        const api = await updateProductAvailability(id, isAvailable);
        const content = api.optObjectContent() as {
          productId: string;
          isAvailable: boolean;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          if (item.stock) item.stock.isAvailable = content.isAvailable;
        });
      },
    )
    .action(
      'updateSecondHandOfId',
      async (context, arg: { id: string; isSecondHand: boolean }) => {
        const { id, isSecondHand } = arg;
        const api = await updateProductSecondHand(id, isSecondHand);
        const content = api.optObjectContent() as {
          productId: string;
          isSecondHand: boolean;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          if (item.stock) item.stock.isSecondHand = content.isSecondHand;
        });
      },
    )
    .action(
      'updatePriceOfId',
      async (context, arg: { id: string; price: any }) => {
        const { id, price } = arg;
        const api = await updateProductPrice(
          id,
          new ProductPrices(Stores).fromData(price).toData(),
        );

        const content = api.optObjectContent() as {
          productId: string;
          price: any;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.setPrice(
            new ProductPrices(Stores).fromData(content.price).toData(),
          );
        });
      },
    )
    .action(
      'addBundleOfId',
      async (context, arg: { id: string; bundle: any }) => {
        const { id, bundle } = arg;
        const api = await addProductBundle(id, bundle);
        const content = api.optObjectContent() as {
          productId: string;
          bundle: any;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.addBundle(
            new ProductBundle(Stores).fromData({
              title: trimText(content.bundle.title),
            }),
          );
        });
      },
    )
    .action(
      'removeBundleOfId',
      async (context, arg: { id: string; bundle: any }) => {
        const { id, bundle } = arg;
        const api = await removeProductBundle(id, bundle);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.removeBundle(content.bundle);
        });
      },
    )
    .action('addGiftOfId', async (context, arg: { id: string; gift: any }) => {
      const { id, gift } = arg;
      const api = await addProductGift(id, gift);
      const content = api.optObjectContent() as {
        productId: string;
        gift: any;
      };
      return context.state.list.updateItemById(content.productId, (item) => {
        if (!item) return;
        item.addGift(content.gift);
      });
    })
    .action(
      'removeGiftOfId',
      async (context, arg: { id: string; gift: any }) => {
        const { id, gift } = arg;
        const api = await removeProductGift(id, gift);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.removeGift(content.gift);
        });
      },
    )
    .action(
      'addSpecificationOfId',
      async (context, arg: { id: string; specification: any }) => {
        const { id, specification } = arg;
        const api = await addProductSpecification(id, specification);
        const content = api.optObjectContent() as {
          productId: string;
          specification: any;
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.addSpecification(content.specification);
        });
      },
    )
    .action(
      'removeSpecificationOfId',
      async (context, arg: { id: string; specification: any }) => {
        const { id } = arg;
        let { specification } = arg;
        specification =
          specification instanceof Specification
            ? specification.toData()
            : specification;
        specification.type = specification.key;
        const api = await removeProductSpecification(id, specification);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.removeSpecification(content.specification);
        });
      },
    )
    .action(
      'updateSpecificationsOfId',
      async (context, arg: { id: string; specifications: any[] }) => {
        const { id, specifications } = arg;
        const api = await updateProductSpecifications(id, specifications);
        const content = api.optObjectContent() as {
          productId: string;
          specifications: any[];
        };
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.setSpecifications(content.specifications);
        });
      },
    )
    .action(
      'addImageOfId',
      async (context, arg: { id: string; files: any }) => {
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
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.addImages(content.images);
        });
      },
    )
    .action(
      'removeImageOfId',
      async (context, arg: { id: string; image: any }) => {
        const { id } = arg;
        let { image } = arg;
        image = image instanceof Image ? image.toData() : image;
        const api = await removeProductImage(id, image);
        const content = api.optObjectContent();
        return context.state.list.updateItemById(content.productId, (item) => {
          if (!item) return;
          item.removeImage(content.image);
        });
      },
    )
    .build();

  return new Vuex.Store(context);
};
