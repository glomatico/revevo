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

    <v-infinite-scroll @load="scrollPlayQueue" class="overflow-x-hidden">
      <v-row>
        <v-col cols="12">
          <p class="text-h6">
            {{ title }}
          </p>
        </v-col>

        <v-col v-for="(item, index) in mappedVideos" :key="item" cols="12">
          <div v-for="className in ['d-none d-sm-block', 'd-sm-none']" :class="className" :key="className">
            <VideoThumbnail :video="item" :tonal="index === videoIndex" :vertical="className === 'd-sm-none'"
              :playlist-id="playlistId" :index="playlistId ? index + 1 : undefined" @click="videoIndex = index" />
          </div>
        </v-col>
      </v-row>
    </v-infinite-scroll>
  </StatusContainer>
</template>
