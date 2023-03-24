const Bundle = require("./ProductBundle.js");
const { default: U } = require("@/U.js");

class ProductPrice {
   static trim(data) {
      return new ProductPrice(data);
   }

   static hasSameContent(price1, price2) {
      return (
         price1.normal === price2.normal ||
         price1.promotion === price2.promotion
      );

      // deprecated on 2022_04_09
      const bundles1 = U.optArray(price1.bundles).filter((bundle1) => {
         return U.optArray(price2.bundles).find((bundle2) => {
            return bundle2.title === bundle1.title;
         });
      });
      const bundles2 = U.optArray(price2.bundles).filter((bundle2) => {
         return U.optArray(price1.bundles).find((bundle1) => {
            return bundle1.title === bundle2.title;
         });
      });

      return (
         price1.normal === price2.normal ||
         price1.promotion === price2.promotion ||
         bundles1.length === bundles2.length
      );
   }

   constructor(data = null) {
      this.normal = U.trimText(data.normal);
      this.promotion = U.trimText(data.promotion);

      // deprecated on 2022_04_09
      this.bundles = U.optArray(data.bundles)
         .map((bundle) => Bundle.trim(bundle))
         .filter((bundle) => bundle.title.length);

      if (!this.bundles.length) this.bundles = undefined;
   }
}

module.exports = ProductPrice;
