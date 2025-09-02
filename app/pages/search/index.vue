<template>
  <v-container v-if="isLoading">
    <LoadingSpinner />
  </v-container>

  <v-container v-else-if="!searchResults">
    <v-alert type="error">Failed to load search results.</v-alert>
  </v-container>

  <div v-else>
    <v-container v-if="searchResults.items.length === 0">
      <v-alert type="info">No results found for "{{ query }}"</v-alert>
    </v-container>

    <v-container v-else>
      <v-row>
        <v-col v-for="video in searchResults.items" :key="video.id" cols="12" sm="6">
          <RelatedVideoThumbnail :video="video" />
        </v-col>
      </v-row>
    </v-container>

    <v-divider thickness="2" />

    <v-container>
      <AppPagination :items-count="searchResults.itemsCount" :page-index="1" />
    </v-container>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { searchVideos } = useSearch();

const query = computed<string>(() => (route.query.q as string) || '');
const isLoading = ref<boolean>(true);
const searchResults = ref<VideoSearchResult | null>(null);

const goRootIfNoQuery = async () => {
  if (!query.value.trim()) {
    await router.push({ path: '/' });
  }
};

const loadSearchResults = async () => {
  isLoading.value = true;
  try {
    searchResults.value = await searchVideos(query.value);
  } catch (error) {
    console.error('Error loading search results:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.query.q, async () => {
  goRootIfNoQuery();
  await loadSearchResults();
});

onMounted(async () => {
  goRootIfNoQuery();
  await loadSearchResults();
});
</script>
