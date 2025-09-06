<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4 text-wrap text-break">
        {{ video.basicMetaV3.title }}
      </p>
    </v-col>

    <v-divider thickness="2" />

    <v-col cols="12">
      <v-table>
        <tbody>
          <tr>
            <td>Artists</td>
            <td>
              <ArtistLinkChip :video-artists="video.basicMetaV3.artists!" add-avatar use-chips />
            </td>
          </tr>
          <tr>
            <td>Views</td>
            <td>{{ video.views?.viewsTotal.toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Release date</td>
            <td>{{ new Date(video.basicMetaV3.releaseDate!).toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Genre</td>
            <td>
              {{ video.basicMetaV3.genres!.join(', ') || 'N/A' }}
            </td>
          </tr>
          <tr>
            <td>Explicit</td>
            <td>{{ video.basicMetaV3.explicit ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td>Copyright</td>
            <td>{{ video.basicMetaV3.copyright }}</td>
          </tr>
          <tr>
            <td>Label</td>
            <td>{{ video.basicMetaV3.labels }}</td>
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
      <VideoExtraInfo :video="video" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();
</script>
