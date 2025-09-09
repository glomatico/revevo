<template>
  <v-row>
    <v-col cols="12" sm="auto" class="text-center">
      <v-avatar size="180">
        <v-img :src="resizedAvatarlUrl" :alt="`Profile avatar of ${artist.basicMeta.name}.`" />
      </v-avatar>
    </v-col>
    <v-col cols="12" sm="auto" class="align-self-center text-center text-sm-left">
      <p class="text-h4 font-weight-bold">{{ artist.basicMeta.name }}</p>
      <p class="text-h6">
        {{ artist.videoData?.videos.paging.total.toLocaleString() }} videos
        <template v-if="artist.basicMeta.views">
          • views {{ artist.basicMeta.views.viewsTotal }}
        </template>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: Artist;
}>();

const resizedAvatarlUrl = resizeImageUrl(props.artist.basicMeta.thumbnailUrl, 256, 256);
</script>
