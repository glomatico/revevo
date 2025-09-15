<script lang="ts" setup>
const {
  loadingState: loadingStateVideo,
  videoId,
  video,
  validVideo,
  streamUrl,
  captionsUrl,
  filteredRelatedVideos,
} = useVideo(true);

const {
  loadingStateGeneral: loadingStatePlaylist,
  playlist,
  playlistId,
  validPlaylist,
  filteredPlaylistVideos,
} = usePlaylist(true);

</script>


<template>

  <Head>
    <Title>{{ validVideo ? `${video?.basicMetaV3.title} - Revevo` : 'Revevo' }}</Title>
  </Head>

  <ClientOnly>
    <VideoPlayer :stream-url="streamUrl!" :captions-url="captionsUrl!" />
  </ClientOnly>

  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <template v-if="loadingStateVideo === LoadingState.IDLE" />

        <LoadingSpinner v-else-if="loadingStateVideo === LoadingState.LOADING" />

        <v-alert v-else-if="loadingStateVideo === LoadingState.ERROR" type="error">Failed to load video
          information.</v-alert>

        <v-alert v-else-if="!validVideo" type="warning">Video not found or is unavailable.</v-alert>

        <VideoInfo v-else :video="video!" />
      </v-col>

      <v-col cols="12" md="4">
        <v-row v-if="playlistId">
          <v-col cols="12">
            <p class="text-h5">
              Playlist
            </p>
          </v-col>

          <v-col cols="12">
            <LoadingSpinner v-if="loadingStatePlaylist === LoadingState.LOADING" />

            <v-alert v-else-if="loadingStatePlaylist === LoadingState.ERROR" type="error">Failed to load playlist
              information.</v-alert>

            <v-alert v-else-if="!filteredPlaylistVideos?.length" type="info">No videos found in this playlist.</v-alert>

            <v-alert v-else-if="!validPlaylist" type="warning">Playlist not found or is unavailable.</v-alert>

            <PlaylistItems v-else :playlist="playlist!" />
          </v-col>
        </v-row>

        <v-row v-if="videoId">
          <v-col cols="12">
            <p class="text-h5">
              Up next
            </p>
          </v-col>

          <template v-if="loadingStateVideo === LoadingState.IDLE" />

          <v-col v-else-if="loadingStateVideo === LoadingState.LOADING" cols="12">
            <LoadingSpinner />
          </v-col>

          <template v-else-if="loadingStateVideo === LoadingState.ERROR" />

          <v-col v-else-if="!filteredRelatedVideos?.length" cols="12">
            <v-alert type="info">No related videos found.</v-alert>
          </v-col>

          <v-col v-else v-for="item in filteredRelatedVideos" :key="item.basicMetaV3.isrc" cols="12">
            <div class="d-none d-sm-block">
              <VideoThumbnail :video="item" />
            </div>
            <div class="d-sm-none">
              <VideoThumbnail :video="item" :vertical="true" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
