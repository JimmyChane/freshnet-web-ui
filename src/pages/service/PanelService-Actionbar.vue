<script>
import { format, formatDistanceToNow } from 'date-fns';
import { mapStores } from 'pinia';

import IconBookmarkAdd from '@/assets/icon/bookmark-000000.svg';
import IconBookmark from '@/assets/icon/bookmark-add-000000.svg';
import IconCall from '@/assets/icon/call-color.svg';
import IconClose from '@/assets/icon/close-000000.svg';
import IconEdit from '@/assets/icon/edit-505050.svg';
import IconTrash from '@/assets/icon/trash-000000.svg';
import IconWhatsapp from '@/assets/icon/whatsapp-color.svg';
import MenuIconVue from '@/components/MenuIcon.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import Selector from '@/components/selector/Selector.vue';
import { Service } from '@/items/Service';
import { mapServiceState } from '@/items/ServiceState';
import PanelItemCustomer from '@/pages/manage/PanelItem-Customer.vue';
import { useServiceStore } from '@/pinia-stores/service.store';

import BelongingVue from './ItemBelonging.vue';
import LabelVue from './PanelService-Info-Label.vue';
import SectionVue from './PanelService-Info-Section.vue';

export default {
  components: {
    Actionbar,
    Selector,
    PanelItemCustomer,
    SectionVue,
    LabelVue,
    BelongingVue,
    MenuIconVue,
  },
  props: {
    service: { type: Service },
    actionbarColor: '',
    actionbarBorder: '',
    actions: { type: Object },
    isExpand: { type: Boolean, default: false },
  },
  data: (c) => ({
    IconClose,
    IconBookmark,
    IconBookmarkAdd,
    IconEdit,
    nameOfUser: '',
    bookmarkHeaderIconIsHover: false,
  }),
  computed: {
    ...mapStores(useServiceStore),

    timestamp: (c) => c.service.timestamp,
    timestampText: (c) => {
      const { time } = c.timestamp;

      const timeText = format(time, 'EEEE, dd/LL/yyyy hh:mmaaa');

      const distance = formatDistanceToNow(time);
      const distanceText = `(${distance} ago)`;

      let day;
      if (c.timestamp.isToday()) {
        day = 'Today, ';
      } else if (c.timestamp.isYesterday()) {
        day = 'Yesterday, ';
      } else {
        day = '';
      }

      return `${day}${timeText} ${distanceText}`;
    },

    customer: (c) => c.service?.customer ?? null,

    labels: (c) => c.service?.labels ?? [],
    belongings: (c) =>
      c.service?.belongings.map((belonging) => belonging) ?? [],
    state: (c) => c.service?.state ?? '',

    phoneNumber: (c) => c.customer?.phoneNumber ?? null,
    phoneNumberStr: (c) => c.phoneNumber?.toString() ?? '',
    isPhoneNumber: (c) => !!c.phoneNumberStr,

    stateMenus: (c) => {
      return mapServiceState((state) => {
        return {
          key: state.key,
          title: state.title,
          icon: state.icon,
          color: state.primaryColor,
        };
      });
    },

    menus: (c) => {
      const menus = [];

      if (c.isExpand && c.isPhoneNumber) {
        menus.push({
          title: 'Chat with Customer on Whatsapp',
          icon: IconWhatsapp,
          alth: 'Chat on Whatsapp',
          href: `https://api.whatsapp.com/send?phone=6${c.phoneNumberStr}`,
          target: '_blank',
        });
        menus.push({
          title: 'Call Customer',
          icon: IconCall,
          href: `tel:+6${c.phoneNumberStr}`,
        });
      }

      menus.push({
        title: 'Find Customer',
        to: {
          path: '/manage/customer',
          query: { name: c.name, phoneNumber: c.phoneNumberStr },
        },
        isHidden: true,
      });
      menus.push({
        title: 'Delete Service',
        icon: IconTrash,
        click: () => c.actions.onClickRemove(c.service),
        isHidden: true,
      });

      return menus;
    },
    labelMenus() {
      if (!this.service) return [];

      const menus = [
        {
          key: 'urgent',
          title: 'Urgent',
          click: () => {
            useServiceStore().updateUrgentOfId({
              serviceID: this.service.id,
              isUrgent: !this.service.isUrgent(),
            });
          },
        },
        {
          key: 'warranty',
          title: 'Warranty',
          click: () => {
            useServiceStore().updateWarrantyOfId({
              serviceID: this.service.id,
              isWarranty: !this.service.isWarranty(),
            });
          },
        },
      ];

      return menus.filter((menu) => {
        const label = this.labels.find((label) => label.title === menu.title);
        return !label;
      });
    },

    totalCost: (c) => c.service.toTotalPrice(),
    totalCostText: (c) => `Total Cost: ${c.totalCost}`,
  },
  watch: {
    service() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      this.nameOfUser = await this.getOwnerNameFromItem();
    },
    async getOwnerNameFromItem() {
      const { service } = this;

      if (!service) {
        return '';
      }

      const name = await service.fetchName().catch((error) => {
        this.$store.dispatch('snackbarShow', 'Error getting user for service');
        return '';
      });

      if (service !== this.service) {
        return;
      }
      if (name.length) {
        return name;
      }

      return 'unknown';
    },

    toggleExpand(isExpand = !this.isExpand) {
      this.$emit('toggle-expand', isExpand);
    },
  },
};
</script>

<template>
  <div class="PanelService-actionbar">
    <Actionbar
      v-if="service"
      class="PanelService-actionbar-actionbar"
      :style="{
        'background-color': actionbarColor,
        'border-bottom': `1px solid ${
          isExpand ? actionbarBorder : 'transparent'
        }`,
      }"
      :leftMenus="{
        icon: IconClose,
        click: () => actions.onClickClose(),
      }"
      :rightMenus="menus"
    >
      <button
        class="PanelService-actionbar-actionbar-clickable"
        @click="() => toggleExpand()"
      >
        <PanelItemCustomer
          v-if="customer"
          :customer="customer"
          :isEditable="isExpand"
          @click-edit="(customer) => actions.onClickUpdateCustomer(customer)"
        />

        <div
          class="PanelService-actionbar-actionbar-labels"
          :isExpand="`${isExpand}`"
          v-if="labels.length"
        >
          <LabelVue
            v-for="label in labels"
            :key="label.title"
            :label="label"
            :isClickable="false"
            @click="
              () => {
                serviceStore.removeLabelFromId({
                  serviceID: service.id,
                  label,
                });
              }
            "
          />
        </div>
      </button>
    </Actionbar>

    <div class="PanelService-actionbar-anchor" v-if="service">
      <div
        class="PanelService-actionbar-expanded transition"
        :style="{
          'background-color': actionbarColor,
          'border-bottom': `1px solid ${actionbarBorder}`,
        }"
        :isExpand="`${isExpand}`"
      >
        <div class="PanelService-actionbar-expanded-body">
          <div class="PanelService-actionbar-expanded-body-body">
            <div class="PanelService-section-labels">
              <LabelVue
                v-for="label in labels"
                :key="label.title"
                :label="label"
                @click="
                  () => {
                    serviceStore.removeLabelFromId({
                      serviceID: service.id,
                      label,
                    });
                  }
                "
              />
              <MenuIconVue
                :style="{ 'font-size': '0.8rem', 'grid-area': 'addLabel' }"
                :menus="labelMenus"
                @mouseover="bookmarkHeaderIconIsHover = true"
                @mouseleave="bookmarkHeaderIconIsHover = false"
                :src="
                  bookmarkHeaderIconIsHover ? IconBookmark : IconBookmarkAdd
                "
              />
            </div>

            <SectionVue
              :title="`Belongings (${belongings.length})`"
              :menus="{
                title: 'Update Belongings',
                icon: IconEdit,
                click: () => actions.onClickUpdateBelongings(belongings),
              }"
            >
              <div
                class="PanelService-section-belonging"
                v-if="belongings.length"
              >
                <BelongingVue
                  v-for="belonging in belongings"
                  :key="belonging.time"
                  :belonging="belonging"
                />
              </div>
              <div class="PanelService-section-belonging-empty" v-else>
                <span>Emtpy</span>
              </div>
            </SectionVue>

            <SectionVue title="Collected By">
              <span>{{ nameOfUser }}</span>
            </SectionVue>

            <div class="PanelService-action-footer">
              <Selector
                class="PanelService-actionbar-state-selector"
                :list="stateMenus"
                :keySelected="state"
                @callback-select="
                  (state) => {
                    if (!service) return;
                    serviceStore.updateStateOfId({
                      serviceID: service.id,
                      state,
                    });
                  }
                "
              />

              <span class="PanelService-totalCost">{{ totalCostText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PanelService-actionbar {
  --actionbar-height: 3.8rem;
  width: 100%;
  position: sticky;
  top: 0;

  .PanelService-actionbar-actionbar {
    background: inherit;
    border-bottom: inherit;

    .PanelService-actionbar-actionbar-clickable {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: stretch;

      background: none;
      border: none;
      cursor: pointer;
      font-size: 1em;

      .PanelService-actionbar-actionbar-labels[isExpand='true'] {
        opacity: 0;
      }
      .PanelService-actionbar-actionbar-labels {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: flex-end;

        flex-grow: 1;
        overflow: hidden;

        transition: all 200ms cubic-bezier(1, 0, 0, 1);

        gap: 1px;
      }
    }
  }

  .PanelService-actionbar-anchor {
    width: 100%;
    position: relative;
    display: flex;

    .PanelService-actionbar-expanded[isExpand='false'] {
      grid-template-rows: 0fr;
    }
    .PanelService-actionbar-expanded[isExpand='true'] {
      grid-template-rows: 1fr;
    }
    .PanelService-actionbar-expanded {
      width: 100%;
      height: max-content;
      max-height: calc(100dvh - 4rem - 4rem - 0.2rem - 3rem);
      position: absolute;
      display: grid;
      box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
      overflow-y: auto;

      .PanelService-actionbar-expanded-body {
        overflow: hidden;
        overflow-y: auto;

        .PanelService-actionbar-expanded-body-body {
          width: 100%;
          height: max-content;
          padding: 1rem;
          gap: 1rem;

          display: flex;
          flex-direction: column;
          align-items: stretch;

          .PanelService-section-labels {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.2em;
          }

          .PanelService-section-belonging {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .PanelService-action-footer {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .PanelService-actionbar-state-selector {
              width: 100%;
              max-width: 12rem;
              flex-grow: 1;
            }

            .PanelService-totalCost {
              min-width: max-content;
              text-align: end;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
