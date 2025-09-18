<script lang="ts" setup>
const props = defineProps<{
  video: Video;
}>();

const videoReleaseDate = ref(
  props.video.basicMetaV3.releaseDate
    ? new Date(props.video.basicMetaV3.releaseDate)
    : null
);
const isNewRelease = ref(
  videoReleaseDate.value
    ? (new Date().getTime() - videoReleaseDate.value.getTime()) / (1000 * 60 * 60 * 24) <= 14
    : false
);
</script>

<template>
  <v-card :to="`/video?v=${video.basicMetaV3.isrc}`">
    <v-row no-gutters>
      <v-col cols="12">
        <v-img :src="video.basicMetaV3.thumbnailUrl" :alt="`Thumbnail for ${video.basicMetaV3.title}`" cover
          :aspect-ratio="16 / 9" height="100%" />
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-truncate text-center" :title="video.basicMetaV3.title">
            <v-icon v-if="isNewRelease" icon="mdi-new-box" />
            <v-icon v-if="video.basicMetaV3.explicit" icon="mdi-alpha-e-box" />
            {{ video.basicMetaV3.title }}
          </p>

          <p class="text-center text-caption">
            {{ formatDuration(video.basicMetaV3.duration) }}
            <template v-if="video.views?.viewsTotal">
              • {{ video.views.viewsTotal.toLocaleString() }} views
            </template>
          </p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
