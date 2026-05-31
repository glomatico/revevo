<script setup lang="ts">
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue';
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import type { usePlayQueue } from '@/composables/usePlayQueue';
import { computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  playQueue: ReturnType<typeof usePlayQueue>;
}>();

const { smAndDown } = useDisplay();

const {
  playlistId,
  loadingState,
  title,
  mappedVideos,
  playVideo,
  scrollPlayQueue,
  watchRoute,
} = props.playQueue;

const videoProps = computed(() =>
  mappedVideos.value.map((_video: any, index: number) => ({
    playlistId: playlistId.value || undefined,
    index: playlistId.value ? index + 1 : undefined,
    vertical: smAndDown.value,
  })),
);

onMounted(() => {
  watchRoute();
});
</script>

<template>
  <AppStatusContainer :loading-state="loadingState" :empty="!mappedVideos.length">
    <template #error>
      <v-alert type="error" variant="outlined">
        {{ $t('playQueue.error') }}
      </v-alert>
    </template>

    <template #empty>
      <v-alert type="info" variant="outlined">
        {{ $t('playQueue.empty') }}
      </v-alert>
    </template>

    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 font-weight-bold ma-0">
          {{ title || $t('playQueue.title') }}
        </h2>
      </v-col>

      <v-col cols="12">
        <AppInfiniteScroll :load="scrollPlayQueue">
          <v-col cols="12">
            <VideoGrid :video-items="mappedVideos" :video-props="videoProps" single-column @click:video="playVideo" />
          </v-col>
        </AppInfiniteScroll>
      </v-col>
    </v-row>
  </AppStatusContainer>
</template>
