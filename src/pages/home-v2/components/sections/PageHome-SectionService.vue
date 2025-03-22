<script setup lang="ts">
import Link from '../PageHome-Link.vue';

withDefaults(defineProps<{ isThin?: boolean }>(), { isThin: false });
</script>

<template>
  <div
    :class="[
      'HomeSectionService',
      `HomeSectionService-${isThin ? 'isThin' : 'isWide'}`,
    ]"
  >
    <div class="HomeSectionyHour-body">
      <Link>Printing</Link>
      <Link>Repair Laptop</Link>
      <Link>Repair Computer</Link>
      <Link>Repair Printer</Link>
      <Link>Modified Printer</Link>
      <Link>Refill Cartridge</Link>
      <!-- <Link>Internet Service</Link> -->
      <Link>Name Card Design</Link>
      <Link>Projector</Link>
      <Link>Typing</Link>
      <!-- <Link>Top-Up Handphone</Link> -->
      <!-- <Link>My Card</Link> -->
      <Link>CyberCafe (Internet & Browsing Only)</Link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HomeSectionService {
  background: white;
  overflow: hidden;
  color: black;

  border-radius: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .HomeSectionyHour-body {
    width: 100%;
    padding: 1.5em;
    gap: 0.5em;
    line-height: 1em;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
    align-items: center;
    justify-content: center;
    place-items: center;
    text-align: center;

    & > * {
      text-wrap: balance;
    }
  }
}
.HomeSectionService-isThin {
  width: 100%;
  height: 100%;
  font-size: 1rem;
}
.HomeSectionService-isWide {
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
}
</style>
