import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import fileStore from "@/stores/store.js";
import fileDatabaseStore from "@/stores/store.database.js";
import fileLoginStore from "@/stores/store.login.js";
import fileUserStore from "@/stores/store.user.js";
import fileSettingStore from "@/stores/store.setting.js";
import fileCustomerStore from "@/stores/store.customer.js";
import fileOrderStore from "@/stores/store.order.js";
import fileBrandStore from "@/stores/store.brand.js";
import fileSpecificationStore from "@/stores/store.specification.js";
import fileCategoryStore from "@/stores/store.category.js";
import fileServiceStore from "@/stores/store.service.js";
import fileProductStore from "@/stores/store.product.js";
import filePs2Store from "@/stores/store.ps2.js";

const Stores: Record<string, any> = {};
Stores.store = fileStore.init(Stores);
Stores.database = fileDatabaseStore.init(Stores);
Stores.login = fileLoginStore.init(Stores);
Stores.user = fileUserStore.init(Stores);
Stores.setting = fileSettingStore.init(Stores);
Stores.customer = fileCustomerStore.init(Stores);
Stores.order = fileOrderStore.init(Stores);
Stores.brand = fileBrandStore.init(Stores);
Stores.specification = fileSpecificationStore.init(Stores);
Stores.category = fileCategoryStore.init(Stores);
Stores.service = fileServiceStore.init(Stores);
Stores.product = fileProductStore.init(Stores);
Stores.ps2 = filePs2Store.init(Stores);

Vue.prototype.store = Stores.store;
Vue.prototype.loginStore = Stores.login;
Vue.prototype.userStore = Stores.user;
Vue.prototype.categoryStore = Stores.category;
Vue.prototype.productStore = Stores.product;
Vue.prototype.customerStore = Stores.customer;
Vue.prototype.serviceStore = Stores.service;
Vue.prototype.orderStore = Stores.order;
Vue.prototype.brandStore = Stores.brand;
Vue.prototype.specificationStore = Stores.specification;
Vue.prototype.settingStore = Stores.setting;
Vue.prototype.databaseStore = Stores.database;
Vue.prototype.ps2Store = Stores.ps2;

export default Stores;
