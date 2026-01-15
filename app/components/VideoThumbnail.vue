<script lang="ts" setup>
const props = defineProps<{
  video: any;
  playlistId?: string;
  index?: number;
  vertical?: boolean;
  disabled?: boolean;
  tonal?: boolean;
}>();

const router = useRouter();

const createdDate = ref<Date | null>(props.video.created ? new Date(props.video.created) : null);
const isNewRelease = ref<boolean>(
  createdDate.value
    ? (new Date().getTime() - createdDate.value.getTime()) / (1000 * 60 * 60 * 24) <= 14
    : false
);
const colsThumbnail = ref<number>(props.vertical ? 12 : 5);
const colsInfo = ref<number>(props.vertical ? 12 : 7);
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
  <v-card @click.prevent="!disabled && router.push(url)" :href="url" :disabled="disabled" :variant="cardVariant">
    <v-row no-gutters align="center">
      <v-col :cols="colsThumbnail">
        <v-img :src="props.video.thumbnail" :alt="`Thumbnail for ${props.video.title}`" :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col :cols="colsInfo">
        <v-card-item :class="cardTextAlign">
          <p class="text-truncate" :title="props.video.title">
            <v-icon v-if="isNewRelease" icon="mdi-new-box" />
            <v-icon v-if="props.video.explicit" icon="mdi-alpha-e-box" />
            {{ props.video.title }}
          </p>

          <p class="text-truncate text-caption">
            <ArtistLink :artists="props.video.artists" />
          </p>

          <p class="text-truncate text-caption">
            <template v-if="props.video.duration">
              {{ formatDuration(props.video.duration) }}
            </template>

            <template v-if="props.video.viewCounts?.total">
              • {{ props.video.viewCounts.total.toLocaleString() }} views
            </template>
          </p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
