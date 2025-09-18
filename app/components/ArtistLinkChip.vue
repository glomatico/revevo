<template>
  <v-row dense>
    <v-col v-for="artist in artistsFiltered" :key="artist.basicMeta.name" cols="auto">
      <v-chip rounded :to="`/artist/${artist.basicMeta.urlSafeName}`">
        <v-row dense align="center">
          <v-col>
            <v-avatar v-if="addAvatar">
              <v-img v-if="artist.basicMeta.thumbnailUrl" :src="resizeImageUrl(artist.basicMeta.thumbnailUrl, 32, 32)"
                :alt="`Avatar for ${artist.basicMeta.name}`" />
              <v-icon v-else size="26">mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>

          <v-col>
            <p>
              {{ artist.basicMeta.name }}
            </p>
          </v-col>
        </v-row>
      </v-chip>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoArtists: Artist[];
  mainOnly?: boolean;
  addAvatar?: boolean;
}>();

const artistsFiltered = ref<Artist[]>([]);

onMounted(async () => {
  if (props.mainOnly) {
    artistsFiltered.value = props.videoArtists.filter(artist => artist.basicMeta.role === 'main');
  } else {
    artistsFiltered.value = props.videoArtists;
  }
});
</script>
