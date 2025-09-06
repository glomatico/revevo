<template>
  <v-row>
    <v-col cols=12>
      <p class="text-h5 font-weight-bold">Biography</p>
    </v-col>

    <v-col cols=12>
      <p>
        <template v-if="artist.basicMeta.bio">
          {{ artist.basicMeta.bio }}
        </template>
        <template v-else>
          No biography available for this artist.
        </template>
      </p>
    </v-col>

    <v-col cols="12">
      <p class="text-h5 font-weight-bold">Links</p>
    </v-col>

    <v-col cols=12>
      <div v-if="artist.basicMeta.links?.length !== 0" class="d-flex ga-2">
        <v-btn v-for="link in artist.basicMeta.links" :key="link.url" :href="link.url" target="_blank"
          variant="outlined">
          {{ link.type }}
        </v-btn>
      </div>
      <p v-else>No links available for this artist.</p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  artist: Artist;
}>();
</script>
