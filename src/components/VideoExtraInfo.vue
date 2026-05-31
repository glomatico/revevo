<script setup lang="ts">
import { useVideoExtraInfo } from '@/composables/useVideoExtraInfo';
import { computed, watch } from 'vue';
import AppStatusContainer from './AppStatusContainer.vue';

const props = defineProps<{
  video: any;
}>();

const visible = defineModel<boolean>("visible", { default: false });

const {
  extraInfo,
  isExtraInfoValid,
  loadingState,
  initialize,
} = useVideoExtraInfo();

const formatBoolean = (value: boolean | undefined) => {
  if (typeof value !== "boolean") {
    return "";
  }

  return value ? "Yes" : "No";
};

const formatDate = (value?: string) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString();
};

const formatNumber = (value?: number) => {
  return typeof value === "number" ? value.toLocaleString() : "";
};

const formatList = (value?: string[]) => {
  return value?.filter(Boolean).join(", ") || "";
};

const rows = computed(() => {
  const info = extraInfo.value;

  if (!info) {
    return [];
  }

  return [
    { label: "ISRC", value: info.isrc },
    { label: "Title", value: info.title },
    { label: "URL-safe title", value: info.urlSafeTitle },
    { label: "Short URL", value: info.shortUrl },
    { label: "Thumbnail URL", value: info.thumbnailUrl },
    { label: "Copyright", value: info.copyright },
    { label: "Release date", value: formatDate(info.releaseDate) },
    { label: "Duration", value: formatNumber(info.duration) },
    { label: "Genres", value: formatList(info.genres) },
    { label: "Categories", value: formatList(info.categories) },
    { label: "Content provider", value: info.contentProvider },
    { label: "Total views", value: formatNumber(info.views?.total) },
    { label: "Views last week", value: formatNumber(info.views?.lastWeek) },
    { label: "Views last day", value: formatNumber(info.views?.lastDay) },
    { label: "Has lyrics", value: formatBoolean(info.hasLyrics) },
    { label: "Explicit", value: formatBoolean(info.isExplicit) },
    { label: "Mobile allowed", value: formatBoolean(info.allowMobile) },
    { label: "Premiere", value: formatBoolean(info.isPremiere) },
    { label: "Unlisted", value: formatBoolean(info.isUnlisted) },
    { label: "Live", value: formatBoolean(info.isLive) },
    { label: "LIFT", value: formatBoolean(info.isLift) },
    { label: "Official", value: formatBoolean(info.isOfficial) },
    { label: "Certified", value: formatBoolean(info.isCertified) },
    { label: "Original content", value: formatBoolean(info.isOriginalContent) },
    { label: "Monetizable", value: formatBoolean(info.isMonetizable) },
  ].filter((row) => row.value !== undefined && row.value !== null && row.value !== "");
});

const groupedCredits = computed(() => {
  const groups = new Map<string, string[]>();

  for (const credit of extraInfo.value?.credits || []) {
    if (!credit?.name || !credit?.value) {
      continue;
    }

    const values = groups.get(credit.name) || [];
    values.push(credit.value);
    groups.set(credit.name, values);
  }

  return Array.from(groups, ([role, values]) => ({
    role,
    values: [...new Set(values)],
  }));
});

watch(
  () => [visible.value, props.video.id],
  async ([isVisible]) => {
    if (!isVisible) {
      return;
    }

    await initialize(props.video.id);
  },
);
</script>

<template>
  <v-dialog v-model="visible" max-width="700">
    <v-card>
      <v-card-title>
        {{ $t('videoExtraInfo.title') }}
      </v-card-title>

      <v-card-text>
        <AppStatusContainer :loading-state="loadingState" :empty="!isExtraInfoValid">
          <template #error>
            <v-alert type="error" variant="outlined">
              {{ $t('videoExtraInfo.error') }}
            </v-alert>
          </template>

          <template #empty>
            <v-alert type="info" variant="outlined">
              {{ $t('videoExtraInfo.empty') }}
            </v-alert>
          </template>

          <v-table>
            <tbody>
              <tr v-for="row in rows" :key="row.label">
                <td>{{ row.label }}</td>
                <td>
                  <a v-if="String(row.value).startsWith('http')" :href="String(row.value)" target="_blank"
                    rel="noreferrer">
                    {{ row.value }}
                  </a>

                  <template v-else>
                    {{ row.value }}
                  </template>
                </td>
              </tr>
            </tbody>
          </v-table>

          <template v-if="extraInfo?.artists?.length">
            <p class="text-h6 font-weight-bold mt-6 mb-2">
              {{ $t('videoExtraInfo.artists') }}
            </p>

            <v-table>
              <tbody>
                <tr v-for="artist in extraInfo.artists" :key="`${artist.role}-${artist.name}`">
                  <td>{{ artist.role }}</td>
                  <td>{{ artist.name }}</td>
                </tr>
              </tbody>
            </v-table>
          </template>

          <template v-if="groupedCredits.length">
            <p class="text-h6 font-weight-bold mt-6 mb-2">
              {{ $t('videoExtraInfo.credits') }}
            </p>

            <v-table>
              <tbody>
                <tr v-for="credit in groupedCredits" :key="credit.role">
                  <td>{{ credit.role }}</td>
                  <td>
                    <p v-for="value in credit.values" :key="value" class="ma-0">
                      {{ value }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </AppStatusContainer>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="outlined" rounded @click="visible = false">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
