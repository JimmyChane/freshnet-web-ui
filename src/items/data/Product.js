const Image = require("./Image.js");
const ProductStock = require("./ProductStock.js");
const ProductBundle = require("./ProductBundle.js");
const ProductPrice = require("./ProductPrice.js");
const ProductSpecification = require("./ProductSpecification.js");
const { default: U } = require("@/U.js");

const textContains = (text, keyword) => {
   return (
      U.isString(text) &&
      text.toLowerCase().replaceAll(" ", "").includes(keyword)
   );
};

class Product {
   static search(item, searches) {
      let count = 0;
      let { title, description, brand, category, specifications } = item;

      for (const keyword of searches) {
         count += textContains(title, keyword) ? 1 : 0;
         count += textContains(description, keyword) ? 1 : 0;
         count += brand && textContains(brand.title, keyword) ? 1 : 0;
         count += category && textContains(category.title, keyword) ? 1 : 0;
         for (const specContent of specifications) {
            let { type, content } = specContent;
            count += type && textContains(type.title, keyword) ? 1 : 0;
            count += textContains(content, keyword) ? 1 : 0;
         }
      }

      return { item, matchCount: count };
   }

   static #trimSpecification(item, data) {
      item.specifications = U.optArray(data.specifications).map(
         (specification) => {
            return ProductSpecification.trim(specification);
         },
      );

      if (U.isObjectOnly(data.specification)) {
         item.specifications.unshift(
            ...Object.keys(data.specification)
               .map((type) => ({ type, content: data.specification[type] }))
               .map((spec) => ProductSpecification.trim(spec)),
         );
      }
   }
   static #trimImage(item, data) {
      item.images = U.optArray(data.images)
         .map((image) => Image.trim(image))
         .filter((image) => image);

      let dataImage = U.isObject(data.image)
         ? Image.trim(data.image)
         : undefined;
      if (dataImage) {
         item.images.unshift(dataImage);
      }
   }
   static #trimPrice(item, data) {
      let { prices = [] } = data.stock ? data.stock : {};
      prices = prices.filter((price) => {
         return price?.normal || price.promotion;
      });

      if (data.price) {
         item.price = ProductPrice.trim(data.price);
         return;
      }

      if (prices.length === 0) {
         item.price = null;
      } else if (prices.length === 1) {
         item.price = ProductPrice.trim(prices[0]);
      } else {
         item.price = ProductPrice.trim(prices[prices.length - 1]);
      }
   }
   static trim(data) {
      return new Product(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.title = U.trimText(data.title);
      this.description = U.trimText(data.description);
      this.categoryId = U.trimId(data.categoryId);
      this.brandId = U.trimId(data.brandId);
      this.bundles = U.optArray(data.bundles).map((bundle) => {
         return ProductBundle.trim(bundle);
      });
      this.gifts = U.optArray(data.gifts)
         .map((gift) => U.trimText(gift))
         .filter((gift) => gift);
      this.stock = ProductStock.trim(U.optObject(data.stock));

      Product.#trimImage(this, data);
      Product.#trimSpecification(this, data);
      Product.#trimPrice(this, data);
   }
}

module.exports = Product;
