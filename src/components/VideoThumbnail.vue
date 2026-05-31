<script setup lang="ts">
import { LoadingState } from '@/composables/enums';
import { useDownloadManager } from '@/composables/useDownloadManager';
import { createLoadResult, formatDuration } from '@/composables/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppLink from './AppLink.vue';

const props = defineProps<{
  video: any;
  playlistId?: string;
  index?: number;
  vertical?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const route = useRoute();
const { download } = useDownloadManager();

const downloadRef = ref(createLoadResult<Blob>());
const isErrorDialogVisible = ref(false);
const createdDate = ref<Date | null>(props.video.created ? new Date(props.video.created) : null);
const isNewRelease = ref(
  createdDate.value
    ? (new Date().getTime() - createdDate.value.getTime()) / (1000 * 60 * 60 * 24) <= 14
    : false
);
const colsThumbnail = computed(() => props.vertical ? 12 : 4);
const colsInfo = computed(() => props.vertical ? 12 : 8);
const cardTextAlign = computed(() => props.vertical ? 'text-center' : '');

const tonal = computed(() => route.path.startsWith(`/video/${props.video.id}`));
const cardVariant = computed(() => tonal.value ? 'tonal' : 'text');

const url = computed(() => {
  const params = new URLSearchParams();

  if (props.playlistId) {
    params.set('p', props.playlistId);
  }

  if (props.index) {
    params.set('i', props.index.toString());
  }

  return `/video/${props.video.id}${params.toString() ? `?${params.toString()}` : ''}`;
});

const copyUrl = async () => {
  await navigator.clipboard.writeText(new URL(url.value, window.location.origin).href);
};

onMounted(async () => {
  watch(
    () => downloadRef.value.loadingState,
    (newLoadingState) => {
      if (newLoadingState === LoadingState.ERROR) {
        isErrorDialogVisible.value = true;
      }
    }
  );
});
</script>

<template>
  <v-dialog max-width="500" v-model="isErrorDialogVisible">
    <v-card>
      <v-card-title>
        {{ $t('videoThumbnail.error.title') }}
      </v-card-title>

      <v-card-text>
        {{ downloadRef.errorMessage || $t('videoThumbnail.error.generic') }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn>
          {{ $t('videoThumbnail.error.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card :variant="cardVariant" :class="cardTextAlign" :disabled="props.disabled" :to="url"
    @click="emit('click', $event)">
    <v-row align="center" dense>
      <v-col :cols="colsThumbnail">
        <v-img rounded :src="props.video.thumbnail" :alt="`Thumbnail for ${props.video.title}`"
          :aspect-ratio="16 / 9" />
      </v-col>

      <v-col :cols="colsInfo">
        <v-row dense align="center">
          <v-col style="min-width: 0">
            <h4 class="text-truncate font-weight-bold text-left ma-0 mb-1">
              <v-icon v-if="isNewRelease" icon="mdi-new-box" />
              <v-icon v-if="props.video.explicit" icon="mdi-alpha-e-box" />
              {{ video.title }}
            </h4>

            <p class="text-truncate text-label-medium text-left ma-0 mb-1">
              <template v-for="(artist, index) in props.video.artists" :key="artist.id">
                <AppLink :to="`/artist/${artist.artist.id}`">
                  {{ artist.artist.name }}
                </AppLink>
                <span v-if="(index as number) < props.video.artists.length - 1">, </span>
              </template>
            </p>

            <p class="text-truncate text-label-medium text-left ma-0">
              {{ formatDuration(props.video.duration) }}
              <template v-if="props.video.viewCounts?.total">
                • {{ props.video.viewCounts.total.toLocaleString() }} {{ $t('videoThumbnail.views') }}
              </template>
            </p>
          </v-col>

          <v-col cols="auto">
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn icon variant="text" size="x-small" v-bind="menuProps" @click.prevent>
                  <v-badge :model-value="downloadRef.loadingState === LoadingState.LOADING" dot color="warning">
                    <v-icon size="x-small" icon="mdi-dots-vertical" />
                  </v-badge>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click.prevent="copyUrl">
                  <v-list-item-title>
                    {{ $t('videoThumbnail.copyUrl') }}
                  </v-list-item-title>

                  <template #prepend>
                    <v-icon icon="mdi-content-copy" />
                  </template>
                </v-list-item>

                <v-list-item @click="download(props.video, downloadRef)"
                  :disabled="downloadRef.loadingState === LoadingState.LOADING">
                  <v-list-item-title>
                    {{ $t('videoThumbnail.download') }}
                  </v-list-item-title>

                  <template #prepend>
                    <v-icon v-if="downloadRef.loadingState === LoadingState.IDLE" icon="mdi-download" />

                    <v-icon v-else-if="downloadRef.loadingState === LoadingState.ERROR" icon="mdi-alert-circle" />

                    <v-icon v-else-if="downloadRef.loadingState === LoadingState.SUCCESS" icon="mdi-check" />

                    <v-icon v-else>
                      <v-progress-circular indeterminate size="small" />
                    </v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
