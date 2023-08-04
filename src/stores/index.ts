import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import fileStore from "@/stores/store";
import fileDatabaseStore from "@/stores/store.database";
import fileLoginStore from "@/stores/store.login";
import fileUserStore from "@/stores/store.user";
import fileSettingStore from "@/stores/store.setting";
import fileCustomerStore from "@/stores/store.customer";
import fileOrderStore from "@/stores/store.order";
import fileBrandStore from "@/stores/store.brand";
import fileSpecificationStore from "@/stores/store.specification";
import fileCategoryStore from "@/stores/store.category";
import fileServiceStore from "@/stores/store.service";
import fileProductStore from "@/stores/store.product";
import filePs2Store from "@/stores/store.ps2";

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
