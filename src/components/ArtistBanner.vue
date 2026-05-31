<script lang="ts" setup>
const props = defineProps<{
  artist: any;
}>();
</script>

<template>
  <v-row>
    <v-col cols="12" sm="auto" class="text-center">
      <v-avatar size="180">
        <v-img v-if="artist.thumbnail" :src="artist.thumbnail" :alt="`Profile avatar of ${artist.name}.`" />

        <v-icon v-else size="180">mdi-account-circle</v-icon>
      </v-avatar>
    </v-col>

    <v-col cols="12" sm="auto" align-self="center" class="text-center text-sm-left">
      <h1 class="ma-0 mb-2">
        {{ artist.name }}
      </h1>

      <p class="ma-0">
        {{ artist.videos.itemsCount.toLocaleString() }} {{ $t('artist.videos') }}

        <template v-if="artist.viewCounts.total != null">
          • {{ artist.viewCounts.total.toLocaleString() }} {{ $t('artist.views') }}
        </template>
      </p>
    </v-col>
  </v-row>
</template>
