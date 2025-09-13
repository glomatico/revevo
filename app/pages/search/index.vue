<script lang="ts" setup>
const defaultTab = 'videos';
const tabs = ['videos', 'artists'];
const defaultTabRouteParamKey = 't';

const route = useRoute();
const router = useRouter();
const {
  loadSearch,
  searchTerm,
  loadingStateGeneral,
  loadingStateResults,
  searchOffset,
  searchResults,
  filteredVideoSerchResults,
  filteredArtistSerchResults,
} = useSearch();

const tab = ref<string>((route.query[defaultTabRouteParamKey] as string) || defaultTab);

const onPageChange = async (newPage: number) => {
  searchOffset.value = (newPage - 1) * 32;
  loadSearch();
};

const onTabChange = (newTab: string) => {
  tab.value = newTab;
};

const handleSearchInit = async () => {
  if (searchTerm.value === route.query.q) {
    return;
  }

  searchTerm.value = (route.query.q as string) || null;
  if (!searchTerm.value) {
    router.push({ path: '/' });
    return;
  }

  await loadSearch();
};

watch(route, handleSearchInit);

onMounted(handleSearchInit);
</script>

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
            Search results for "{{ searchTerm }}"
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

                <v-col v-else-if="filteredVideoSerchResults!.length === 0" cols="12">
                  <v-alert type="info">No videos found.</v-alert>
                </v-col>

                <v-col v-else v-for="video in filteredVideoSerchResults!" cols="12" sm="6">
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

                <v-col v-else-if="filteredArtistSerchResults!.length === 0" cols="12">
                  <v-alert type="info">No artists found.</v-alert>
                </v-col>

                <v-col v-else v-for="artist in filteredArtistSerchResults!" :key="artist.id" cols="12" sm="6" md="4"
                  lg="3">
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
          <AppPagination :items-count="searchResults!.videos.total" @page-change="onPageChange" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
