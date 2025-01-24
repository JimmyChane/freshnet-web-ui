<script>
export default {
  data: (c) => ({ isShowing: false }),
  computed: {
    isConnected: (c) => c.$store.getters.isConnected,
  },
  watch: {
    isConnected() {
      this.onConnectionChange();
    },
  },
  mounted() {
    setTimeout(() => this.onConnectionChange(), 3000);
  },
  methods: {
    onConnectionChange(attempt = 0) {
      if (!this.isConnected) {
        this.isShowing = true;
        return;
      }

      if (attempt === 0) {
        this.isShowing = false;
        return;
      }

      this.isShowing = true;
      setTimeout(() => (this.isShowing = false), 3000);
    },
  },
};
</script>

<template>
  <div
    :class="[
      'Status',
      'transition',
      isConnected ? 'Status-isConnected' : 'Status-isDisconnected',
      isShowing ? 'Status-isShowingStatus' : 'Status-isHidingStatus',
    ]"
  >
    <span>{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
  </div>
</template>

<style lang="scss" scoped>
.Status {
  --status-height: 1.2em;

  padding: 0 0.1em;
  width: 100%;
  font-size: 0.7em;
  background: var(--primary-color);

  display: flex;
  flex-direction: row;
  flex-grow: 0;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  color: white;
  pointer-events: none;
}

.Status-isDisconnected {
  background: #e73c2f;
}
.Status-isConnected {
  background: #0c8d0c;
}

.Status-isShowingStatus {
  height: var(--status-height);
  min-height: var(--status-height);
  max-height: var(--status-height);
  opacity: 1;
}
.Status-isHidingStatus {
  height: 0;
  min-height: 0;
  max-height: 0;
  opacity: 0;
}
</style>
