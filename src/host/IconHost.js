import U from "@/U";
import ApiHost from "@/host/ApiHost";
export default class IconHost {
   constructor(name = "", ext = undefined) {
      if (U.isString(name)) this.name = name;
      if (U.isString(ext)) this.ext = ext;
   }

   toString() {
      return this.toUrl();
   }
   toUrl() {
      if (!U.isString(this.ext)) return ApiHost.res(`icon/${this.name}`);
      return ApiHost.res(`icon/${this.name}.${this.ext}`);
   }
   toName() {
      return this.name;
   }
}
