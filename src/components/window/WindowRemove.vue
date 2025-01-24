<script>
import Actionbar from '@/components/actionbar/Actionbar.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

import WindowBottom from './WindowBottom.vue';

export default {
  components: { PanelAction, Actionbar, WindowBottom },
  props: {
    popupWindow: { type: Object },
  },
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    title: (c) => c.popupWindow.title,
    message: (c) => c.popupWindow.message,
    value: (c) => c.popupWindow.value,
  },
  methods: {
    onOK() {
      const accept = () => this.popupWindow.close();
      const reject = () => {};
      this.popupWindow.onConfirm(accept, reject);
    },
  },
};
</script>

<template>
  <div class="WindowRemove">
    <Actionbar class="WindowRemove-header" :title="title" />

    <div class="WindowRemove-main">
      <span class="WindowRemove-body">{{ message }}</span>
    </div>

    <WindowBottom
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => onOK()"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowRemove {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  .WindowRemove-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: none;
  }
  .WindowRemove-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.8rem 2.5rem;
    margin-bottom: 1.2rem;
  }
}
</style>
