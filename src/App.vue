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
  import Navigation from "@/components/Navigation.vue";
  import Credits from "@/components/Credits.vue";
</script>

<style lang="scss" scoped></style>
