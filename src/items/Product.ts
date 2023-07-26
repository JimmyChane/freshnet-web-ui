import AppHost from "@/host/AppHost";

import Image from "./Image";
import ProductSpecContent from "./ProductSpecContent";
import ItemSearcher from "../objects/ItemSearcher";

import U from "@/U";
import ProductStock from "./ProductStock";
import ProductBundle from "./ProductBundle";
import ProductPrices from "./ProductPrices";
import Brand from "./Brand";
import Category from "./Category";
import ProductPrice from "./ProductPrice";

const textContains = ItemSearcher.textContains;

export default class Product {
  stores: any;
  categoryStore: any;
  productStore: any;
  brandStore: any;
  specificationStore: any;

  constructor(stores: any) {
    this.stores = stores;
    this.categoryStore = stores.category;
    this.productStore = stores.product;
    this.brandStore = stores.brand;
    this.specificationStore = stores.specification;
  }

  id: string = "";
  title: string = "";
  description: string = "";
  gifts: string[] = [];
  bundles: any[] = [];
  brandId: string = "";
  categoryId: string = "";
  specifications: ProductSpecContent[] = [];
  images: Image[] = [];
  price: ProductPrices | null = null;
  stock: ProductStock | null = null;

  category: Category | null = null;
  brand: Brand | null = null;

  fromData(data: any): Product {
    this.id = U.trimId(data._id);
    this.title = U.trimText(data.title);
    this.description = U.trimText(data.description);
    this.stock = new ProductStock(this.stores).fromData(data.stock);
    this.setBrandId(U.trimId(data.brandId));
    this.setCategoryId(U.trimId(data.categoryId));
    this.setGifts(
      U.optArray(data.gifts)
        .map((gift) => U.trimText(gift))
        .filter((gift) => !!gift),
    );
    this.setBundles(
      U.optArray(data.bundles)
        .map((bundle) => new ProductBundle(this.stores).fromData(bundle))
        .map((bundle) => bundle.toData()),
    );

    const specifications = U.optArray(data.specifications).map(
      (specification: any) => {
        return {
          type: U.trimId(specification.type),
          content: U.trimText(specification.content),
        };
      },
    );
    if (U.isObjectOnly(data.specification)) {
      specifications.unshift(
        ...Object.keys(data.specification).map((type) => {
          return {
            type: U.trimId(type),
            content: U.trimId(data.specification[type]),
          };
        }),
      );
    }
    this.setSpecifications(specifications);

    const images: { method: string; path: string }[] = U.optArray(data.images);
    if (U.isObjectOnly(data.image)) images.unshift(data.image);
    this.setImages(
      images.map((image) => {
        return {
          method: U.trimId(image.method),
          path: U.trimId(image.path),
        };
      }),
    );

    let dataPrice = null;
    if (data.price) dataPrice = data.price;
    else {
      const prices = U.optArray(data.stock?.prices ?? []).filter(
        (price: any) => {
          return price?.normal || price.promotion;
        },
      );
      if (prices.length > 0) dataPrice = prices[prices.length - 1];
    }
    const price = dataPrice
      ? new ProductPrices(this.stores).fromData(dataPrice)
      : null;
    this.setPrice(price?.toData());

    return this;
  }
  toData(): any {
    return {
      _id: U.trimId(this.id),
      title: U.trimText(this.title),
      description: U.trimText(this.description),
      brandId: U.trimId(this.brandId),
      stock: this.stock instanceof ProductStock ? this.stock.toData() : {},
      categoryId: U.trimId(this.categoryId),
      gifts: this.gifts
        .map((gift) => U.trimText(gift))
        .filter((gift) => !!gift),
      bundles: this.bundles.map((bundle) => bundle.toData()),
      specification: this.specifications.reduce(
        (obj: Record<string, string>, spec) => {
          const data = spec.toData();
          obj[data.key ?? ""] = data.content;
          return obj;
        },
        {},
      ),
      images: this.images.map((image) => image.toData()),
      price:
        this.price instanceof ProductPrices
          ? this.price.toData()
          : new ProductPrices(this.stores).fromData(this.price ?? {}).toData(),
    };
  }

  toCount(strs: string[]): number {
    let { brand, category, specifications } = this;

    return strs.reduce((count, str) => {
      if (textContains("product", str)) count++;
      if (textContains(this.title, str)) count++;
      if (textContains(this.description, str)) count++;
      if (brand && textContains(brand.title, str)) count++;
      if (category && textContains(category.title, str)) count++;

      count += specifications.reduce((count, specContent) => {
        return count + specContent.toCount(strs);
      }, 0);
      return count;
    }, 0);
  }
  toImageThumbnail(): Image | null {
    return this.images.length ? this.images[0] : null;
  }

  isPricePromotion(): boolean {
    let price = this.price;
    if (!price) return false;

    let normalValue = price.normal?.value ?? 0;
    let promotionValue = price.promotion?.value ?? 0;

    return (
      normalValue > 0 && promotionValue > 0 && normalValue > promotionValue
    );
  }
  isStockAvailable(): boolean {
    return this.stock?.isAvailable ?? true;
  }
  isStockSecondHand(): boolean {
    return this.stock?.isSecondHand ?? false;
  }

  compare(item: Product): number {
    let value = 0;
    if (value === 0) value = this.compareAvailable(item);
    if (value === 0) value = this.title.localeCompare(item.title);
    if (value === 0) value = this.comparePromotions(item);
    if (value === 0) value = this.compareSecondHand(item);
    if (value === 0) value = this.compareImage(item);
    if (value === 0) value = this.comparePrices(item);
    return value;
  }
  compareAvailable(item: Product): number {
    const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
    const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };
    const isAvailable1 = stock1.isAvailable ?? true;
    const isAvailable2 = stock2.isAvailable ?? true;

    if (isAvailable1 && !isAvailable2) return -1;
    if (!isAvailable1 && isAvailable2) return 1;
    return 0;
  }
  compareImage(item: Product): number {
    return this.images.length - item.images.length;
  }
  comparePromotions(item: Product): number {
    let price1 = this.price;
    let price2 = item.price;

    let promotion1 = price1 ? U.optString(price1.promotion).trim() : "";
    let promotion2 = price2 ? U.optString(price2.promotion).trim() : "";

    let hasPromotion1 = promotion1.length > 0;
    let hasPromotion2 = promotion2.length > 0;

    if (hasPromotion1 && !hasPromotion2) return -1;
    if (!hasPromotion1 && hasPromotion2) return 1;
    return 0;
  }
  comparePrices(item: Product): number {
    let price1 = this.price;
    let price2 = item.price;

    let normal1 = price1 ? U.optString(price1.normal).trim() : "";
    let normal2 = price2 ? U.optString(price2.normal).trim() : "";

    if (!normal1 && normal2) return 1;
    if (normal1 && !normal2) return -1;

    if (normal1 > normal2) return -1;
    if (normal1 < normal2) return 1;
    return 0;
  }
  compareSecondHand(item: Product): number {
    const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
    const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };

    const isSecondHand1 = stock1.isSecondHand ?? false;
    const isSecondHand2 = stock2.isSecondHand ?? false;
    if (isSecondHand1 && !isSecondHand2) return 1;
    if (!isSecondHand1 && isSecondHand2) return -1;
    return 0;
  }

  async fetchBrand(): Promise<Brand | null | undefined> {
    if (!this.brandId) return null;
    const brands: Brand[] = await this.brandStore.dispatch("getItems");
    return brands.find((brand) => brand.id === this.brandId);
  }
  async fetchFullTitle(): Promise<string> {
    const { title } = this;
    const brand = await this.fetchBrand();
    const brandTitle = brand ? brand.title : "";

    if (!brandTitle && !title) return "";
    if (brandTitle && title) return `${brandTitle} ${title}`;
    if (title) return title;
    if (brandTitle) return brandTitle;
    return "";
  }
  async fetchCategory(): Promise<Category | null | undefined> {
    if (!this.categoryId) return null;
    const categories: Category[] = await this.categoryStore.dispatch(
      "getItems",
    );
    return categories.find((category) => category.id === this.categoryId);
  }

  getPriceNormal(): ProductPrice | null {
    return this.price?.normal ?? null;
  }
  getPricePromotion(): ProductPrice | null {
    return this.price?.promotion ?? null;
  }
  getPriceNormalValue(): number {
    return this.getPriceNormal()?.value ?? 0;
  }
  getPricePromotionValue(): number {
    return this.getPricePromotion()?.value ?? 0;
  }
  getLink(): string {
    return `${AppHost.path}/item/id/${this.id}`;
  }

  setBrandId(brandId: string) {
    this.brandId = brandId;
    this.fetchBrand().then((brand) => {
      this.brand = brand ?? null;
    });
  }
  setCategoryId(categoryId: string) {
    this.categoryId = categoryId;
    this.fetchCategory().then((category) => {
      this.category = category ?? null;
    });
  }
  setPrice(price: any) {
    this.price = new ProductPrices(this.stores).fromData(price ?? {});
  }

  setImages(images: (Image | any)[]) {
    this.images = images
      .filter((image) => U.isString(image.method) && U.isString(image.path))
      .map((image) => {
        return new Image().fromData({
          method: image.method,
          path: image.path,
        });
      });
  }
  addImages(images: (Image | any)[]) {
    this.images.push(...images.map((data) => new Image().fromData(data)));
  }
  removeImage(image: Image | any) {
    this.images = this.images.filter((thisImage) => {
      return thisImage.path !== image.path;
    });
  }

  setSpecifications(specifications: { type: string; content: string }[] = []) {
    this.specifications = specifications.map((specification) => {
      return new ProductSpecContent(this.stores).fromData({
        key: specification.type,
        content: specification.content,
      });
    });
  }
  addSpecification(specification: { type: string; content: string }) {
    const specContent = new ProductSpecContent(this.stores).fromData({
      key: specification.type,
      content: specification.content,
    });

    this.specifications.push(specContent);
  }
  removeSpecification(specification: { type: string; content: string }) {
    this.specifications = this.specifications.filter((thisSpecification) => {
      return !(
        thisSpecification.type === specification.type &&
        thisSpecification.content === specification.content
      );
    });
  }

  setBundles(data: (ProductBundle | any)[] = []) {
    this.bundles = U.optArray(data).map((bundle) => {
      return new ProductBundle(this.stores).fromData(bundle).toData();
    });
  }
  addBundle(bundle: ProductBundle) {
    this.bundles.push(bundle);
  }
  removeBundle(bundle: ProductBundle) {
    this.bundles = this.bundles.filter((thisBundle) => {
      return thisBundle.title !== bundle.title;
    });
  }

  setGifts(data: string[] = []) {
    this.gifts = U.optArray(data)
      .map((gift) => U.trimText(gift))
      .filter((gift) => !!gift);
  }
  addGift(gift: string) {
    this.gifts.push(gift);
  }
  removeGift(gift: string) {
    this.gifts = this.gifts.filter((thisGift) => thisGift !== gift);
  }
}
