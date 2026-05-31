<script setup lang="ts">
const props = defineProps<{
  playlist: any;
}>();
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-img rounded :src="props.playlist.thumbnail" :alt="`Thumbnail for ${props.playlist.title}.`"
        :aspect-ratio="16 / 9" cover />
    </v-col>

    <v-col cols="12">
      <h1 class="text-center ma-0 mb-2">
        {{ props.playlist.title }}
      </h1>

      <p class="text-label-medium text-center ma-0 mb-2">
        {{ $t('playlist.videoCount', { count: props.playlist.itemsCount || 0 }) }}
      </p>

      <p v-if="props.playlist.description" class="ma-0">
        {{ props.playlist.description }}
      </p>
    </v-col>
  </v-row>
</template>
