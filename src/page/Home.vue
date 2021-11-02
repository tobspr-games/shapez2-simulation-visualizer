<template>
  <section>
    <h1>Hey <span class="wave">👋🏻</span> !</h1>
    <h2>Vue3 + Vite + Typescript Starter</h2>
    <p>💻 Vue 3 | Vite | Typescript | ESLint | Prettier.</p>
    <p class="info">See <code>README.md</code> for more use.</p>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "Home",
  });
</script>

<style lang="scss">
  h1 {
    margin: var(--gap) 0;
  }
  .info {
    margin-top: calc(var(--gap) * 2);
  }
  code {
    background-color: var(--contrast);
    border-radius: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.125rem;
    color: var(--color);
  }
</style>
