<script lang="ts" setup>
const tabs = ['videos', 'about', 'related-artists'];
const defaultTabRouteParamKey = 't';
const defaultTab = 'videos';

const route = useRoute();

const tab = ref<string>((route.query.t as string) || defaultTab);

const {
  loadArtist,
  loadArtistPage,
  loadingStateGeneral,
  loadingStateVideos,
  page,
  artistId,
  artist,
  validArtist,
  filteredArtistVideos,
} = useArtist();


const onTabChange = (newTab: string) => {
  tab.value = newTab;
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadArtistPage();
};

onMounted(async () => {
  page.value = parseInt((route.query.p as string) || '1', 10);
  artistId.value = route.params.id as string;
  loadArtist();
});
</script>

<template>

  <Head>
    <Title>{{ validArtist ? `${artist?.basicMeta.name} - Revevo` : 'Revevo' }}</Title>
  </Head>

  <v-container>
    <v-row>
      <template v-if="loadingStateGeneral === LoadingState.IDLE" />

      <v-col v-else-if="loadingStateGeneral === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingStateGeneral === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load artist information.</v-alert>
      </v-col>

      <v-col v-else-if="!validArtist" cols="12">
        <v-alert type="warning">Artist not found.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12">
          <ArtistPageBanner :artist="artist!" />
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
                <template v-if="loadingStateVideos === LoadingState.IDLE" />

                <v-col v-if="loadingStateVideos === LoadingState.LOADING" cols="12">
                  <LoadingSpinner />
                </v-col>

                <v-col v-else-if="loadingStateVideos === LoadingState.ERROR" cols="12">
                  <v-alert type="error">Failed to load artist videos.</v-alert>
                </v-col>

                <v-col v-else-if="!filteredArtistVideos || filteredArtistVideos?.length == 0" cols="12">
                  <v-alert type="warning">No videos found for this artist or no videos found in this page</v-alert>
                </v-col>

                <v-col v-else v-for="video in filteredArtistVideos" cols="12" sm="6" md="4" lg="3">
                  <ArtistPageVideoThumbnail :video="video" />
                </v-col>

                <v-col cols="12">
                  <v-divider thickness="2" />
                </v-col>

                <v-col cols="12">
                  <AppPagination :items-count="artist?.videoData?.videos?.paging?.total || 0"
                    @page-change="onPageChange" />
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="about">
              <ArtistPageAbout :artist="artist!" />
            </v-tabs-window-item>

            <v-tabs-window-item value="related-artists">
              <ArtistPageRelatedArtists :artist="artist!" />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
