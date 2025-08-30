<template>
  <v-card class="mx-auto" max-width="320" :link="true" hover :to="`/video/${video.id}`">
    <v-img :src="video.thumbnail" :alt="`Thumbnail for ${video.title}`" height="180px" />
    <v-card-title class="text-truncate text-center" :title="video.title">{{ video.title }}</v-card-title>
    <v-card-subtitle class="text-center">
      {{ formatArtist(video.artists) }}
    </v-card-subtitle>
    <v-card-subtitle class="text-center">
      {{ video.viewCounts.total.toLocaleString() }} views • {{ formatDuration(video.duration) }}
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  video: Video;
}>();

const formatArtist = (artists: VideoArtist[]): string => {
  return artists.map(artist => artist.artist.name).join(', ');
};

const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};
</script>
