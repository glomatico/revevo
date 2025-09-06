<template>
  <v-container>
    <v-row>
      <v-col v-if="isLoadingGeneral" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="!artist" cols=12>
        <v-alert type="error">Failed to load artist information.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12">
          <ArtistPageBanner :artist="artist" />
        </v-col>

        <v-divider thickness="2" />

        <v-col v-if="isLoadingVideos" cols="12">
          <LoadingSpinner />
        </v-col>

        <v-col v-else-if="!artistVideos" cols="12">
          <v-alert type="error">Failed to load artist videos.</v-alert>
        </v-col>

        <v-col v-else-if="artistVideos.data.length === 0" cols="12">
          <v-alert type="info">No videos found for this artist or no videos found in this page</v-alert>
        </v-col>

        <v-col v-else v-for="video in artistVideos.data" :key="video.id" cols="12" sm="6" md="4" lg="3">
          <ArtistPageVideoThumbnail :video="video" />
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <AppPagination :items-count="artistVideos?.paging.total!" :page-index="pageIndex"
            @page-change="onPageChange" />
        </v-col>

      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

const { getArtists, getArtistsVideos } = useArtist();
const route = useRoute();
const router = useRouter();

const artistId = route.params.id as string;

const isLoadingGeneral = ref<boolean>(true);
const isLoadingVideos = ref<boolean>(false);
const pageIndex = ref<number>(parseInt((route.query.p as string) || '1', 10));
const artist = ref<Artist | null>(null);
const artistVideos = ref<VideoList | null>(null);

const loadArtist = async () => {
  isLoadingGeneral.value = true;
  try {
    const artists = await getArtists(artistId, pageIndex.value);
    artist.value = artists ? artists[0] as Artist : null;
  } catch (error) {
    console.error('Error fetching artist:', error);
  } finally {
    isLoadingGeneral.value = false;
  }
  artistVideos.value = artist.value?.videoData?.videos!;
};

const loadArtistVideos = async () => {
  try {
    isLoadingVideos.value = true;
    const artistsVideos = await getArtistsVideos(artistId, pageIndex.value);
    artistVideos.value = (artistsVideos ? artistsVideos[0] as Artist : null)?.videoData?.videos!;
  } catch (error) {
    console.error('Error fetching artist videos:', error);
  } finally {
    isLoadingVideos.value = false;
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

  loadArtistVideos();
};

onMounted(async () => {
  loadArtist();
});

useHead(() => ({
  title: artist.value ? `${artist.value.basicMeta.name} - Revevo` : 'Revevo'
}));
</script>
