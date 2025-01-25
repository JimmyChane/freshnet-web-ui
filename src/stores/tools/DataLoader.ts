import { optArray } from '@/U';

import ValidationChecker from './ValidationChecker';

export default class DataLoader {
  private $validator: ValidationChecker;

  private _getProcessor: (() => any) | undefined;
  private _loadData: (() => Promise<any>) | undefined;
  private _setData: ((data: any) => void) | undefined;
  private _getData: (() => any) | undefined;

  constructor(arg: { timeout: number } = { timeout: 1000 * 60 * 10 }) {
    this.$validator = new ValidationChecker({ timeout: arg.timeout });
  }

  processor(callback: () => any): DataLoader {
    this._getProcessor = callback;
    return this;
  }

  loadData(callback: () => Promise<any>): DataLoader {
    this._loadData = callback;
    return this;
  }

  setData(callback: (data: any) => void): DataLoader {
    this._setData = callback;
    return this;
  }

  getData(callback: () => any): DataLoader {
    this._getData = callback;
    return this;
  }

  doTimeout(): void {
    this.$validator.resetCheckpoint();
  }

  isTimeout(): boolean {
    return !this.$validator.isValid();
  }

  async data(): Promise<any> {
    const validator = this.$validator;
    const processor = this._getProcessor?.();

    const getData = this._getData;
    const setData = this._setData;
    const loadData = this._loadData;

    if (!processor || !getData || !setData || !loadData) {
      throw new Error('DataLoader not properly initialized.');
    }

    return processor.acquire('DataLoader', async () => {
      try {
        if (validator.isValid()) return getData();

        const data = await new Promise<any>((resolve, reject) => {
          validator.resetCheckpoint();
          setData(null);
          loadData()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });

        setData(data);
        validator.makeCheckpoint();
        return getData();
      } catch (error) {
        validator.resetCheckpoint();
        setData(null);
        throw error;
      }
    });
  }
}

export function withStoreToDataLoader(getStore: () => any = () => {}) {
  return new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => getStore().state.processor)
    .setData((data: any) => {
      return getStore()
        .state.list.clear()
        .addItems(...optArray(data));
    })
    .getData(() => getStore().state.list.items);
}
