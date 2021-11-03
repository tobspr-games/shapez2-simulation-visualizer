<template>
  <section class="page">
    <h1>Hey <span class="wave">👋🏻</span> !</h1>
    <h2>Vue3 + Vite + Typescript Starter</h2>
    <p>💻 Vue 3 | Vite | Typescript | Axios | ESLint | Prettier | and more…</p>
    <p class="info">See <code>README.md</code> for more use.</p>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  h1 {
    margin: var(--gap) 0;
  }
  h2 {
    margin-bottom: 0;
  }
  .info {
    margin-top: calc(var(--gap) * 2);
  }
</style>
