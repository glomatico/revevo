<script lang="ts" setup>
const props = defineProps<{
  playlist: Playlist;
}>();

const {
  loadPlaylistPage,
  filteredPlaylistVideos,
  loadingStatePage,
  playlist,
} = usePlaylist();

playlist.value = props.playlist;
</script>

<template>
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
    <v-col v-else-if="playlist!.videos.items.length! !== playlist!.basicMeta.videoCount!" cols="12" class="text-center">
      <v-btn @click="loadPlaylistPage" block variant="text">
        Load More
      </v-btn>
    </v-col>
  </v-row>
</template>
