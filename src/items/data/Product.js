const Text = require("./Text.js");
const Image = require("./Image.js");
const ProductStock = require("./ProductStock.js");
const ProductBundle = require("./ProductBundle.js");
const ProductPrice = require("./ProductPrice.js");
const ProductSpecification = require("./ProductSpecification.js");

const textContains = (text, keyword) => {
   return (
      typeof text == "string" &&
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
      item.specifications = (
         Array.isArray(data.specifications) ? data.specifications : []
      ).map((specification) => ProductSpecification.trim(specification));

      if (typeof data.specification === "object" && data.specification) {
         item.specifications.unshift(
            ...Object.keys(data.specification)
               .map((type) => ({ type, content: data.specification[type] }))
               .map((spec) => ProductSpecification.trim(spec))
         );
      }
   }
   static #trimImage(item, data) {
      item.images = (Array.isArray(data.images) ? data.images : [])
         .map((image) => Image.trim(image))
         .filter((image) => image);

      let dataImage =
         typeof data.image === "object" ? Image.trim(data.image) : undefined;
      if (dataImage) {
         item.images.unshift(dataImage);
      }
   }
   static #trimPrice(item, data) {
      let { prices = [] } = data.stock ? data.stock : {};
      prices = prices.filter(
         (price) => price && (price.normal || price.promotion)
      );

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
      this._id = Text.trim(data._id, data._id);
      this.title = Text.trim(data.title);
      this.description = Text.trim(data.description);
      this.categoryId = Text.trim(data.categoryId);
      this.brandId = Text.trim(data.brandId);
      this.bundles = (Array.isArray(data.bundles) ? data.bundles : []).map(
         (bundle) => ProductBundle.trim(bundle)
      );
      this.gifts = (Array.isArray(data.gifts) ? data.gifts : [])
         .map((gift) => Text.trim(gift))
         .filter((gift) => gift);
      this.stock = ProductStock.trim(
         typeof data.stock === "object" ? data.stock : {}
      );

      Product.#trimImage(this, data);
      Product.#trimSpecification(this, data);
      Product.#trimPrice(this, data);
   }
}

module.exports = Product;
