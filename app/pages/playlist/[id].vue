<script lang="ts" setup>
const {
  settings,
  initialize: initializeSettings,
} = useSettings();

const {
  mappedVideos,
  loadingState,
  playlist,
  validPlaylist,
  loadPlaylistVideosScroll,
  initializeFromRoute,
} = usePlaylist(settings.value);

onMounted(async () => {
  initializeSettings();
  await initializeFromRoute();
});
</script>

<template>

  <Head>
    <Title>
      {{ validPlaylist ? `${playlist.title} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <v-container>
    <StatusContainer :loading-state="loadingState" :empty="!validPlaylist">
      <template #error-message>
        Failed to load playlist.
      </template>

      <template #empty-message>
        Playlist not found or is unavailable.
      </template>

      <v-row>
        <v-col cols="12" sm="5">
          <PlaylistInfo :playlist="playlist" />
        </v-col>

        <v-col cols="12" sm="7">
          <StatusContainer :empty="!mappedVideos?.length">
            <template #empty-message>
              No videos available in this playlist.
            </template>

            <VideoList :videos="mappedVideos" :playlist-id="playlist.id" :load-videos-scroll="loadPlaylistVideosScroll"
              add-index />
          </StatusContainer>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
