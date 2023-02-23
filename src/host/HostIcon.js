import U from "@/U";
import config from "@/../freshnet.config";

export default class IconHost {
   static url(name = "", ext = undefined) {
      const pathname = !U.isString(ext)
         ? `icon/${name}`
         : `icon/${name}.${ext}`;
      return `${config.hostRes}/${pathname}`;
   }

   constructor(name = "", ext = undefined) {
      if (U.isString(name)) this.name = name;
      if (U.isString(ext)) this.ext = ext;
   }

   toUrl() {
      return IconHost.url(this.name, this.ext);
   }
   toName() {
      return this.name;
   }
}
