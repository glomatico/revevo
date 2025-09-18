<script lang="ts" setup>
const router = useRouter();

const props = defineProps<{
  video: Video;
  vertical?: boolean;
  disabled?: boolean;
  playlistId?: string;
  playlistIndex?: number;
  tonal?: boolean;
}>();

const colsThumbnail = ref<number>(props.vertical ? 12 : 5);
const colsInfo = ref<number>(props.vertical ? 12 : 7);
const cardTextAlign = ref<string>(props.vertical ? 'text-center' : '');
const cardVariant = computed(() => (props.tonal ? 'tonal' : 'elevated'));
const url = ref<string>(props.playlistId
  ? `/video?v=${props.video.basicMetaV3.isrc}&p=${props.playlistId}&i=${props.playlistIndex || 0}`
  : `/video?v=${props.video.basicMetaV3.isrc}`);

const navigateToVideo = async () => {
  if (props.playlistId) {
    const query = router.resolve(url.value).query;
    await router.push({
      path: '/video',
      query,
    });
  } else {
    navigateTo(url.value);
  }

};
</script>

<template>
  <v-card @click.prevent="navigateToVideo" :href="url" :disabled="props.disabled" :variant="cardVariant">
    <v-row no-gutters align="center">
      <v-col :cols="colsThumbnail">
        <v-img :src="video.basicMetaV3.thumbnailUrl" :alt="`Thumbnail for ${video.basicMetaV3.title}`"
          :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col :cols="colsInfo">
        <v-card-item :class="cardTextAlign">
          <p class="text-truncate" :title="video.basicMetaV3.title">
            <v-icon v-if="video.basicMetaV3.explicit" icon="mdi-alpha-e-box" />
            {{ video.basicMetaV3.title }}
          </p>

          <p class="text-truncate text-caption">
            <ArtistLink :video-artists="video.basicMetaV3.artists!" main-only />
          </p>

          <p class="text-truncate text-caption">
            {{ formatDuration(video.basicMetaV3.duration!) }}
            <template v-if="video.views && video.views.viewsTotal">
              • {{ video.views.viewsTotal.toLocaleString() }} views
            </template>
          </p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>