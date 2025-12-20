<script lang="ts" setup>
const route = useRoute();


const {
  loadingStateArtist,
  loadingStateVideos,
  artistId,
  artist,
  sortVideos,
  filteredVideos,
  validArtist,
  loadArtist,
  loadVideos,
  loadAllVideos,
} = useArtist();

onMounted(async () => {
  artistId.value = route.params.id as string;
  await loadArtist();
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
    <v-row>
      <template v-if="loadingStateArtist === LoadingState.IDLE" />

      <v-col v-else-if="loadingStateArtist === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingStateArtist === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load artist information.</v-alert>
      </v-col>

      <v-col v-else-if="!validArtist" cols="12">
        <v-alert type="warning">Artist not found.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12">
          <ArtistPageBanner :artist-avatar-url="artist.thumbnail" :artist-name="artist.name"
            :video-count="artist.videos.itemsCount" :view-count="artist.viewCounts.total" />
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

        <template v-if="loadingStateVideos === LoadingState.IDLE" />

        <v-col v-else-if="loadingStateVideos === LoadingState.LOADING" cols="12">
          <LoadingSpinner />
        </v-col>

        <v-col v-else-if="loadingStateVideos === LoadingState.ERROR" cols="12">
          <v-alert type="error">Failed to load videos.</v-alert>
        </v-col>

        <v-col v-else-if="filteredVideos.length === 0" cols="12">
          <v-alert type="info">No videos found for this artist.</v-alert>
        </v-col>

        <v-col v-else cols="12">
          <v-infinite-scroll @load="loadVideos">
            <v-row class="mx-0">
              <v-col v-for="video in filteredVideos" :key="video" cols="12" sm="6" md="4" lg="3">
                <VideoThumbnail :id="video.id" :title="video.title" :created="video.created"
                  :thumbnail-url="video.thumbnail" :explicit="video.explicit" :duration="video.duration"
                  :views="video.viewCounts.total" vertical>
                </VideoThumbnail>
              </v-col>
            </v-row>
          </v-infinite-scroll>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
