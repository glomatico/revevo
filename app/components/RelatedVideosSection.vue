<template>
  <v-row>
    <v-col cols="12">
      <h2>Up next</h2>
    </v-col>
    <v-col cols="12" v-for="item in continuousPlay.items" :key="item.video.id">
      <RelatedVideoThumbnail :video="item.video" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  continuousPlay: ContinuousPlay;
}>();
</script>
