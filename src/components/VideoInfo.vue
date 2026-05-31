<script setup lang="ts">
import { LoadingState } from '@/composables/enums';
import { useDownloadManager } from '@/composables/useDownloadManager';
import { createLoadResult, formatDuration } from '@/composables/utils';
import { computed, ref, watch } from 'vue';
import CopyableReadOnlyField from './CopyableReadOnlyField.vue';

const props = defineProps<{
  video: any;
}>();

const { download } = useDownloadManager();
const downloadRef = ref(createLoadResult<Blob>());
const isDownloadErrorDialogVisible = ref(false);
const isStreamsDialogVisible = ref(false);

const hasStreams = computed(() => {
  return Boolean(
    props.video.hls ||
    props.video.mp4?.length ||
    props.video.captions?.srt?.url ||
    props.video.captions?.vtt?.url ||
    props.video.captions?.ttml?.url,
  );
});

const copyUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);
};

watch(
  () => downloadRef.value.loadingState,
  (newLoadingState) => {
    if (newLoadingState === LoadingState.ERROR) {
      isDownloadErrorDialogVisible.value = true;
    }
  },
);
</script>

<template>
  <v-dialog v-model="isDownloadErrorDialogVisible" max-width="500">
    <v-card>
      <v-card-title>
        {{ $t('videoInfo.downloadErrorTitle') }}
      </v-card-title>

      <v-card-text>
        {{ downloadRef.errorMessage || $t('videoInfo.downloadErrorGeneric') }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="outlined" rounded @click="isDownloadErrorDialogVisible = false">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isStreamsDialogVisible" max-width="700">
    <v-card>
      <v-card-title>
        {{ $t('videoInfo.streams') }}
      </v-card-title>

      <v-card-text>
        <v-table>
          <tbody>
            <tr v-if="props.video.hls">
              <td>HLS</td>
              <td>
                <CopyableReadOnlyField :value="props.video.hls" />
              </td>
            </tr>

            <tr v-for="stream in props.video.mp4 || []" :key="stream.url">
              <td>MP4 {{ stream.quality }}</td>
              <td>
                <CopyableReadOnlyField :value="stream.url" />
              </td>
            </tr>

            <tr v-if="props.video.captions?.srt?.url">
              <td>{{ $t('videoInfo.captionsSrt') }}</td>
              <td>
                <CopyableReadOnlyField :value="props.video.captions.srt.url" />
              </td>
            </tr>

            <tr v-if="props.video.captions?.vtt?.url">
              <td>{{ $t('videoInfo.captionsVtt') }}</td>
              <td>
                <CopyableReadOnlyField :value="props.video.captions.vtt.url" />
              </td>
            </tr>

            <tr v-if="props.video.captions?.ttml?.url">
              <td>{{ $t('videoInfo.captionsTtml') }}</td>
              <td>
                <CopyableReadOnlyField :value="props.video.captions.ttml.url" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="outlined" rounded @click="isStreamsDialogVisible = false">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row>
    <v-col cols="12">
      <v-row dense align="center" class="mb-2">
        <v-col style="min-width: 0">
          <h1 class="text-wrap text-break font-weight-bold ma-0">
            {{ props.video.title }}
          </h1>
        </v-col>

        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-btn icon variant="text" v-bind="menuProps">
                <v-badge :model-value="downloadRef.loadingState === LoadingState.LOADING" dot color="warning">
                  <v-icon icon="mdi-dots-vertical" />
                </v-badge>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="copyUrl">
                <template #prepend>
                  <v-icon icon="mdi-content-copy" />
                </template>

                <v-list-item-title>
                  {{ $t('videoInfo.copyUrl') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item v-if="hasStreams" @click="isStreamsDialogVisible = true">
                <template #prepend>
                  <v-icon icon="mdi-link-variant" />
                </template>

                <v-list-item-title>
                  {{ $t('videoInfo.showStreams') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="download(props.video, downloadRef)"
                :disabled="downloadRef.loadingState === LoadingState.LOADING">
                <template #prepend>
                  <v-icon v-if="downloadRef.loadingState === LoadingState.IDLE" icon="mdi-download" />

                  <v-icon v-else-if="downloadRef.loadingState === LoadingState.ERROR" icon="mdi-alert-circle" />

                  <v-icon v-else-if="downloadRef.loadingState === LoadingState.SUCCESS" icon="mdi-check" />

                  <v-icon v-else>
                    <v-progress-circular indeterminate size="small" />
                  </v-icon>
                </template>

                <v-list-item-title>
                  {{ $t('videoInfo.download') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <v-divider thickness="2" />
    </v-col>


    <v-col cols="12">
      <v-table>
        <tbody>
          <tr v-if="props.video.artists?.length">
            <td>{{ $t('videoInfo.artists') }}</td>
            <td>
              <v-row dense class="my-2">
                <v-col v-for="artist in props.video.artists" :key="artist.artist.id" cols="auto">
                  <v-chip :to="`/artist/${artist.artist.id}`" variant="outlined">
                    <v-avatar start>
                      <v-img v-if="artist.artist.thumbnail" :src="artist.artist.thumbnail"
                        :alt="`Profile avatar for ${artist.artist.name}`" />
                      <v-icon v-else icon="mdi-account-circle" />
                    </v-avatar>

                    {{ artist.artist.name }}
                  </v-chip>
                </v-col>
              </v-row>
            </td>
          </tr>

          <tr v-if="props.video.viewCounts?.total">
            <td>{{ $t('videoInfo.views') }}</td>
            <td>{{ props.video.viewCounts.total.toLocaleString() }}</td>
          </tr>

          <tr>
            <td>{{ $t('videoInfo.isrc') }}</td>
            <td>{{ props.video.id }}</td>
          </tr>

          <tr v-if="props.video.duration">
            <td>{{ $t('videoInfo.duration') }}</td>
            <td>{{ formatDuration(props.video.duration) }}</td>
          </tr>

          <tr v-if="props.video.created">
            <td>{{ $t('videoInfo.releaseDate') }}</td>
            <td>{{ new Date(props.video.created).toLocaleDateString() }}</td>
          </tr>

          <tr v-if="props.video.genre">
            <td>{{ $t('videoInfo.genre') }}</td>
            <td>{{ props.video.genre }}</td>
          </tr>

          <tr>
            <td>{{ $t('videoInfo.explicit') }}</td>
            <td>{{ props.video.explicit ? $t('common.yes') : $t('common.no') }}</td>
          </tr>

          <tr>
            <td>{{ $t('videoInfo.lyricVideo') }}</td>
            <td>{{ props.video.lyricVideo ? $t('common.yes') : $t('common.no') }}</td>
          </tr>

          <tr v-if="props.video.label">
            <td>{{ $t('videoInfo.label') }}</td>
            <td>{{ props.video.label }}</td>
          </tr>

          <tr v-if="props.video.copyright">
            <td>{{ $t('videoInfo.copyright') }}</td>
            <td>{{ props.video.copyright }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>
