import AppHost from "@/host/AppHost.js";

import Image from "./Image.js";
import ProductSpecContent from "./ProductSpecContent.js";
import ItemSearcher from "../objects/ItemSearcher.js";

import U from "@/U.js";
import ProductStock from "./ProductStock.js";
import ProductBundle from "./ProductBundle.js";
import ProductPrices from "./ProductPrices.js";

const textContains = ItemSearcher.textContains;

class Product {
   stores = null;
   categoryStore = null;
   productStore = null;
   brandStore = null;
   specificationStore = null;

   constructor(stores) {
      this.stores = stores;
      this.categoryStore = stores.category;
      this.productStore = stores.product;
      this.brandStore = stores.brand;
      this.specificationStore = stores.specification;
   }

   id = "";
   title = "";
   description = "";
   gifts = [];
   bundles = [];
   brandId = "";
   categoryId = "";
   specifications = [];
   images = [];
   price = null;
   stock = null;

   fromData(data) {
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
         (specification) => {
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

      const images = U.optArray(data.images);
      if (U.isObjectOnly(data.image)) images.unshift(data.image);
      this.setImages(
         images.map((image) => {
            return {
               method: U.trimId(image.method),
               path: U.trimId(image.path),
            };
         }),
      );

      const prices = U.optArray(data.stock?.prices ?? []).filter((price) => {
         return price?.normal || price.promotion;
      });
      let dataPrice = null;
      if (data.price) dataPrice = data.price;
      else if (prices.length === 1) dataPrice = prices[0];
      else if (prices.length > 1) dataPrice = prices[prices.length - 1];
      const price = dataPrice
         ? new ProductPrices(this.stores).fromData(dataPrice)
         : null;
      this.setPrice(price?.toData());

      return this;
   }
   toData() {
      return {
         _id: U.trimId(this.id),
         title: U.trimText(this.title),
         description: U.trimText(this.description),
         brandId: U.trimId(this.brandId),
         stock: this?.stock.toData() ?? {},
         categoryId: U.trimId(this.categoryId),
         gifts: this.gifts
            .map((gift) => U.trimText(gift))
            .filter((gift) => !!gift),
         bundles: this.bundles.map((bundle) => bundle.toData()),
         specification: this.specifications.reduce((obj, spec) => {
            spec[spec.type.key] = spec.content;
            return obj;
         }, {}),
         images: this.images.map((image) => image.toData()),
         price: new ProductPrices(this.stores).fromData(this.price).toData(),
      };
   }
   toCount(strs) {
      let { brand, category, specifications } = this;

      return strs.reduce((count, str) => {
         if (textContains("product", str)) count++;
         if (textContains(this.title, str)) count++;
         if (textContains(this.description, str)) count++;
         if (brand && textContains(brand.title, str)) count++;
         if (category && textContains(category.title, str)) count++;

         count += specifications.reduce((count, specContent) => {
            if (specContent.type && textContains(specContent.type.title, str))
               count++;
            if (textContains(specContent.content, str)) count++;
            return count;
         }, 0);
         return count;
      }, 0);
   }
   toImageThumbnail() {
      return this.images.length ? this.images[0] : null;
   }

   isPricePromotion() {
      let price = this.price;
      if (!price) return false;

      let normalValue = price.normal?.value ?? 0;
      let promotionValue = price.promotion?.value ?? 0;

      return (
         normalValue > 0 && promotionValue > 0 && normalValue > promotionValue
      );
   }
   isStockAvailable() {
      return this.stock?.isAvailable ?? true;
   }
   isStockSecondHand() {
      return this.stock?.isSecondHand ?? false;
   }

   compare(item) {
      let value = 0;
      if (value === 0) value = this.compareAvailable(item);
      if (value === 0) value = this.title.localeCompare(item.title);
      if (value === 0) value = this.comparePromotions(item);
      if (value === 0) value = this.compareSecondHand(item);
      if (value === 0) value = this.compareImage(item);
      if (value === 0) value = this.comparePrices(item);
      return value;
   }
   compareAvailable(item) {
      const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
      const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };
      const isAvailable1 = stock1.isAvailable ?? true;
      const isAvailable2 = stock2.isAvailable ?? true;

      if (isAvailable1 && !isAvailable2) return -1;
      if (!isAvailable1 && isAvailable2) return 1;
      return 0;
   }
   compareImage(item) {
      if (this.image && !item.image) return -1;
      if (!this.image && item.image) return 1;
      return 0;
   }
   comparePromotions(item) {
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
   comparePrices(item) {
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
   compareSecondHand(item) {
      const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
      const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };

      const isSecondHand1 = stock1.isSecondHand ?? false;
      const isSecondHand2 = stock2.isSecondHand ?? false;
      if (isSecondHand1 && !isSecondHand2) return 1;
      if (!isSecondHand1 && isSecondHand2) return -1;
      return 0;
   }

   async fetchBrand() {
      if (!this.brandId) return null;
      const brands = await this.brandStore.dispatch("getItems");
      return brands.find((brand) => brand.id === this.brandId);
   }
   async fetchFullTitle() {
      const { title } = this;
      const brand = await this.fetchBrand();
      const brandTitle = brand ? brand.title : "";

      if (!brandTitle && !title) return "";
      if (brandTitle && title) return `${brandTitle} ${title}`;
      if (title) return title;
      if (brandTitle) return brandTitle;
      return "";
   }
   async fetchCategory() {
      if (!this.categoryId) return null;
      const categories = await this.categoryStore.dispatch("getItems");
      return categories.find((category) => category.id === this.categoryId);
   }

   getPriceNormal() {
      return this.price?.normal ?? null;
   }
   getPricePromotion() {
      return this.price?.promotion ?? null;
   }
   getPriceNormalValue() {
      return this.getPriceNormal()?.value ?? 0;
   }
   getPricePromotionValue() {
      return this.getPricePromotion()?.value ?? 0;
   }
   getLink() {
      return `${AppHost.path}/item/id/${this.id}`;
   }

   setBrandId(brandId) {
      this.brandId = brandId;
      this.fetchBrand().then((brand) => (this.brand = brand));
   }
   setCategoryId(categoryId) {
      this.categoryId = categoryId;
      this.fetchCategory().then((category) => (this.category = category));
   }
   setPrice(price) {
      this.price = new ProductPrices(this.stores).fromData(price ?? {});
   }

   setImages(images) {
      this.images = images
         .filter((image) => U.isString(image.method) && U.isString(image.path))
         .map((image) => {
            return new Image().fromData({
               method: image.method,
               path: image.path,
            });
         });
   }
   addImages(images) {
      this.images.push(...images.map((data) => new Image().fromData(data)));
   }
   removeImage(image) {
      this.images = this.images.filter((thisImage) => {
         return thisImage.path !== image.path;
      });
   }

   setSpecifications(specifications = []) {
      this.specifications = specifications.map((specification) => {
         return new ProductSpecContent(this.stores).fromData({
            key: specification.type,
            content: specification.content,
         });
      });
   }
   addSpecification(specification) {
      new ProductSpecContent()
         .fromData({
            key: specification.type,
            content: specification.content,
         })
         .then((spec) => {
            this.specification.push(spec);
         });
   }
   removeSpecification(specification) {
      this.specifications = this.specifications.filter((thisSpecification) => {
         return !(
            thisSpecification.type === specification.type &&
            thisSpecification.content === specification.content
         );
      });
   }

   setBundles(data = []) {
      this.bundles = U.optArray(data).map((bundle) => {
         return new ProductBundle(this.stores).fromData(bundle).toData();
      });
   }
   addBundle(bundle) {
      this.bundles.push(bundle);
   }
   removeBundle(bundle) {
      this.bundles = this.bundles.filter((thisBundle) => {
         return thisBundle.title !== bundle.title;
      });
   }

   setGifts(data = []) {
      this.gifts = U.optArray(data)
         .map((gift) => U.trimText(gift))
         .filter((gift) => !!gift);
   }
   addGift(gift) {
      this.gifts.push(gift);
   }
   removeGift(gift) {
      this.gifts = this.gifts.filter((thisGift) => thisGift !== gift);
   }
}

export default Product;
