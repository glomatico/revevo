<script lang="ts" setup>
const props = defineProps<{
  artist: any;
}>();
</script>

<template>
  <v-row>
    <v-col cols="12" sm="auto" class="text-center">
      <v-avatar size="180">
        <v-img v-if="props.artist.thumbnail" :src="props.artist.thumbnail"
          :alt="`Profile avatar of ${props.artist.name}.`" />
        <v-icon v-else size="180">mdi-account-circle</v-icon>
      </v-avatar>
    </v-col>

    <v-col cols="12" sm="auto" align-self="center" class="text-center text-sm-left">
      <p class="text-h4 font-weight-bold">{{ props.artist.name }}</p>

      <p class="text-h6">
        <template v-if="props.artist.videos.itemsCount != null">
          {{ props.artist.videos.itemsCount.toLocaleString() }} video(s)
        </template>

        <template v-if="props.artist.viewCounts.total != null">
          • {{ props.artist.viewCounts.total.toLocaleString() }} view(s)
        </template>
      </p>
    </v-col>
  </v-row>
</template>
