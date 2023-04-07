import AppHost from "@/host/AppHost.js";

import ModuleProduct from "./data/Product.js";
import ModuleStock from "./data/ProductStock.js";
import ModuleBundle from "./data/ProductBundle.js";

import Image from "./Image.js";
import ProductSpecContent from "./ProductSpecContent.js";
import ProductPrice from "./ProductPrice.js";
import ItemSearcher from "../objects/ItemSearcher.js";

import U from "@/U.js";

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
   stock = ModuleStock.trim({});

   fromData(data) {
      data = ModuleProduct.trim(data);

      if (U.isObject(data.image) && data.image) data.images.push(data.image);

      this.id = data._id;
      this.title = U.optString(data.title);
      this.description = U.optString(data.description).trim();
      this.setGifts(data.gifts);
      this.setBundles(data.bundles);
      this.setBrandId(data.brandId);
      this.setCategoryId(data.categoryId);
      this.setSpecifications(data.specifications);
      this.setImages(data.images);
      this.setPrice(data.price);

      this.stock = data.stock;

      return this;
   }
   toData() {
      let specification = {};
      for (let itemSpecification of this.specifications) {
         specification[itemSpecification.type.key] = itemSpecification.content;
      }

      let price = this.price ? this.price : {};
      let pricePromotion = price.promotion;
      let priceNormal = price.normal;

      return {
         _id: this.id,
         title: this.title ? this.title : undefined,
         description: this.description ? this.description : undefined,
         brandId: U.optString(this.brandId),
         categoryId: U.optString(this.categoryId),
         stock: ModuleStock.trim(this.stock),
         gifts: this.gifts.map((gift) => gift),
         bundles: this.bundles.map((bundle) => ModuleBundle.trim(bundle)),
         image: this.image ? this.image.toData() : {},
         specification,
         price: { normal: pricePromotion, promotion: priceNormal },
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

   getPriceNormal() {
      return this.price ? this.price.normal : null;
   }
   getPricePromotion() {
      return this.price ? this.price.promotion : null;
   }
   getPriceNormalValue() {
      const normal = this.getPriceNormal();
      return normal ? normal.value : 0;
   }
   getPricePromotionValue() {
      const promotion = this.getPricePromotion();
      return promotion ? promotion.value : 0;
   }
   getLink() {
      return `${AppHost.path}/item/id/${this.id}`;
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

   isPricePromotion() {
      let price = this.price;
      if (!price) return false;

      let normalValue = price.normal ? price.normal.value : 0;
      let promotionValue = price.normal ? price.promotion.value : 0;

      return (
         normalValue > 0 && promotionValue > 0 && normalValue > promotionValue
      );
   }
   isStockAvailable() {
      let stock = this.stock;
      return stock ? stock.isAvailable : true;
   }
   isStockSecondHand() {
      let stock = this.stock;
      return stock ? stock.isSecondHand : false;
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
      const { normal, promotion } = U.optObjectOnly(price);
      this.price = {
         normal: ProductPrice.parseString(U.optString(normal)),
         promotion: ProductPrice.parseString(U.optString(promotion)),
      };
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
         return ModuleBundle.trim(bundle);
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
         .map((gift) => (U.isString(gift) ? gift.trim() : ""))
         .filter((gift) => gift);
   }
   addGift(gift) {
      this.gifts.push(gift);
   }
   removeGift(gift) {
      this.gifts = this.gifts.filter((thisGift) => thisGift !== gift);
   }
}

export default Product;
