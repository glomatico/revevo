<template>
  <v-row>
    <v-col v-if="relatedArtists.length !== 0" v-for="artist in relatedArtists" cols="12" sm="6" md="4" lg="3">
      <v-card :link="true" hover :to="`/artist/${artist.urlSafeName}`">
        <v-card-item align="center">
          <v-avatar size="50%">
            <v-img :src="artist.thumbnailUrl" :alt="`Profile avatar for ${artist.name}`" :aspect-ratio="1" />
          </v-avatar>
        </v-card-item>

        <v-card-title class="text-truncate text-center">
          {{ artist.name }}
        </v-card-title>
      </v-card>
    </v-col>
    <v-col v-else cols="12">
      <v-alert type="info">No related artists found.</v-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: Artist;
}>();

const relatedArtists = ref<BasicArtistMeta[]>(props.artist.relatedArtists?.filter(a => a.name != props.artist.basicMeta.name) || []);
</script>