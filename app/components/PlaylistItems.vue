<script lang="ts" setup>
const props = defineProps<{
  playlist: Playlist;
}>();

const route = useRoute();

const {
  loadPlaylistVideos,
  page,
  playlistId,
  playlist,
  filteredPlaylistVideos,
  loadingStateVideos,
  isFullyLoaded,
} = usePlaylist();

const playlistIndex = computed<number>(() => parseInt(route.query.i as string) || 0);

page.value = 2;
playlistId.value = props.playlist.id;
playlist.value = props.playlist;
</script>

<template>
  <v-row>
    <v-col v-for="(video, index) in filteredPlaylistVideos" :key="video.basicMetaV3.isrc" cols="12">
      <div class="d-none d-sm-block">
        <VideoThumbnail :video="video" :playlist-id="playlist.id" :playlist-index="index + 1"
          :tonal="playlistIndex === index + 1" />
      </div>

      <div class="d-sm-none">
        <VideoThumbnail :video="video" :playlist-id="playlist.id" :playlist-index="index + 1"
          :tonal="playlistIndex === index + 1" vertical />
      </div>
    </v-col>

    <v-col v-if="loadingStateVideos === LoadingState.LOADING" cols="12" class="text-center">
      <LoadingSpinner />
    </v-col>

    <v-col v-else-if="loadingStateVideos === LoadingState.ERROR" cols="12">
      <v-alert type="error">Failed to load more videos.</v-alert>
    </v-col>

    <v-col v-else-if="!isFullyLoaded" cols="12" class="text-center">
      <v-btn @click="loadPlaylistVideos" block variant="text">
        Load More
      </v-btn>
    </v-col>
  </v-row>
</template>
