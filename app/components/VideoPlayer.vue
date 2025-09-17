<script lang="ts" setup>
const props = defineProps<{
  streamUrl?: string;
  captionsUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'ended'): void;
}>();

const {
  loadVideoPlayer,
  htmlVideo,
  streamUrl,
  captionsUrl,
  captionsShowing,
  captionsTrackExists,
  toggleCaptions,
} = useVideoPlayer();

const videoRef = ref();

onMounted(async () => {
  watch(
    () => props.streamUrl,
    async (newStreamUrl) => {
      htmlVideo.value = videoRef.value.video;

      htmlVideo.value!.onended = () => {
        emit('ended');
      };

      streamUrl.value = newStreamUrl!;
      captionsUrl.value = props.captionsUrl!;

      loadVideoPlayer();
    }, { immediate: true }
  );
});
</script>

<template>
  <v-video ref="videoRef" max-height="75vh" volume="50" eager class="video-container">
    <template v-slot:append>
      <v-tooltip text="Captions" location="top">
        <template v-slot:activator="{ props }">
          <v-icon-btn v-bind="props" v-if="captionsTrackExists"
            :icon="captionsShowing ? `mdi-closed-caption` : `mdi-closed-caption-outline`" @click="toggleCaptions">
          </v-icon-btn>
        </template>
      </v-tooltip>
    </template>
  </v-video>
</template>

<style scoped>
.video-container :deep(.v-video__video) {
  object-fit: contain;
  background-color: black;
}
</style>
