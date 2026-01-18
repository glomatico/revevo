<script lang="ts" setup>
const props = defineProps<{
  video: any;
  playlistId?: string;
  index?: number;
  vertical?: boolean;
  disabled?: boolean;
  tonal?: boolean;
}>();

const createdDate = ref<Date | null>(props.video.created ? new Date(props.video.created) : null);
const isNewRelease = ref<boolean>(
  createdDate.value
    ? (new Date().getTime() - createdDate.value.getTime()) / (1000 * 60 * 60 * 24) <= 14
    : false
);
const colsThumbnail = ref<number>(props.vertical ? 12 : 6);
const colsInfo = ref<number>(props.vertical ? 12 : 6);
const cardTextAlign = ref<string>(props.vertical ? 'text-center' : '');

const cardVariant = computed<any>(() => (props.tonal ? 'tonal' : 'elevated'));
const url = computed<string>(() => {
  const params = new URLSearchParams();

  if (props.playlistId) {
    params.set('p', props.playlistId);
  }

  if (props.index) {
    params.set('i', props.index.toString());
  }

  return `/video/${props.video.id}${params.toString() ? `?${params.toString()}` : ''}`;
});
</script>

<template>
  <v-card :to="url" :variant="cardVariant" :class="cardTextAlign" :disabled="props.disabled" hoverable>
    <v-row no-gutters>
      <v-col :cols="colsThumbnail">
        <v-img :src="props.video.thumbnail" :alt="`Thumbnail for ${props.video.title}`" :aspect-ratio="16 / 9" />
      </v-col>

      <v-col :cols="colsInfo" align-self="center" class="pa-2">
        <p class="text-truncate font-weight-bold">
          <v-icon v-if="isNewRelease" icon="mdi-new-box" />
          <v-icon v-if="props.video.explicit" icon="mdi-alpha-e-box" />
          {{ video.title }}
        </p>

        <p class="text-truncate text-caption">
          <template v-for="(artist, index) in props.video.artists" :key="artist.id">
            <AppLink :to="`/artist/${artist.artist.id}`">
              {{ artist.artist.name }}
            </AppLink>
            <span v-if="(index as number) < props.video.artists.length - 1">, </span>
          </template>
        </p>

        <p class="text-truncate text-caption">
          {{ formatDuration(props.video.duration) }}
          <span v-if="props.video.viewCounts?.total">
            • {{ props.video.viewCounts.total.toLocaleString() }} views
          </span>
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
