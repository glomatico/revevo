<script lang="ts" setup>
const {
  loadPlaylist,
  loadPlaylistPage,
  loadingStateGeneral,
  loadingStatePage,
  playlist,
  validPlaylist,
  filteredPlaylistVideos,
} = usePlaylist();

onMounted(async () => {
  await loadPlaylist();
});
</script>

<template>

  <Head>
    <Title>{{ validPlaylist ? `${playlist!.basicMeta.title} - Revevo` : 'Revevo' }}</Title>
  </Head>

  <v-container>
    <v-row>
      <template v-if="loadingStateGeneral === LoadingState.IDLE" />

      <v-col v-else-if="loadingStateGeneral === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingStateGeneral === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load playlist information.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12">
          <v-alert v-if="!validPlaylist" type="warning">Playlist not found or is unavailable.</v-alert>
        </v-col>

        <v-col v-if="!filteredPlaylistVideos?.length" cols="12">
          <v-alert type="info">No videos available in this playlist.</v-alert>
        </v-col>

        <template v-else>
          <v-col cols="12" sm="5">
            <PlaylistInfo :playlist="playlist!" />
          </v-col>
          <v-col cols="12" sm="7">
            <v-row>
              <v-col v-for="(video, index) in filteredPlaylistVideos" :key="video.basicMetaV3.isrc" cols="12">
                <div class="d-none d-sm-block">
                  <VideoThumbnail :video="video" :index="index + 1" />
                </div>
                <div class="d-sm-none">
                  <VideoThumbnail :video="video" :index="index + 1" vertical />
                </div>
              </v-col>
              <v-col v-if="loadingStatePage === LoadingState.LOADING" cols="12" class="text-center">
                <LoadingSpinner />
              </v-col>
              <v-col v-else-if="loadingStatePage === LoadingState.ERROR" cols="12">
                <v-alert type="error">Failed to load more videos.</v-alert>
              </v-col>
              <v-col v-else-if="playlist!.videos.items.length! !== playlist!.basicMeta.videoCount!" cols="12"
                class="text-center">
                <v-btn @click="loadPlaylistPage" block variant="text">
                  Load More
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </template>
      </template>
    </v-row>
  </v-container>
</template>
