<template>
  <v-container>
    <v-row>
      <v-col v-if="isLoading" cols="12">
        <LoadingSpinner />
      </v-col>
      <v-col v-else-if="!searchResults" cols="12">
        <v-alert type="error">Failed to load search results.</v-alert>
      </v-col>
      <template v-else>
        <v-col v-if="searchResults.items.length === 0" cols="12">
          <v-alert type="info">No results found for "{{ query }}"</v-alert>
        </v-col>

        <template v-else>
          <v-col cols="12">
            <p class="text-h5">
              {{ searchResults.itemsCount }} results for "{{ query }}"
            </p>
          </v-col>

          <v-divider thickness="2" />

          <v-col v-for="video in searchResults.items" :key="video.id" cols="12" sm="6">
            <GenericVideoThumbnail :video="video" />
          </v-col>
        </template>

        <v-divider thickness="2" />

        <v-col>
          <AppPagination :items-count="searchResults.itemsCount" :page-index="pageIndex" @page-change="onPageChange" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { searchVideos } = useSearch();

const query = computed<string>(() => (route.query.q as string) || '');
const isLoading = ref<boolean>(true);
const pageIndex = ref<number>(parseInt((route.query.p as string) || '1', 10));
const searchResults = ref<VideoSearchResult | null>(null);

const searchResultsOffset = computed<number>(() => (pageIndex.value - 1) * 32);

const goRootIfNoQuery = async () => {
  if (!query.value.trim()) {
    await router.push({ path: '/' });
  }
};

const loadSearchResults = async () => {
  isLoading.value = true;
  try {
    searchResults.value = await searchVideos(query.value, searchResultsOffset.value);
  } catch (error) {
    console.error('Error loading search results:', error);
  } finally {
    isLoading.value = false;
  }
};

const onPageChange = async (newPageIndex: number) => {
  pageIndex.value = newPageIndex;

  const newQuery = { ...route.query };
  if (newPageIndex === 1) {
    delete newQuery.p;
  } else {
    newQuery.p = newPageIndex.toString();
  }

  await router.push({
    path: route.path,
    query: newQuery
  });

  loadSearchResults();
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
