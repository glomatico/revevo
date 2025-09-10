<template>
  <v-row>
    <v-col cols="12" sm="auto" class="text-center">
      <v-avatar size="180">
        <v-img v-if="resizedAvatarlUrl" :src="resizedAvatarlUrl" :alt="`Profile avatar of ${artist.basicMeta.name}.`" />
        <v-icon v-else size="180">mdi-account-circle</v-icon>
      </v-avatar>
    </v-col>
    <v-col cols="12" sm="auto" class="align-self-center text-center text-sm-left">
      <p class="text-h4 font-weight-bold">{{ artist.basicMeta.name }}</p>
      <p class="text-h6">
        <template v-if="artist.videoData?.videos?.paging?.total!">
          {{ artist.videoData?.videos.paging.total.toLocaleString() }} videos
        </template>
        <template v-if="artist.basicMeta.views">
          • views {{ artist.basicMeta.views.viewsTotal }}
        </template>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: Artist;
}>();

const resizedAvatarlUrl = ref<string | null>(null);

if (props.artist.basicMeta?.thumbnailUrl) {
  resizedAvatarlUrl.value = resizeImageUrl(props.artist.basicMeta.thumbnailUrl, 256, 256);
}

</script>
