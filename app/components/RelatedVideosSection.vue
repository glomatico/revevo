<template>
  <v-card flat>
    <v-card-item>
      <v-card-title>
        <h2>Up next</h2>
      </v-card-title>
    </v-card-item>
    <v-col cols="12" v-for="item in continuousPlay.items" :key="item.video.id">
      <GenericVideoThumbnail :video="item.video" />
    </v-col>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  continuousPlay: ContinuousPlay;
}>();
</script>
