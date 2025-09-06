<template>
  <v-card :link="true" hover :to="`/video/${video.id}`">
    <v-img :src="video.basicMetaV3.thumbnailUrl" :alt="`Thumbnail for ${video.basicMetaV3.title}`" cover
      :aspect-ratio="16 / 9" />
    <v-card-item>
      <v-card-title class="text-truncate text-center" :title="video.basicMetaV3.title">
        <v-icon v-if="video.basicMetaV3.explicit" class="alpha-e-box" size="24" icon="mdi-alpha-e-box" />
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

console.log(props.video);
</script>
