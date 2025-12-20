<script lang="ts" setup>
import { ref, computed } from 'vue';

const router = useRouter();

const props = defineProps<{
  id: string;
  title: string;
  created: string;
  thumbnailUrl: string;
  explicit: boolean;
  duration?: number;
  views?: number;
  playlistId?: string;
  playlistIndex?: number;
  vertical?: boolean;
  disabled?: boolean;
  tonal?: boolean;
}>();

const createdDate = ref(props.created ? new Date(props.created) : null);
const isNewRelease = ref(
  createdDate.value
    ? (new Date().getTime() - createdDate.value.getTime()) / (1000 * 60 * 60 * 24) <= 14
    : false
);

const colsThumbnail = ref(props.vertical ? 12 : 5);
const colsInfo = ref(props.vertical ? 12 : 7);
const cardTextAlign = ref(props.vertical ? 'text-center' : '');
const cardVariant = computed(() => (props.tonal ? 'tonal' : 'elevated'));
const url = ref(
  props.playlistId
    ? `/video?v=${props.id}&p=${props.playlistId}&i=${props.playlistIndex || 0}`
    : `/video?v=${props.id}`
);

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
  <v-card @click.prevent="navigateToVideo" :href="url" :disabled="disabled" :variant="cardVariant">
    <v-row no-gutters align="center">
      <v-col :cols="colsThumbnail">
        <v-img :src="thumbnailUrl" :alt="`Thumbnail for ${title}`" :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col :cols="colsInfo">
        <v-card-item :class="cardTextAlign">
          <p class="text-truncate" :title="title">
            <v-icon v-if="isNewRelease" icon="mdi-new-box" />
            <v-icon v-if="explicit" icon="mdi-alpha-e-box" />
            {{ title }}
          </p>

          <p class="text-truncate text-caption">
            <slot name="artists" />
          </p>

          <p class="text-truncate text-caption">
            <template v-if="duration">
              {{ formatDuration(duration) }}
            </template>

            <template v-if="views">
              • {{ views.toLocaleString() }} views
            </template>
          </p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
