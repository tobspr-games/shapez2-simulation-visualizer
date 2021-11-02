<template>
  <nav class="credits">
    <p>
      &lt;&sol;💻&gt; with ❤ by
      <a href="https://vinces.io" title="Vinces" target="_blank">@vinces</a>. Have Fun 🍻
    </p>
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "Credits",
  });
</script>

<style scoped>
  p {
    font-size: x-small;
  }
</style>
<style scoped lang="scss">
  .credits {
    margin: var(--gap) 0;
  }
</style>
