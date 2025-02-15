import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { optArray } from '@/U';
import { Contact } from '@/items/Contact';
import { Setting, SettingKey, SettingVisibility } from '@/items/Setting';
import { WorkingDay, type WorkingDayData } from '@/items/WorkingDay';
import { getSettingList, updateSetting } from '@/request/Setting';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

function isPredefinedSetting(key: string): boolean {
  return [
    SettingKey.Contacts,
    SettingKey.CompanyName,
    SettingKey.CompanyCategory,
    SettingKey.CompanyWorkingHours,
  ].includes(key as SettingKey);
}

export const useSettingStore = defineStore('setting', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getSettingList();
      const list = optArray(api.optArrayContent());
      const items = list.map((content) => {
        return new Setting().fromData(content);
      });

      const contacts = [
        new Contact({
          title: 'Beh Aik Keong',
          links: [
            { category: 'call', id: '0167959444' },
            { category: 'whatsapp', id: '0167959444' },
          ],
        }),
        new Contact({
          title: 'Office (Mobile)',
          links: [
            { category: 'call', id: '0146315353' },
            { category: 'whatsapp', id: '0146315353' },
            { category: 'telegram', id: 'FreshnetEnterprise' },
          ],
        }),
        new Contact({
          title: 'Office',
          links: [{ category: 'telephone', id: '0332897297' }],
        }),
      ];

      const workingDayDatas: WorkingDayData[] = [
        { title: 'Monday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Tuesday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Wednesday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Thursday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Friday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Saturday', timeStart: '0900', timeEnd: '1900' },
        { title: 'Sunday', timeStart: '1000', timeEnd: '1830' },
      ];
      const days = workingDayDatas.reduce((workingDays: WorkingDay[], data) => {
        workingDays.push(new WorkingDay(data, workingDays));
        return workingDays;
      }, []);

      return [
        ...items.filter((item) => !isPredefinedSetting(item.key)),
        new Setting().fromData({
          key: SettingKey.CompanyWorkingHours,
          visibility: SettingVisibility.Protected,
          value: days,
        }),
        new Setting().fromData({
          key: SettingKey.Contacts,
          visibility: SettingVisibility.Protected,
          value: contacts,
        }),
        new Setting().fromData({
          key: SettingKey.CompanyName,
          visibility: SettingVisibility.Protected,
          value: 'Freshnet Enterprise',
        }),
        new Setting().fromData({
          key: SettingKey.CompanyCategory,
          visibility: SettingVisibility.Protected,
          value: 'Computer Store',
        }),
      ];
    });

  const processor = ref(new Processor());
  const list = ref(new List<Setting>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function updateItem(arg: { key: string; value: string | boolean }) {
    const { key, value } = arg;

    if (isPredefinedSetting(key)) throw new Error('testing');

    const setting = new Setting().fromData({ key, value }).toData();
    const api = await updateSetting(setting);
    const content = api.getObjectContent() as {
      key: string;
      value: string;
    };

    list.value.updateItemById(content.key, (item) => {
      if (!item) return;
      item.value = content.value;
    });

    return list.value.items;
  }
  async function findItemOfKey(arg = { key: '' }) {
    const { key } = arg;
    const items: Setting[] = await getItems();
    return items.find((item) => item.key === key);
  }
  async function findValueOfKey(arg: { key: string; default?: any }) {
    const { key = '', default: defaultValue = '' } = arg;
    const item = await findItemOfKey({ key });
    return item?.value ?? defaultValue;
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    updateItem,
    findItemOfKey,
    findValueOfKey,
  };
});
