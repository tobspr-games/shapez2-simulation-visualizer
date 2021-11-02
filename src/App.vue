<template>
  <section class="wrapper">
    <Navigation />

    <div class="wrapper__content">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </div>

    <Credits />
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import Navigation from "./components/Navigation.vue";
  import Credits from "./components/Credits.vue";

  export default defineComponent({
    name: "App",
    components: {
      Navigation,
      Credits,
    },
  });
</script>

<style lang="scss">
  #app {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }
  .wrapper {
    height: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    &__content {
      height: 100%;
      width: 100%;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
  }
</style>
