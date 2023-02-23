<script>
   export default { emits: ["click-ok", "click-cancel"] };
</script>

<template>
   <div class="WindowBottom">
      <button
         class="WindowBottom-action-ok transition"
         @click="$emit('click-ok')"
         >OK</button
      >
      <button
         class="WindowBottom-action-cancel transition"
         @click="$emit('click-cancel')"
         >Cancel</button
      >
   </div>
</template>

<style lang="scss" scoped>
   .WindowBottom {
      gap: 0.625rem;
      padding: 0.6rem 2rem;
      background-color: hsl(0, 0%, 96%);
      border-top: 1px solid hsl(0, 0%, 90%);
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;

      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      align-items: stretch;

      & > * {
         flex-basis: 5rem;
         --action-color: hsl(0, 0%, 70%);
         padding: 10px;
         font-weight: 600;
         font-size: 0.8rem;
         background-color: transparent;
         color: var(--action-color);
         cursor: pointer;
         border-radius: 6px;
         &:hover,
         &:focus {
            background-color: var(--action-color);
            color: white;
         }
      }

      .WindowBottom-action-ok {
         flex-grow: 4;
         --action-color: #2971de;
         border: 1px solid var(--action-color);
      }
      .WindowBottom-action-cancel {
         flex-grow: 1;
         --action-color: #404040;
         border: 1px solid transparent;
      }
   }
</style>
