<script setup lang="ts">
import PlayQueue from '@/components/PlayQueue.vue';
import { usePlayQueue } from '@/composables/usePlayQueue';
import { provide } from 'vue';

const playQueue = usePlayQueue();

provide("playQueue", playQueue);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <RouterView />
      </v-col>

      <v-col cols="12" md="4">
        <PlayQueue :play-queue="playQueue" />
      </v-col>
    </v-row>
  </v-container>
</template>
