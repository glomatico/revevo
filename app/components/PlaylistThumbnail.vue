<script lang="ts" setup>
defineProps<{
  id: string;
  thumbnailUrl: string;
  title: string;
}>();
</script>

<template>
  <v-card :to="`/playlist/${id}`">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-img :src="thumbnailUrl" :alt="`Thumbnail for ${title}`" :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ title }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
