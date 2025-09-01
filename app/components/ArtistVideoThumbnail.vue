<template>
  <v-card class="mx-auto" max-width="320" :link="true" hover :to="`/video/${video.id}`">
    <v-img :src="video.thumbnail" :alt="`Thumbnail for ${video.title}`" height="180px" />
    <v-card-title class="text-truncate text-center" :title="video.title">
      <v-icon v-if="video.explicit" class="alpha-e-box" size="24" icon="mdi-alpha-e-box" />
      {{ video.title }}
    </v-card-title>
    <v-card-subtitle class="text-center">
      {{ video.viewCounts.total.toLocaleString() }} views • {{ formatDuration(video.duration) }}
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  video: ArtistVideo;
}>();
</script>
