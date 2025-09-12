<template>
  <v-container>
    <v-row>
      <v-col v-if="loadingState === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>
      <v-col v-else-if="loadingState === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load homepage data.</v-alert>
      </v-col>
      <template v-else>
        <v-col cols="12">
          <p class="text-h4">
            {{ topVideosSectionTitle }}
          </p>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-row>
            <v-col v-for="(video, index) in topVideosSectionItems" :key="index" cols="12" sm="6" md="4" lg="3">
              <VideoThumbnail v-if="video" :video="video" :vertical="true" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <p class="text-h4">
            {{ trendingArtistsSectionTitle }}
          </p>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-slide-group>
            <v-slide-group-item v-for="(artist, index) in trendingArtistsSectionItems" :key="index">
              <div class="ma-2">
                <ArtistThumbnail :artist="artist.basicMeta" class="artist-thumbnail" />
              </div>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { getHomePage } = useHomePage();
const { isArtistValid } = useArtist();

const loadingState = ref<LoadingState>(LoadingState.LOADING);
const homePage = ref<HomePage | null>(null);
const topVideosSectionTitle = ref<string | null>(null);
const topVideosSectionItems = ref<Video[]>([]);
const trendingArtistsSectionTitle = ref<string | null>(null);
const trendingArtistsSectionItems = ref<Artist[]>([]);

const loadHomePage = async () => {
  try {
    homePage.value = await getHomePage();
  } catch (error) {
    console.error(error);
    loadingState.value = LoadingState.ERROR;
  }
  loadingState.value = LoadingState.LOADED;
};

const setSections = async () => {
  if (!homePage.value) return;

  const topVideosSection = homePage.value.containersV2.find(s => s.serviceName === 'top-videos') || null;
  topVideosSectionTitle.value = topVideosSection?.title || null;
  topVideosSectionItems.value = topVideosSection?.items.map(i => i.item?.video!).filter(v => isVideoValid(v, false)) || [];


  const trendingArtistsSection = homePage.value.containersV2.find(s => s.serviceName === 'trending-artists') || null;
  trendingArtistsSectionTitle.value = trendingArtistsSection?.title || null;
  trendingArtistsSectionItems.value = trendingArtistsSection?.items.map(i => i.item?.artist!).filter(a => isArtistValid(a)) || [];
};

onMounted(async () => {
  await loadHomePage();
  await setSections();
});

useSeoMeta({
  title: 'Revevo',
  ogTitle: 'Revevo',
  description: 'A music video streaming website that recreates the old Vevo experience using their still-active internal APIs.',
  ogDescription: 'A music video streaming website that recreates the old Vevo experience using their still-active internal APIs.',
  ogImage: 'https://img.vevo.com/images/defaultbackstageassets/vevo.png?width=720&height=720',
  twitterCard: 'summary_large_image',
})
</script>
