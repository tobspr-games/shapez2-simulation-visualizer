<template>
  <nav class="navigation">
    <router-link :to="{ name: 'Home' }" title="Home">Home</router-link>
    <router-link :to="{ name: 'About' }" title="About">About</router-link>
    <a href="#" title="Switch Theme" class="toggleTheme" @click.stop="toggleTheme()">
      {{ userTheme === "light-theme" ? "☀️" : "🌙" }}
    </a>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  export default defineComponent({
    name: "Navigation",
    setup() {
      /* Data */
      const userTheme = ref("light-theme");

      /* Methods */
      function toggleTheme() {
        const activeTheme = localStorage.getItem("user-theme");
        if (activeTheme === "light-theme") {
          setTheme("dark-theme");
        } else {
          setTheme("light-theme");
        }
      }

      function setTheme(theme: string) {
        localStorage.setItem("user-theme", theme);
        userTheme.value = theme;
        document.body.className = theme;
      }

      // Check windows user theme navigator
      function getMediaPreference(): string {
        const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (hasDarkPreference) {
          return "dark-theme";
        } else {
          return "light-theme";
        }
      }

      /* Mounted, Watcher ...*/
      onMounted(() => {
        // Check local theme + windows user theme navigator and set theme
        const windowsUserTheme = getMediaPreference();
        const localStorageTheme = localStorage.getItem("user-theme");
        if (localStorageTheme) {
          setTheme(localStorageTheme);
        } else if (windowsUserTheme) {
          setTheme(windowsUserTheme);
        } else {
          setTheme(userTheme.value);
        }
      });

      return {
        userTheme,
        toggleTheme,
      };
    },
  });
</script>

<style scoped lang="scss">
  .navigation {
    margin: var(--gap) 0;
    a {
      margin: 0 var(--space);
    }
    .toggleTheme {
      text-decoration: none;
    }
  }
</style>
