<script lang="ts" setup>
const props = defineProps<{
  videos: any[];
  videoIndex?: number;
  playlistId?: string;
  addIndex?: boolean;
  loadVideosScroll: ({ done }: any) => Promise<void>;
  onVideoClick?: (index: number) => void;
}>();

const emit = defineEmits<{
  'update:videoIndex': [index: number];
}>();
</script>

<template>
  <v-infinite-scroll @load="loadVideosScroll" class="overflow-x-hidden">
    <v-row>
      <v-col v-for="(video, index) in videos" :key="video" cols="12">
        <div v-for="className in ['d-none d-sm-block', 'd-sm-none']" :class="className" :key="className">
          <VideoThumbnail :video="video" :vertical="className === 'd-sm-none'" :playlist-id="playlistId"
            :index="addIndex ? index + 1 : undefined" :tonal="index === videoIndex"
            @click="emit('update:videoIndex', index)">
          </VideoThumbnail>
        </div>
      </v-col>
    </v-row>
  </v-infinite-scroll>
</template>
