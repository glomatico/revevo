<script lang="ts" setup>
const props = defineProps<{
  artist: BasicArtistMeta;
}>();

const resizedAvatarlUrl = ref('');

if (props.artist?.thumbnailUrl) {
  resizedAvatarlUrl.value = resizeImageUrl(props.artist.thumbnailUrl, 256, 256);
}
</script>

<template>
  <v-card :to="`/artist/${artist.urlSafeName}`">
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <v-img class="ma-2" :src="resizedAvatarlUrl" :alt="`Profile avatar of ${artist.name}.`" rounded="circle"
          :aspect-ratio="1" width="120">
          <div v-if="!resizedAvatarlUrl">
            <v-icon size="120">
              mdi-account-circle
            </v-icon>
          </div>
        </v-img>
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ artist.name }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
