<script>
   import Group from "./PageHome-SectionContact-Group.vue";

   export default {
      components: { Group },
      props: {
         isThin: { type: Boolean, default: false },
      },
      data() {
         return {
            items: [
               {
                  title: "Beh Aik Keong",
                  callNumber: "0167959444",
                  whatsappNumber: "0167959444",
               },
               {
                  title: "Office (Mobile)",
                  callNumber: "0146315353",
                  whatsappNumber: "0146315353",
                  telegramName: "FreshnetEnterprise",
               },
               {
                  title: "Office",
                  phoneNumber: "0332897297",
                  telephoneNumber: "0332897297",
               },
            ],
            // contacts: [
            //    {
            //       title: "Support Contact",
            //       title: "Office (Mobile)",
            //       description: "014-631 5353",
            //       links: [
            //          {
            //             title: "Call",
            //             icon: this.host.res("icon/call-color.svg"),
            //             href: "tel:+60146315353",
            //          },
            //          {
            //             title: "Whatsapp",
            //             icon: this.host.res("icon/whatsapp-color.svg"),
            //             href: "https://api.whatsapp.com/send?phone=60146315353",
            //             target: "__blank,",
            //          },
            //          {
            //             title: "Telegram",
            //             icon: this.host.res("icon/telegram-color.svg"),
            //             href: "https://t.me/FreshnetEnterprise",
            //             target: "__blank",
            //          },
            //       ],
            //    },
            //    {
            //       title: "Mr Beh",
            //       description: "016-795 9444",
            //       links: [
            //          {
            //             title: "Call",
            //             icon: this.host.res("icon/call-color.svg"),
            //             href: "tel:+60167959444",
            //          },
            //          {
            //             title: "Whatsapp",
            //             icon: this.host.res("icon/whatsapp-color.svg"),
            //             href: "https://api.whatsapp.com/send?phone=60167959444",
            //             target: "__blank,",
            //          },
            //       ],
            //    },
            //    {
            //    	title: "Office 1",
            //    	description: "03-3281 1526",
            //    	links: [
            //    		{
            //    			title: "Telephone",
            //    			icon: this.host.res("icon/telephone-color.svg"),
            //    			href: "tel:+60332811526",
            //    		},
            //    	],
            //    },
            //    {
            //       title: "Office 2",
            //       description: "03-3289 7297",
            //       links: [
            //          {
            //             title: "Telephone",
            //             icon: this.host.res("icon/telephone-color.svg"),
            //             href: "tel:+60332897297",
            //          },
            //       ],
            //    },
            // ],
         };
      },
      computed: {
         groups() {
            return this.items.reduce((groups, item) => {
               const optGroup = (title, icon) => {
                  let group = groups.find((group) => group.title === title);
                  if (!group) {
                     group = { title, icon, items: [] };
                     groups.push(group);
                  }
                  return group;
               };

               if (item.callNumber)
                  optGroup(
                     "Call",
                     this.host.res("icon/call-color.svg")
                  ).items.push({
                     title: item.title,
                     subtitle: item.callNumber,
                     href: `tel:+6${item.callNumber}`,
                  });
               if (item.telephoneNumber)
                  optGroup(
                     "Telephone",
                     this.host.res("icon/call-color.svg")
                  ).items.push({
                     title: item.title,
                     subtitle: item.telephoneNumber,
                     href: `tel:+6${item.telephoneNumber}`,
                  });
               if (item.whatsappNumber)
                  optGroup(
                     "Whatsapp",
                     this.host.res("icon/whatsapp-color.svg")
                  ).items.push({
                     title: item.title,
                     subtitle: item.whatsappNumber,
                     href: `https://api.whatsapp.com/send?phone=6${item.whatsappNumber}`,
                     target: "__blank",
                  });
               if (item.telegramName)
                  optGroup(
                     "Telegram",
                     this.host.res("icon/telegram-color.svg")
                  ).items.push({
                     title: item.title,
                     subtitle: item.title,
                     href: `https://t.me/${item.telegramName}`,
                     target: "__blank",
                  });
               return groups;
            }, []);
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'HomeSectionContact',
         `HomeSectionContact-${isThin ? 'isThin' : 'isWide'}`,
      ]"
   >
      <Group
         v-for="group of groups"
         :key="group.title"
         :style="{
            'grid-column': 'auto / span 1',
            'grid-row': 'auto / span 2',
         }"
         :isThin="isThin"
         :group="group"
      />
   </div>
</template>

<style lang="scss" scoped>
   .HomeSectionContact-isThin {
      font-size: 1rem;
   }
   .HomeSectionContact-isWide {
      font-size: 1.3rem;
   }
   .HomeSectionContact {
      width: 100%;
      gap: 0.5rem;

      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));

      justify-content: center;
      align-items: center;
      justify-items: center;
      align-content: center;
   }
</style>
