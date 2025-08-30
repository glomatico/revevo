<template>
  <v-card variant="text">
    <v-row>
      <v-col cols="12" sm="auto" class="text-center">
        <v-avatar size="180">
          <v-img :src="artist.thumbnail" :alt="`Profile avatar of ${artist.name}.`" />
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="auto" class="align-self-center">
        <h1>{{ artist.name }}</h1>
        <h3 class="font-weight-regular">{{ artist.viewCounts.total.toLocaleString() }} views • {{
          artist.videos.itemsCount.toLocaleString() }}
          videos</h3>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  artist: Artist;
}>();
</script>