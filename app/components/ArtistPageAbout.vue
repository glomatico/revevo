<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4 font-weight-bold">Biography</p>
    </v-col>

    <v-col cols="12">
      <p>
        <template v-if="artist.basicMeta.bio">
          {{ artist.basicMeta.bio.text }}
        </template>
        <template v-else>
          No biography available for this artist.
        </template>
      </p>
    </v-col>

    <v-col cols="12">
      <p class="text-h4 font-weight-bold">Links</p>
    </v-col>

    <v-col cols="12">
      <v-row v-if="artist.basicMeta.links?.length !== 0" dense>
        <v-col v-for="link in artist.basicMeta.links" cols="auto" :key="link.url" class="d-flex flex-wrap ga-2">
          <v-btn :href="link.url" target="_blank" variant="outlined">
            {{ link.type }}
          </v-btn>
        </v-col>
      </v-row>
      <p v-else>No links available for this artist.</p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  artist: Artist;
}>();
</script>
