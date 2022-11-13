const Text = require("./Text.js");
const Bundle = require("./ProductBundle.js");

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
      const bundles1 = (
         Array.isArray(price1.bundles) ? price1.bundles : []
      ).filter((bundle1) =>
         (Array.isArray(price2.bundles) ? price2.bundles : []).find(
            (bundle2) => bundle2.title === bundle1.title
         )
      );
      const bundles2 = (
         Array.isArray(price2.bundles) ? price2.bundles : []
      ).filter((bundle2) =>
         (Array.isArray(price1.bundles) ? price1.bundles : []).find(
            (bundle1) => bundle1.title === bundle2.title
         )
      );

      return (
         price1.normal === price2.normal ||
         price1.promotion === price2.promotion ||
         bundles1.length === bundles2.length
      );
   }

   constructor(data = null) {
      this.normal = Text.trim(data.normal, "");
      this.promotion = Text.trim(data.promotion, "");

      // deprecated on 2022_04_09
      this.bundles = (Array.isArray(data.bundles) ? data.bundles : [])
         .map((bundle) => Bundle.trim(bundle))
         .filter((bundle) => bundle.title.length);

      if (!this.bundles.length) this.bundles = undefined;
   }
}

module.exports = ProductPrice;
