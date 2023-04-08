<template>
  <section class="wrapper">
    <Navigation />

    <div class="wrapper__content">
      <router-view />
    </div>

    <Credits />
  </section>
</template>

<script setup lang="ts">
  import "reflect-metadata";
</script>

<style lang="scss" scoped></style>
