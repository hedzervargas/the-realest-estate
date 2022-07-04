<template>
  <teleport to="body">
    <div class="backdrop"></div>
    <dialog open>
      <section>
        <slot name="message">
          <h1>Error</h1>
          <p>There was an error, please try again later.</p>
        </slot>
      </section>
      <menu>
        <slot name="actions">
          <button @click="close">OK</button>
          <!-- <button class="flat">OK</button> -->
        </slot>
      </menu>
    </dialog>
  </teleport>
</template>

<script>
export default {
  emits: ["close"],
  methods: {
    close() {
      document.body.classList.remove("dialog-open");
      this.$emit("close");
    },
  },
  created() {
    document.body.classList.add("dialog-open");
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9;
}

dialog {
  position: fixed;
  top: 30vh;
  width: 85%;
  max-width: 35rem;
  z-index: 99;
  border-radius: var(--border-radius);
  border: none;
  padding: 2rem;
  margin: 0 auto;
  /* overflow: hidden; */
  background-color: var(--background-color-2);
}
section {
  margin: 0 0 1rem 0;
  width: 100%;
}
section h1,
section p {
  text-align: center;
}
menu {
  padding: 0 10vw;
}
menu button {
  margin-top: 1rem;
  margin-bottom: 0;
}
menu button.flat {
  background: var(--secondary-color);
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media screen and (min-width: 1000px) {
  dialog {
    max-width: 40rem;
    padding: 3rem;
  }
  h1 {
    font-size: 22px;
  }
  p {
    font-size: 16px;
  }
  button {
    font-size: 16px;
  }
  menu {
    padding: 0 6rem;
  }
}
</style>
