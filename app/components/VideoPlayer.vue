<template>
  <v-container fluid class="pa-0">
    <video ref="videoHtml" controls class="video-player">
      <track kind="subtitles" :src="captionsUrl" srclang="en" label="English" default />
    </video>
  </v-container>
</template>

<script lang="ts" setup>
import Hls from 'hls.js';

const props = defineProps<{
  streamUrl: string;
  captionsUrl: string;
}>();

const videoHtml = ref<HTMLVideoElement>();


const toggleCaptionsFromStorage = async () => {
  const enableCaptions = localStorage.getItem('enableCaptions') === 'true';
  Array.from(videoHtml.value!.textTracks).forEach((track) => {
    if (track.kind === 'subtitles') {
      track.mode = enableCaptions ? 'showing' : 'hidden';
    }
  });
};

const writeCaptionsPreference = async (enable: boolean = false) => {
  localStorage.setItem('enableCaptions', enable.toString());
};

const loadVideo = async () => {
  const hls = new Hls();
  hls.loadSource(props.streamUrl);
  hls.attachMedia(videoHtml.value!);
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    videoHtml.value?.play();
  });

  videoHtml.value!.textTracks.addEventListener('change', () => {
    const tracks = videoHtml.value!.textTracks;

    Array.from(tracks).forEach((track) => {
      if (track.kind !== 'subtitles') return;
      writeCaptionsPreference(track.mode === 'showing');
    });
  });
};

onMounted(async () => {
  try {
    await loadVideo();
    await toggleCaptionsFromStorage();
  } catch (error) {
    console.error('Error loading video:', error);
  }
});
</script>

<style scoped>
.video-player {
  height: 1920px;
  width: 100%;
  object-fit: contain;
  background-color: #000;
  max-height: 70vh;
  min-height: 180px;
}
</style>
