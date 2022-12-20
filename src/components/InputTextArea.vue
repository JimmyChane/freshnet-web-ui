<script>
   export default {
      emits: ["focus", "blur", "input", "change"],
      props: {
         name: { type: String, default: "" },
         label: { type: String, default: "" },
         type: { type: String, default: "" },

         isRequired: { type: Boolean, default: false },
         error: { type: String, default: "" },

         bindValue: { default: undefined },
      },
      data() {
         return { input_value: "", isFocused: false };
      },
      watch: {
         bindValue() {
            this.value = this.bindValue;
         },
      },
      computed: {
         value: {
            get() {
               return this.input_value;
            },
            set(x) {
               return (this.input_value = x);
            },
         },
         isValueEmpty() {
            return typeof this.value !== "string" || this.value.trim() === "";
         },
      },
      methods: {
         focus() {
            this.$refs.input.focus();
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'InputTextArea',
         isFocused ? 'InputTextArea-isFocused' : 'InputTextArea-isBlurred',
      ]"
   >
      <span
         :class="[
            'InputTextArea-sign',
            'InputTextArea-sign-required',
            `InputTextArea-sign-required-${
               isRequired && isValueEmpty ? 'isShown' : 'isHidden'
            }`,
         ]"
         >*Required</span
      >
      <span
         :class="[
            'InputTextArea-sign',
            'InputTextArea-sign-error',
            `InputTextArea-sign-error-${error ? 'isShown' : 'isHidden'}`,
         ]"
         >{{ error }}</span
      >

      <label
         :class="[
            'InputTextArea-label',
            `InputTextArea-label-${isValueEmpty ? 'isHidden' : 'isShown'}`,
         ]"
         ref="label"
         v-if="label"
         :for="name"
         >{{ label }}</label
      >
      <textarea
         class="InputTextArea-input"
         ref="input"
         :name="name"
         :type="type"
         @focus="
            (event) => {
               isFocused = true;
               $emit('focus', this._self);
            }
         "
         @blur="
            (event) => {
               isFocused = false;
               $emit('blur', this._self);
            }
         "
         @input="
            (event) => {
               value = event.target.value;
               $emit('input', this._self);
            }
         "
         @change="
            (event) => {
               $emit('change', this._self);
            }
         "
         v-bind:value="value"
      />

      <div class="InputTextArea-dummy"></div>
   </div>
</template>

<style lang="scss" scoped>
   .InputTextArea {
      width: 100%;
      margin-top: 0.8rem;
      position: relative;
      padding: 0.6em;
      // background: hsla(0, 0%, 100%, 0.2);
      background: hsla(0, 0%, 0%, 0.03);
      border-radius: 0.2em;
      transition: var(--transition-duration);
      resize: none;

      .InputTextArea-sign {
         font-size: 0.7em;
         font-weight: 600;
         transition: var(--transition-duration);
      }

      .InputTextArea-sign-required {
         position: absolute;
         left: 0;
         top: -1.3em;

         color: rgb(235, 113, 68);
         padding-right: inherit;
      }
      .InputTextArea-sign-required-isHidden {
         opacity: 0;
         pointer-events: none;
      }
      .InputTextArea-sign-required-isShown {
         opacity: 1;
      }
      .InputTextArea-sign-error {
         position: absolute;
         top: -1.3em;
         right: 0;
         color: red;
      }
      .InputTextArea-sign-error-isHidden {
         opacity: 0;
         pointer-events: none;
      }
      .InputTextArea-sign-error-isShown {
         opacity: 1;
      }

      label {
         z-index: 1;
         width: fit-content;
         position: absolute;
         left: 0;

         font-size: 1em;

         transition: var(--transition-duration);
      }
      .InputTextArea-label-isHidden {
         top: 0.6em;
         padding-left: inherit;

         color: hsla(0, 0%, 20%, 0.5);
         font-weight: 400;
         pointer-events: none;
      }
      .InputTextArea-label-isShown {
         top: -1.2em;
         padding-left: 0;

         color: hsl(0, 0%, 20%);
         font-weight: 600;
      }

      .InputTextArea-input {
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         padding: inherit;

         z-index: 2;
         width: 100%;
         border: none;
         background: none;

         font-weight: 400;
         font-size: 1em;
         color: black;
         transition: var(--transition-duration);
         resize: inherit;
      }

      .InputTextArea-dummy {
         height: 1.1em;
      }
   }

   .InputTextArea-isFocused {
      border-bottom: 0.1em solid hsl(0, 0%, 30%);
      border-bottom: 0.1em solid var(--primary-color);
   }
   .InputTextArea-isBlurred {
      border-bottom: 0.1em solid hsl(0, 0%, 70%);
   }
</style>
