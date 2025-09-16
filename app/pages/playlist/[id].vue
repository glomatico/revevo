<script lang="ts" setup>
const route = useRoute();

const {
  loadPlaylist,
  loadingStateGeneral,
  playlistId,
  playlist,
  validPlaylist,
  filteredPlaylistVideos,
} = usePlaylist();

playlistId.value = route.params.id as string;

onMounted(async () => {
  loadPlaylist();
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
        <v-alert type="error">Failed to load playlist.</v-alert>
      </v-col>

      <template v-else>
        <v-col v-if="!validPlaylist" cols="12">
          <v-alert type="warning">Playlist not found or is unavailable.</v-alert>
        </v-col>

        <template v-else>
          <v-col cols="12" sm="5">
            <PlaylistInfo :playlist="playlist" />
          </v-col>
          <v-col cols="12" sm="7">
            <v-alert v-if="!filteredPlaylistVideos?.length" type="info">No videos available in this playlist.</v-alert>
            <PlaylistItems v-else :playlist="playlist!" />
          </v-col>
        </template>
      </template>
    </v-row>
  </v-container>
</template>
