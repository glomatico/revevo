<template>
  <v-card :link="true" hover :to="`/artist/${artist.urlSafeName}`">
    <v-card-item align="center">
      <v-avatar size="120">
        <v-img v-if="resizedAvatarlUrl" :src="resizedAvatarlUrl" :alt="`Profile avatar of ${artist.name}.`"
          :aspect-ratio="1" />
        <v-icon v-else size="120">mdi-account-circle</v-icon>
      </v-avatar>
    </v-card-item>

    <v-card-title class="text-truncate text-center">
      {{ artist.name }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: BasicArtistMeta;
}>();

const resizedAvatarlUrl = ref<string | null>(null);

if (props.artist?.thumbnailUrl) {
  resizedAvatarlUrl.value = resizeImageUrl(props.artist.thumbnailUrl, 256, 256);
}
</script>
