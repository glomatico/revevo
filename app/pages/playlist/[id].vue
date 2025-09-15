<script lang="ts" setup>
const {
  loadPlaylist,
  loadingStateGeneral,
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
            <PlaylistItems :playlist="playlist!" />
          </v-col>
        </template>
      </template>
    </v-row>
  </v-container>
</template>
