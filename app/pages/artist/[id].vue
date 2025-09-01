<template>
  <v-container v-if="isLoadingGeneral">
    <v-row>
      <v-col>
        <LoadingSpinner />
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="!artist">
    <v-row>
      <v-col>
        <v-alert type="error">Failed to load artist information.</v-alert>
      </v-col>
    </v-row>
  </v-container>

  <div v-else>
    <v-container>
      <v-row>
        <v-col>
          <ArtistBanner :artist="artist" />
        </v-col>
      </v-row>
    </v-container>

    <v-divider thickness="2" />

    <v-container v-if="isLoadingVideos">
      <v-row>
        <v-col>
          <LoadingSpinner />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="!artistVideos">
      <v-row>
        <v-col>
          <v-alert type="error">Failed to load artist videos.</v-alert>
        </v-col>
      </v-row>
    </v-container>

    <div v-else>
      <v-container v-if="artistVideos.items.length === 0">
        <v-row>
          <v-col cols="12">
            <v-alert type="info">No videos found for this artist or no videos found in this page</v-alert>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else>
        <v-row>
          <v-col v-for="video in artistVideos.items" :key="video.id" cols="12" sm="6" md="4" lg="3">
            <ArtistVideoThumbnail :video="video" />
          </v-col>
        </v-row>
      </v-container>

      <v-divider thickness="2" />

      <v-container>
        <v-row>
          <v-col cols="12">
            <ArtistPagination :items-count="artist.videos.itemsCount" :page-index="pageIndex"
              @page-change="onPageChange" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getArtist, getArtistVideos } = useArtist();
const route = useRoute();
const router = useRouter();

const artistId = route.params.id as string;

const isLoadingGeneral = ref<boolean>(true);
const isLoadingVideos = ref<boolean>(false);
const pageIndex = ref<number>(parseInt((route.query.p as string) || '1', 10));
const artist = ref<Artist | null>(null);
const artistVideos = ref<ArtistVideoResult | null>(null);

const artistVideosOffset = computed<number>(() => (pageIndex.value - 1) * 32);

const loadArtist = async () => {
  isLoadingGeneral.value = true;
  try {
    artist.value = await getArtist(artistId, artistVideosOffset.value);
  } catch (error) {
    console.error('Error fetching artist:', error);
  } finally {
    isLoadingGeneral.value = false;
  }
  artistVideos.value = artist.value?.videos || null;
};

const loadArtistVideos = async () => {
  try {
    isLoadingVideos.value = true;
    artistVideos.value = await getArtistVideos(artistId, artistVideosOffset.value);
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
</script>
