<template>
  <v-card class="mx-auto" :link="true" hover :to="`/video/${video.basicMetaV3.isrc}`">
    <v-row no-gutters>
      <v-col cols="5">
        <v-img :src="video.basicMetaV3.thumbnailUrl" :alt="`Thumbnail for ${video.basicMetaV3.title}`"
          :aspect-ratio="16 / 9" cover />
      </v-col>
      <v-col cols="7">
        <v-card-item>
          <v-card-title class="text-truncate text-body-2" :title="video.basicMetaV3.title">
            <v-icon v-if="video.basicMetaV3.explicit" size="24" icon="mdi-alpha-e-box" />
            {{ video.basicMetaV3.title }}
          </v-card-title>

          <v-card-subtitle>
            <ArtistLink :video-artists="video.basicMetaV3.artists!" />
            {{ formatDuration(video.basicMetaV3.duration!) }}
            <template v-if="video.views && video.views.viewsTotal">
              • {{ video.views.viewsTotal.toLocaleString() }} views
            </template>
          </v-card-subtitle>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();
</script>
