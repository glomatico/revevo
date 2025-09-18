<template>
  <v-card :to="`/artist/${artist.urlSafeName}`">
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <v-avatar size="180" class="ma-2">
          <v-img v-if="resizedAvatarlUrl" :src="resizedAvatarlUrl" :alt="`Profile avatar of ${artist.name}.`" />
          <v-icon v-else size="120">mdi-account-circle</v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="12">
        <v-card-item>
          <p class="text-center">{{ artist.name }}</p>
        </v-card-item>
      </v-col>
    </v-row>
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
