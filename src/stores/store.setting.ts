import Vuex from 'vuex';

import { optArray } from '@/U';
import Contact from '@/items/Contact';
import Setting, { SettingKey, SettingVisibility } from '@/items/Setting';
import WorkingDay from '@/items/WorkingDay';
import { getSettingList, updateSetting } from '@/request/Setting';

import StoreBuilder from './tools/StoreBuilder';

const isPredefinedSetting = (key: string) => {
  return (
    [
      SettingKey.Contacts,
      SettingKey.CompanyName,
      SettingKey.CompanyCategory,
      SettingKey.CompanyWorkingHours,
    ] as string[]
  ).includes(key);
};

const init = (Stores: any) => {
  const context = new StoreBuilder<Setting>()
    .onFetchItems(async () => {
      const api = await getSettingList();
      const list = optArray(api.optArrayContent());
      const items = list.map((content) => {
        return new Setting(Stores).fromData(content);
      });

      const contacts = [
        new Contact(Stores).fromData({
          title: 'Beh Aik Keong',
          links: [
            { category: 'call', id: '0167959444' },
            { category: 'whatsapp', id: '0167959444' },
          ],
        }),
        new Contact(Stores).fromData({
          title: 'Office (Mobile)',
          links: [
            { category: 'call', id: '0146315353' },
            { category: 'whatsapp', id: '0146315353' },
            { category: 'telegram', id: 'FreshnetEnterprise' },
          ],
        }),
        new Contact(Stores).fromData({
          title: 'Office',
          links: [{ category: 'telephone', id: '0332897297' }],
        }),
      ];
      const days: WorkingDay[] = [];
      days.push(
        ...[
          new WorkingDay(null, days).fromData({
            title: 'Monday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Tuesday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Wednesday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Thursday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Friday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Saturday',
            timeStart: '0900',
            timeEnd: '1900',
          }),
          new WorkingDay(null, days).fromData({
            title: 'Sunday',
            timeStart: '1000',
            timeEnd: '1830',
          }),
        ],
      );

      return [
        ...items.filter((item) => !isPredefinedSetting(item.key)),
        new Setting(Stores).fromData({
          key: SettingKey.CompanyWorkingHours,
          visibility: SettingVisibility.Protected,
          value: days,
        }),
        new Setting(Stores).fromData({
          key: SettingKey.Contacts,
          visibility: SettingVisibility.Protected,
          value: contacts,
        }),
        new Setting(Stores).fromData({
          key: SettingKey.CompanyName,
          visibility: SettingVisibility.Protected,
          value: 'Freshnet Enterprise',
        }),
        new Setting(Stores).fromData({
          key: SettingKey.CompanyCategory,
          visibility: SettingVisibility.Protected,
          value: 'Computer Store',
        }),
      ];
    })
    .onGetStore(() => Stores.setting)
    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .action(
      'updateItem',
      async (context, arg: { key: string; value: string }) => {
        const { key, value } = arg;

        if (isPredefinedSetting(key)) throw new Error('testing');

        const setting = new Setting(Stores).fromData({ key, value }).toData();
        const api = await updateSetting(setting);
        const content = api.getObjectContent() as {
          key: string;
          value: string;
        };

        context.state.list.updateItemById(content.key, (item) => {
          if (!item) return;
          item.value = content.value;
        });

        return context.state.list.items;
      },
    )
    .action('findItemOfKey', async (context, arg = { key: '' }) => {
      const { key } = arg;
      const items: Setting[] = await context.dispatch('getItems');
      return items.find((item) => item.key === key);
    })
    .action(
      'findValueOfKey',
      async (context, arg = { key: '', default: '' }) => {
        const { key = '', default: defaultValue = '' } = arg;
        const item = await context.dispatch('findItemOfKey', { key });
        return item?.value ?? defaultValue;
      },
    )
    .build();

  return new Vuex.Store(context);
};

export default { init };
