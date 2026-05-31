<script setup lang="ts">
import { computed } from 'vue';
import AppStatusContainer from './AppStatusContainer.vue';
import VideoThumbnail from './VideoThumbnail.vue';

type VideoThumbnailProps = {
  playlistId?: string;
  vertical?: boolean;
  disabled?: boolean;
};

type VideoGridProps =
  | VideoThumbnailProps
  | readonly VideoThumbnailProps[]
  | ((video: any, index: number) => VideoThumbnailProps);

const props = defineProps<{
  videoItems: any[];
  videoProps?: VideoGridProps;
  singleColumn?: boolean;
}>();

defineEmits<{
  'click:video': [video: any, index: number, event: MouseEvent];
}>();

const getVideoProps = (video: any, index: number) => {
  if (typeof props.videoProps === 'function') {
    return props.videoProps(video, index);
  }

  if (Array.isArray(props.videoProps)) {
    return props.videoProps[index] || {};
  }

  return props.videoProps || {};
};

const videosWithProps = computed(() => props.videoItems.map((video, index) => {
  const videoProps = getVideoProps(video, index);

  return {
    index,
    video,
    videoProps: {
      ...videoProps,
    },
  };
}));
</script>

<template>
  <AppStatusContainer :empty="!videoItems?.length">
    <template #empty>
      <v-alert type="info" variant="outlined">
        {{ $t('videoGrid.noVideos') }}
      </v-alert>
    </template>

    <v-row>
      <v-col v-for="item in videosWithProps" :key="item.video.id" cols="12" :sm="singleColumn ? 12 : 6"
        :md="singleColumn ? 12 : 4" :lg="singleColumn ? 12 : 3">
        <VideoThumbnail :video="item.video" v-bind="item.videoProps"
          @click="$emit('click:video', item.video, item.index, $event)" />
      </v-col>
    </v-row>
  </AppStatusContainer>
</template>
