<template>
  <v-container>
    <v-row>
      <v-col v-if="isLoadingGeneral" cols="12">
        <LoadingSpinner />
      </v-col>
      <v-col v-else-if="!searchResultsFiltered" cols="12">
        <v-alert type="error">Failed to load search results.</v-alert>
      </v-col>
      <template v-else>
        <v-col cols="12">
          <p class="text-h5">
            Search results for "{{ query }}"
          </p>
        </v-col>

        <v-col cols="12">
          <v-tabs v-model="currentTab" align-tabs="center" @update:model-value="onTabChange">
            <v-tab value="videos">Videos</v-tab>
            <v-tab value="artists">Artists</v-tab>
          </v-tabs>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-tabs-window v-model="currentTab">
            <v-tabs-window-item value="videos">
              <v-row>
                <v-col v-if="isLoadingResults" cols="12">
                  <LoadingSpinner />
                </v-col>
                <v-col v-else-if="!searchResultsFiltered.videos" cols="12">
                  <v-alert type="error">Failed to load video results.</v-alert>
                </v-col>
                <v-col v-else-if="searchResultsFiltered.videos.items.length === 0" cols="12">
                  <v-alert type="info">No videos found.</v-alert>
                </v-col>
                <v-col v-else v-for="video in searchResultsFiltered.videos.items" cols="12" sm="6">
                  <VideoThumbnail :video="video" />
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="artists">
              <v-row>
                <v-col v-if="isLoadingResults" cols="12">
                  <LoadingSpinner />
                </v-col>
                <v-col v-else-if="!searchResultsFiltered.artists" cols="12">
                  <v-alert type="error">Failed to load artists results.</v-alert>
                </v-col>
                <v-col v-else-if="searchResultsFiltered.artists.items.length === 0" cols="12">
                  <v-alert type="info">No artists found.</v-alert>
                </v-col>
                <v-col v-else v-for="artist in searchResultsFiltered.artists.items" :key="artist.id" cols="12" sm="6"
                  md="4" lg="3">
                  <ArtistThumbnail :artist="artist.basicMeta" />
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>

        <v-divider thickness="2" />

        <v-col>
          <AppPagination :items-count="searchResults?.videos.total!" :page-index="pageIndex"
            @page-change="onPageChange" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { search } = useSearch();

const query = computed<string>(() => (route.query.q as string) || '');
const currentTab = ref<string>((route.query.t as string) || 'videos');
const isLoadingGeneral = ref<boolean>(true);
const isLoadingResults = ref<boolean>(false);
const pageIndex = ref<number>(parseInt((route.query.p as string) || '1', 10));
const searchResults = ref<SearchResult | null>(null);
const searchResultsFiltered = ref<SearchResult | null>(null);

const searchResultsOffset = computed<number>(() => (pageIndex.value - 1) * 32);

const goRootIfNoQuery = async () => {
  if (!query.value.trim()) {
    await router.push({ path: '/' });
  }
};

const loadSearchResults = async () => {
  isLoadingResults.value = true;
  try {
    searchResults.value = await search(query.value, searchResultsOffset.value, searchResultsOffset.value);
  } catch (error) {
    console.error('Error loading search results:', error);
  } finally {
    isLoadingGeneral.value = false;
  }
  isLoadingResults.value = false;
  await filterSearchResults();
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

  await loadSearchResults();
};

const onTabChange = async () => {
  const newQuery = { ...route.query };
  if (currentTab.value === 'videos') {
    delete newQuery.t;
  } else {
    newQuery.t = currentTab.value;
  }

  await router.push({
    path: route.path,
    query: newQuery
  });
};

const filterSearchResults = async () => {
  if (!searchResults.value) return;
  searchResultsFiltered.value = searchResults.value;
  searchResultsFiltered.value.videos!.items = searchResults.value.videos!.items.filter((video) => video.basicMetaV3);
  searchResultsFiltered.value.artists!.items = searchResults.value.artists!.items.filter((artist) => artist.basicMeta);
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
