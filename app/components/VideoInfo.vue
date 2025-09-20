<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4 text-wrap text-break">
        {{ video.basicMetaV3.title }}
      </p>
    </v-col>

    <v-divider thickness="2" />

    <v-col cols="12">
      <v-table class="rounded-lg">
        <tbody>
          <tr>
            <td>Artists</td>
            <td>
              <ArtistLinkChip :video-artists="video.basicMetaV3.artists!" add-avatar use-chips />
            </td>
          </tr>
          <tr v-if="video.views?.viewsTotal">
            <td>Views</td>
            <td>{{ video.views.viewsTotal.toLocaleString() }}</td>
          </tr>
          <tr v-if="video.basicMetaV3.releaseDate">
            <td>Release date</td>
            <td>{{ new Date(video.basicMetaV3.releaseDate!).toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Genres</td>
            <td>
              {{ video.basicMetaV3.genres!.join(', ') || 'N/A' }}
            </td>
          </tr>
          <tr v-for="(item, index) in groupCreditsByRole(video.basicMetaV3.credits!)" :key="index">
            <td>{{ item.role }}</td>
            <td>
              {{ item.name }}
            </td>
          </tr>
          <tr>
            <td>Explicit</td>
            <td>{{ video.basicMetaV3.explicit ? 'Yes' : 'No' }}</td>
          </tr>
          <tr v-if="video.views?.youTubeId">
            <td>YouTube URL</td>
            <td>
              <a :href="`https://www.youtube.com/watch?v=${video.views.youTubeId}`" target="_blank"
                rel="noopener noreferrer">
                https://www.youtube.com/watch?v={{ video.views.youTubeId }}
              </a>
            </td>
          </tr>
          <tr>
            <td>Copyright</td>
            <td>{{ video.basicMetaV3.copyright }}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>{{ formatDuration(video.basicMetaV3.duration!) }}</td>
          </tr>
          <tr>
            <td>ISRC</td>
            <td>{{ video.basicMetaV3.isrc }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="12">
      <VideoStreamUrls :video="video" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();

const groupCreditsByRole = (credits: CreditsV3[]): { role: string; name: string }[] => {
  if (!credits?.length) {
    return [];
  }

  const roleMap = new Map<string, string[]>();

  credits.forEach((credit) => {
    if (!credit?.role || !credit?.name) return;

    const existingNames = roleMap.get(credit.role) ?? [];
    roleMap.set(credit.role, [...existingNames, credit.name]);
  });


  return Array.from(roleMap.entries())
    .map(([role, names]) => ({
      role,
      name: names.join(', ')
    }))
    .sort((a, b) => a.role.localeCompare(b.role));
};
</script>
