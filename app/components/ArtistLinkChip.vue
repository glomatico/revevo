<script lang="ts" setup>
defineProps<{
  artistId: string;
  artistName: string;
  artistThumbnail: string;
}>();
</script>


<template>
  <v-chip rounded :to="`/artist/${artistId}`">
    <v-row dense align="center">
      <v-col>
        <v-avatar>
          <v-img v-if="artistThumbnail" :src="artistThumbnail" :alt="`Profile avatar for ${artistName}`" />
          <v-icon v-else size="26">mdi-account-circle</v-icon>
        </v-avatar>
      </v-col>

      <v-col>
        <p>
          {{ artistName }}
        </p>
      </v-col>
    </v-row>
  </v-chip>
</template>
