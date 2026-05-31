<script setup lang="ts">
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import VideoInfo from '@/components/VideoInfo.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { usePlayQueue } from '@/composables/usePlayQueue';
import { computed, inject } from 'vue';

const playQueue = inject<ReturnType<typeof usePlayQueue>>("playQueue")!;

const {
  loadingState,
  currentVideo,
  validCurrentVideo,
  captionsUrl,
  streamUrl,
  playNextVideo,
} = playQueue;

usePageTitle(computed(() =>
  validCurrentVideo.value ? currentVideo.value?.title : "",
));
</script>

<template>
  <v-row>
    <v-col cols="12">
      <VideoPlayer :src="streamUrl" :captions-url="captionsUrl" :on-end="playNextVideo" />
    </v-col>

    <v-col cols="12">
      <AppStatusContainer :loading-state="loadingState" :empty="!validCurrentVideo">
        <template #error>
          <v-alert type="error" variant="outlined">
            {{ $t('video.error') }}
          </v-alert>
        </template>

        <template #empty>
          <v-alert type="info" variant="outlined">
            {{ $t('video.notFound') }}
          </v-alert>
        </template>

        <VideoInfo v-if="currentVideo" :video="currentVideo" />
      </AppStatusContainer>
    </v-col>
  </v-row>
</template>
