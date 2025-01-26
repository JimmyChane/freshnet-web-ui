import { optArray, trimId, trimText } from '@/U';
import { textContains } from '@/objects/ItemSearcher';
import { Item } from '@/stores/tools/List';

import { Category } from './Category';
import { Customer } from './Customer';
import { CustomerDeviceSpecification } from './CustomerDeviceSpecification';

interface CustomerDeviceData {
  _id: string;
  ownerCustomerId: string;
  description: string;
  categoryKey: string;
  specifications: any[];
}

export class CustomerDevice implements Item {
  stores: any = null;
  categoryStore: any = null;
  customerStore: any = null;

  constructor(stores: any) {
    this.stores = stores;
    this.categoryStore = stores.category;
    this.customerStore = stores.customer;
  }

  id: string = '';
  ownerCustomerId: string = '';
  description: string = '';
  categoryKey: string = '';
  specifications: CustomerDeviceSpecification[] = [];

  fromData(data: CustomerDeviceData): this {
    this.id = trimId(data._id);
    this.ownerCustomerId = trimId(data.ownerCustomerId);
    this.description = trimText(data.description);
    this.categoryKey = trimId(data.categoryKey);
    this.specifications = optArray(data.specifications)
      .map((specification) => {
        return new CustomerDeviceSpecification(this.stores).fromData(
          specification,
        );
      })
      .filter((specification) => {
        return specification.typeKey && specification.content;
      });

    return this;
  }

  toData(): CustomerDeviceData {
    return {
      _id: trimId(this.id),
      ownerCustomerId: trimId(this.ownerCustomerId),
      description: trimId(this.description),
      categoryKey: trimId(this.categoryKey),
      specifications: this.specifications.map((specification) => {
        return specification.toData();
      }),
    };
  }

  toCount(strs: string[]): number {
    const count = strs.reduce((count, str) => {
      if (textContains(this.ownerCustomerId, str)) count++;
      if (textContains(this.description, str)) count++;
      if (textContains(this.categoryKey, str)) count++;
      count += this.specifications.reduce((count, specification) => {
        return count + specification.toCount(strs);
      }, 0);
      return count;
    }, 0);

    return count;
  }

  compare(item: CustomerDevice): number {
    return 0;
  }

  async fetchCustomer(): Promise<Customer | undefined> {
    const customers: Customer[] = await this.customerStore.dispatch('getItems');
    return customers.find((customer) => customer.id === this.ownerCustomerId);
  }

  async fetchCategory(): Promise<Category | undefined> {
    const categories: Category[] =
      await this.categoryStore.dispatch('getItems');
    return categories.find((category) => category.key === this.categoryKey);
  }

  getUnique(): string {
    return this.id;
  }
}
