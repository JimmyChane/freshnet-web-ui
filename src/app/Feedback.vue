<script>
   export default {
      data() {
         return { current: { isShowing: false, text: "" }, pending: [] };
      },
      computed: {
         text: (c) => (c.current !== null ? c.current.text : ""),
         isShown: (c) => c.current !== null && c.current.isShowing,
      },
      methods: {
         show(text) {
            let notification = { text, isShowing: true };
            this.current = notification;
            setTimeout(() => (notification.isShowing = false), 4000);
         },
      },
   };
</script>

<template>
   <div class="Feedback" :class="[isShown ? 'Feedback-isShown' : 'Feedback-isHidden']">
      <div class="Feedback-body">
         <div class="Feedback-background"></div>
         <div class="Feedback-body-content">
            <div class="Feedback-card">
               <div class="Feedback-card-body">
                  <div class="Feedback-card-background"></div>
                  <span class="Feedback-card-content">{{ text }}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .Feedback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      pointer-events: none;
      transition: var(--animation-duration);
      overflow: hidden;
      min-height: 12rem;
      max-height: 12rem;

      .Feedback-body {
         position: relative;
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-end;
         pointer-events: none;
         transition: var(--animation-duration);
         overflow: hidden;
         min-height: 12rem;
         max-height: 12rem;

         .Feedback-background {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, hsla(0, 0%, 0%, 0.7), transparent);
            transition: var(--animation-duration);
            transition-delay: 150ms;
         }

         .Feedback-body-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            padding: 0.6rem 1.2rem;
            padding-bottom: 4rem;
            pointer-events: none;
            transition: var(--animation-duration);
            overflow: hidden;
            min-height: 12rem;
            max-height: 12rem;
            .Feedback-card {
               max-width: var(--max-width);
               display: flex;
               flex-direction: column;
               align-items: center;
               border-radius: 0.4rem;
               transition: var(--animation-duration);
               .Feedback-card-body {
                  position: relative;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  transition: var(--animation-duration);
                  .Feedback-card-background {
                     position: absolute;
                     min-width: 100%;
                     min-height: 100%;
                     display: flex;
                     flex-direction: column;
                     justify-content: flex-end;
                     box-shadow: 0 0 10px hsla(0, 0%, 0%, 0.2);
                     background: hsla(0, 0%, 0%, 0.5);
                     backdrop-filter: blur(4px);
                     border-radius: 0.4rem;
                     transition: var(--animation-duration);
                  }
                  .Feedback-card-content {
                     z-index: 1;
                     width: 100%;
                     height: min-content;
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     padding: 0.6rem 2rem;
                     font-size: 1rem;
                     text-align: center;
                     line-height: 1.2;
                     color: white;
                     transition: var(--animation-duration);
                  }
               }
            }
         }
      }
   }
   .Feedback-isHidden {
      .Feedback-body {
         .Feedback-background {
            opacity: 0;
         }
         .Feedback-card {
            transform: translateY(-100%);
            opacity: 0;
         }
      }
   }
   .Feedback-isShown {
      .Feedback-body {
         .Feedback-background {
            opacity: 1;
         }
         .Feedback-card {
            transform: translateY(0%);
            opacity: 1;
         }
      }
   }
</style>
