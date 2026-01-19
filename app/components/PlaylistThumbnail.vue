<script lang="ts" setup>
const props = defineProps<{
  playlist: any;
  width?: number;
}>();
</script>

<template>
  <v-card :to="`/playlist/${props.playlist.id}`" :width="width || 'auto'">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-img :src="props.playlist.thumbnail" :alt="`Thumbnail for ${props.playlist.title}`" :aspect-ratio="16 / 9"
          cover />
      </v-col>

      <v-col class="pa-2">
        <p class="text-center text-truncate font-weight-bold">
          {{ props.playlist.title }}
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
