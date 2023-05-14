// const Image = require("./Image.js");
const ProductStock = require("./ProductStock.js");
const ProductPrice = require("./ProductPrice.js");
const { default: U } = require("@/U.js");

class Product {
   // static #trimImage(item, data) {
   //    item.images = U.optArray(data.images)
   //       .map((image) => Image.trim(image))
   //       .filter((image) => image);

   //    let dataImage = U.isObject(data.image)
   //       ? Image.trim(data.image)
   //       : undefined;
   //    if (dataImage) {
   //       item.images.unshift(dataImage);
   //    }
   // }
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
      this.stock = ProductStock.trim(U.optObject(data.stock));

      // Product.#trimImage(this, data);
      Product.#trimPrice(this, data);
   }
}

module.exports = Product;
