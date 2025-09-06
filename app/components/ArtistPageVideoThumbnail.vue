<template>
  <v-card :link="true" hover :to="`/video/${video.basicMetaV3.isrc}`">
    <v-img :src="video.basicMetaV3.thumbnailUrl" :alt="`Thumbnail for ${video.basicMetaV3.title}`" cover
      :aspect-ratio="16 / 9" />
    <v-card-item>
      <v-card-title class="text-truncate text-center" :title="video.basicMetaV3.title">
        <v-icon v-if="isNewRelease" size="24" icon="mdi-new-box" />
        <v-icon v-if="video.basicMetaV3.explicit" size="24" icon="mdi-alpha-e-box" />
        {{ video.basicMetaV3.title }}
      </v-card-title>
      <v-card-subtitle class="text-center">
        {{ formatDuration(video.basicMetaV3.duration!) }}
        <template v-if="video.views?.viewsTotal">
          • {{ video.views?.viewsTotal.toLocaleString() }} views
        </template>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  video: Video;
}>();

const videoReleaseDate = props.video.basicMetaV3.releaseDate
  ? new Date(props.video.basicMetaV3.releaseDate)
  : null;
const isNewRelease = ref<boolean>(videoReleaseDate
  ? (new Date().getTime() - videoReleaseDate.getTime()) / (1000 * 60 * 60 * 24) <= 14
  : false);
</script>
