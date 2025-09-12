<template>
  <v-container>
    <v-row>
      <v-col v-if="loadingStateGeneral === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingStateGeneral === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load search results.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12">
          <p class="text-h4">
            Search results for "{{ query }}"
          </p>
        </v-col>

        <v-col cols="12">
          <AppTabs :tabs="tabs" :route-param-key="defaultTabRouteParamKey" :default-tab="defaultTab"
            @tab-change="onTabChange" />
          <v-divider thickness="2" />
        </v-col>

        <v-col cols="12">
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="videos">
              <v-row>
                <v-col v-if="loadingStateResults === LoadingState.LOADING" cols="12">
                  <LoadingSpinner />
                </v-col>

                <v-col v-else-if="loadingStateResults === LoadingState.ERROR" cols="12">
                  <v-alert type="error">Failed to load video results.</v-alert>
                </v-col>

                <v-col v-else-if="searchResultsFiltered!.videos.items.length === 0" cols="12">
                  <v-alert type="info">No videos found.</v-alert>
                </v-col>

                <v-col v-else v-for="video in searchResultsFiltered!.videos.items" cols="12" sm="6">
                  <VideoThumbnail :video="video" />
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="artists">
              <v-row>
                <v-col v-if="loadingStateResults === LoadingState.LOADING" cols="12">
                  <LoadingSpinner />
                </v-col>

                <v-col v-else-if="loadingStateResults === LoadingState.ERROR" cols="12">
                  <v-alert type="error">Failed to load artists results.</v-alert>
                </v-col>

                <v-col v-else-if="searchResultsFiltered!.artists.items.length === 0" cols="12">
                  <v-alert type="info">No artists found.</v-alert>
                </v-col>

                <v-col v-else v-for="artist in searchResultsFiltered!.artists.items" :key="artist.id" cols="12" sm="6"
                  md="4" lg="3">
                  <ArtistThumbnail :artist="artist.basicMeta" />
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>

        <v-col cols="12">
          <v-divider thickness="2" />
        </v-col>

        <v-col cols="12">
          <AppPagination :items-count="searchResults?.videos.total!" @page-change="onPageCange" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { search } = useSearch();
const { isArtistValid } = useArtist();

const defaultTab = 'videos';
const tabs = ['videos', 'artists'];
const defaultTabRouteParamKey = 't';

const tab = ref<string>((route.query[defaultTabRouteParamKey] as string) || defaultTab);
const loadingStateGeneral = ref<LoadingState>(LoadingState.LOADING);
const loadingStateResults = ref<LoadingState>(LoadingState.LOADING);
const page = ref<number>(parseInt((route.query.p as string) || '1', 10));
const searchResults = ref<SearchResult | null>(null);
const searchResultsFiltered = ref<SearchResult | null>(null);

const query = computed<string>(() => (route.query.q as string) || '');
const searchResultsOffset = computed<number>(() => (page.value - 1) * 32);

const loadSearchResults = async () => {
  if (!query.value.trim()) {
    await router.push({ path: '/' });
  }

  loadingStateResults.value = LoadingState.LOADING;

  try {
    searchResults.value = await search(query.value, searchResultsOffset.value, searchResultsOffset.value);
  } catch (error) {
    console.error(error);
    loadingStateGeneral.value = LoadingState.ERROR;
    loadingStateResults.value = LoadingState.ERROR;
  }

  loadingStateGeneral.value = LoadingState.LOADED;
  loadingStateResults.value = LoadingState.LOADED;

  await filterSearchResults();
};

const filterSearchResults = async () => {
  if (!searchResults.value) return;
  searchResultsFiltered.value = searchResults.value;
  searchResultsFiltered.value.videos!.items = searchResults.value.videos!.items.filter((video) => video.basicMetaV3);
  searchResultsFiltered.value.artists!.items = searchResults.value.artists!.items.filter((artist) => isArtistValid(artist));
};

const onPageCange = async (newPage: number) => {
  page.value = newPage;
  loadSearchResults();
};

const onTabChange = (newTab: string) => {
  tab.value = newTab;
};

watch(query, async () => {
  await loadSearchResults();
});

onMounted(async () => {
  await loadSearchResults();
});
</script>
