<template>
  <section class="page">
    <h1>Axios page.</h1>
    <p>Example of API call. In this case we use Github Api for show list of repositories.</p>
    <p class="info">See <code>README.md</code> for more information.</p>

    <h3>Current repository:</h3>
    <div v-if="currentRepository" class="current-repo">
      <div class="current-repo__img">
        <img :src="getImageRepo(currentRepository.name)" :alt="currentRepository.name" />
      </div>
      <div class="current-repo__info">
        <h4>
          <a :href="currentRepository.html_url" target="_blank" :title="currentRepository.name">
            {{ currentRepository.full_name }}
          </a>
        </h4>
        <p>{{ currentRepository.description }}</p>
        <p>
          {{ currentRepository.open_issues_count }} Issues,
          {{ currentRepository.forks_count }} Forks
        </p>
      </div>
    </div>
    <p v-else>No info for this repository</p>

    <h3>My others repositories:</h3>
    <section v-if="allRepositories" class="list-repo">
      <article v-for="repo in allRepositories" :key="repo.id" class="list-repo__item">
        <img :src="getImageRepo(repo.name)" :alt="repo.name" />
        <p class="list-repo__content">
          <a :href="repo.html_url" target="_blank" title="repo.name">{{ repo.name }}</a>
        </p>
      </article>
    </section>
    <p v-else>No repositories found.</p>
  </section>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from "vue";
  import ApiGithubService from "@/services/ApiGithubService";

  const nameAuthor: any = ref("Sp0ne");
  const currentRepository: any = ref({});
  const allRepositories: any = ref({});

  const initCallApiAndLoadData = async (): Promise<void> => {
    currentRepository.value = await ApiGithubService.getOneRepository(
      nameAuthor.value,
      "vue3-vite-typescript-starter",
    );
    allRepositories.value = await ApiGithubService.getAllRepositories(nameAuthor.value);
  };

  function getImageRepo(repo: string): string {
    return "https://opengraph.githubassets.com/1/" + nameAuthor.value + "/" + repo;
  }

  onMounted(() => {
    initCallApiAndLoadData();
  });
</script>

<style lang="scss" scoped>
  .page {
    max-width: 650px;
    width: 100%;
    h3 {
      margin-top: calc(var(--gap) * 3);
    }
  }
  .current-repo {
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    background: var(--background-light);
    padding: var(--gap);
    border: 1px solid var(--border);
    &__img {
      display: flex;
      width: 40%;
      justify-content: center;
      align-items: center;
      img {
        max-height: 150px;
        width: 100%;
        max-width: 100%;
        height: auto !important;
        display: inline-flex;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      width: 60%;
      padding: 0 var(--gap);
    }
  }
  .list-repo {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    grid-gap: var(--gap);
    grid-auto-flow: dense;
    &__item {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      border-radius: 5px;
      overflow: hidden;
      background: var(--background-light);
      border: 1px solid var(--border);
    }
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      text-align: center;
      padding: var(--space);
      margin: 0;
      height: 100%;
    }
  }
</style>
