<template>
  <v-card flat>
    <v-card-item>
      <v-card-title class="text-h5">
        Up next
      </v-card-title>
      <v-col class="ps-0" cols="12" v-for="item in continuousPlay.items" :key="item.video.id">
        <GenericVideoThumbnail :video="item.video" />
      </v-col>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  continuousPlay: ContinuousPlay;
}>();
</script>
