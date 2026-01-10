<script lang="ts" setup>
const {
  loadingStateArtist,
  loadingStateVideos,
  artist,
  sortVideos,
  sortedVideos,
  validArtist,
  loadVideosScroll,
  loadAllVideos,
  initializeFromRoute,
} = useArtist();

onMounted(async () => {
  await initializeFromRoute();
});
</script>

<template>

  <Head>
    <Title>
      {{ validArtist ? `${artist.name} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <v-container>
    <StatusContainer :loading-state="loadingStateArtist" :empty="!validArtist">
      <template #error-message>
        Failed to load artist information.
      </template>

      <template #empty-message>
        Artist not found.
      </template>

      <v-row>
        <v-col cols="12">
          <ArtistPageBanner :artist="artist" />
        </v-col>

        <v-col cols="12">
          <v-divider thickness="2" />
        </v-col>

        <v-col cols="12" align="center">
          <v-btn-toggle v-model="sortVideos" @update:model-value="loadAllVideos"
            :disabled="loadingStateVideos === LoadingState.LOADING">
            <v-btn v-for="option in ['views', 'date', 'a-z']" :key="option" class="text-none text-capitalize"
              :value="option" variant="outlined">
              {{ option }}
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-col cols="12">
          <StatusContainer :loading-state="loadingStateVideos" :empty="sortedVideos.length === 0">
            <template #error-message>
              Failed to load videos.
            </template>

            <template #empty-message>
              No videos found for this artist.
            </template>

            <v-infinite-scroll @load="loadVideosScroll" class="overflow-x-hidden">
              <v-row>
                <v-col v-for="video in sortedVideos" :key="video" cols="12" sm="6" md="4" lg="3">
                  <VideoThumbnail :video="video" vertical />
                </v-col>
              </v-row>
            </v-infinite-scroll>
          </StatusContainer>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
