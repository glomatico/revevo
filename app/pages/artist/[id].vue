<template>
  <v-container>
    <v-row>
      <v-col v-if="loadingStateGeneral === LoadingState.Loading" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingStateGeneral === LoadingState.Error" cols="12">
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
                <v-col v-if="loadingStateVideos === LoadingState.Loading" cols="12">
                  <LoadingSpinner />
                </v-col>

                <v-col v-else-if="loadingStateVideos === LoadingState.Error" cols="12">
                  <v-alert type="error">Failed to load artist videos.</v-alert>
                </v-col>

                <v-col v-else-if="!artistVideos" cols="12">
                  <v-alert type="warning">No videos found for this artist or no videos found in this page</v-alert>
                </v-col>

                <v-col v-else v-for="video in artistVideos!.data" cols="12" sm="6" md="4" lg="3">
                  <ArtistPageVideoThumbnail :video="video" />
                </v-col>

                <v-col cols="12">
                  <v-divider thickness="2" />
                </v-col>

                <v-col cols="12">
                  <AppPagination :items-count="artistVideos?.paging.total! || 0" @page-change="onPageChange" />
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

<script lang="ts" setup>

const { getArtists, getArtistsVideos, isArtistValid } = useArtist();
const route = useRoute();

const artistId = route.params.id as string;

const tabs = ['videos', 'about', 'related-artists'];
const defaultTabRouteParamKey = 't';
const defaultTab = 'videos';

const loadingStateGeneral = ref<LoadingState>(LoadingState.Loading);
const loadingStateVideos = ref<LoadingState>(LoadingState.Loading);
const tab = ref<string>((route.query.t as string) || defaultTab);
const page = ref<number>(parseInt((route.query.p as string) || '1', 10));
const artist = ref<Artist | null>(null);
const artistVideos = ref<VideoList | null>(null);
const validArtist = ref<boolean>(false);

const loadArtist = async () => {
  try {
    const artists = await getArtists(artistId, page.value);

    artist.value = artists ? artists[0] as Artist : null;
    artistVideos.value = artist.value?.videoData?.videos!;
  } catch (error) {
    console.error(error);
    loadingStateGeneral.value = LoadingState.Error;
  }

  loadingStateGeneral.value = LoadingState.Loaded;
  loadingStateVideos.value = LoadingState.Loaded;
  validArtist.value = isArtistValid(artist.value);
};

const loadArtistVideos = async () => {
  loadingStateVideos.value = LoadingState.Loading;

  try {
    const artistsVideos = await getArtistsVideos(artistId, page.value);

    artistVideos.value = (artistsVideos ? artistsVideos[0] as Artist : null)?.videoData?.videos!;
  } catch (error) {
    console.error('Error fetching artist videos:', error);
    loadingStateVideos.value = LoadingState.Error;
  }

  loadingStateVideos.value = LoadingState.Loaded;
};

const onTabChange = (newTab: string) => {
  tab.value = newTab;
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadArtistVideos();
};

onMounted(async () => {
  loadArtist();
});

useHead(() => ({
  title: validArtist.value ? `${artist.value?.basicMeta.name} - Revevo` : 'Revevo'
}));
</script>
