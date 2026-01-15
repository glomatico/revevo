<script lang="ts" setup>
const props = defineProps<{
  playQueue: ReturnType<typeof usePlayQueue>;
}>();

const {
  playlistId,
  loadingState,
  title,
  videoIndex,
  mappedVideos,
  scrollPlayQueue,
  initializeFromRoute,
} = props.playQueue;

onMounted(async () => {
  await initializeFromRoute();
});
</script>

<template>
  <StatusContainer :loading-state="loadingState" :empty="!mappedVideos?.length">
    <template #error-message>
      Failed to load play queue.
    </template>

    <template #empty-message>
      No videos found in the play queue.
    </template>

    <v-row>
      <v-col cols="12">
        <p class="text-h6">
          {{ title }}
        </p>
      </v-col>

      <v-col cols="12">
        <VideoList :videos="mappedVideos" :playlist-id="playlistId" :load-videos-scroll="scrollPlayQueue"
          :add-index="Boolean(playlistId)" v-model:video-index="videoIndex" />
      </v-col>
    </v-row>
  </StatusContainer>
</template>
