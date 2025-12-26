<script lang="ts" setup>
const props = defineProps<{
  videoId: string;
}>();

const {
  loadingState,
  videoId,
  continuousPlay,
  currentVideoId,
  mappedItems,
  loadContinuousPlay,
  loadContinuousPlayScroll,
  getNextVideoId,
} = useContinuousPlay();

defineExpose({
  getNextVideoId,
});

onMounted(async () => {
  videoId.value = props.videoId;
  await loadContinuousPlay();
});
</script>

<template>
  <StatusContainer :loading-state="loadingState" :empty="!mappedItems?.length">
    <template #error-message>
      Failed to load related videos.
    </template>

    <template #empty-message>
      No related videos found.
    </template>

    <v-infinite-scroll @load="loadContinuousPlayScroll" class="overflow-x-hidden">
      <v-row>
        <v-col cols="12">
          <p class="text-h6">
            {{ continuousPlay.title }}
          </p>
        </v-col>
        <v-col v-for="item in mappedItems" :key="item" cols="12">
          <div v-for="className in ['d-none d-sm-block', 'd-sm-none']" :class="className" :key="className">
            <VideoThumbnail :id="item.id" :title="item.title" :created="item.created" :thumbnail-url="item.thumbnail"
              :explicit="item.explicit" :duration="item.duration" :views="item.viewCounts?.total"
              :tonal="item.id === currentVideoId" :vertical="className === 'd-sm-none'">
              <template #artists>
                <ArtistLink v-for="(artist, index) in item.artists" :key="artist.artist.id"
                  :artist-id="artist.artist.id" :artist-name="artist.artist.name"
                  :last="index === item.artists.length - 1" />
              </template>
            </VideoThumbnail>
          </div>
        </v-col>
      </v-row>
    </v-infinite-scroll>
  </StatusContainer>
</template>
