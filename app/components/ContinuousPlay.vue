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
  <v-row>
    <template v-if="loadingState === LoadingState.IDLE" />

    <v-col v-else-if="loadingState === LoadingState.LOADING" cols="12">
      <LoadingSpinner />
    </v-col>

    <v-col v-else-if="loadingState === LoadingState.ERROR" cols="12">
      <v-alert type="error">Failed to load related videos.</v-alert>
    </v-col>

    <v-col v-else-if="!mappedItems?.length" cols="12">
      <v-alert type="info">No related videos found.</v-alert>
    </v-col>

    <template v-else>
      <v-col cols="12">
        <v-infinite-scroll @load="loadContinuousPlayScroll" class="overflow-x-hidden">
          <v-row>
            <v-col cols="12">
              <p class="text-h6">
                {{ continuousPlay.title }}
              </p>
            </v-col>

            <v-col v-for="item in mappedItems" :key="item" cols="12">
              <div class="d-none d-sm-block">
                <VideoThumbnail :id="item.id" :title="item.title" :created="item.created"
                  :thumbnail-url="item.thumbnail" :explicit="item.explicit" :duration="item.duration"
                  :views="item.viewCounts?.total" :tonal="item.id === currentVideoId">
                  <template #artists>
                    <ArtistLink v-for="(artist, index) in item.artists" :key="artist.artist.id"
                      :artist-id="artist.artist.id" :artist-name="artist.artist.name"
                      :last="index === item.artists.length - 1" />
                  </template>
                </VideoThumbnail>
              </div>

              <div class="d-sm-none">
                <VideoThumbnail :id="item.id" :title="item.title" :created="item.created"
                  :thumbnail-url="item.thumbnail" :explicit="item.explicit" :duration="item.duration"
                  :views="item.viewCounts?.total" vertical :tonal="item.id === currentVideoId">
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
      </v-col>
    </template>
  </v-row>
</template>
