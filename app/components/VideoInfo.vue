<template>
  <h2>{{ video.title }}</h2>
  <v-table fixed-header>
    <tbody>
      <tr>
        <td>Artists</td>
        <td>
          <ArtistLink :video-artists="video.artists" :use-chips="true" />
        </td>
      </tr>
      <tr>
        <td>Views</td>
        <td>{{ video.viewCounts.total.toLocaleString() }}</td>
      </tr>
      <tr>
        <td>Uploaded At</td>
        <td>{{ new Date(video.created!).toLocaleString() }}</td>
      </tr>
      <tr>
        <td>Genre</td>
        <td>
          {{ video.genre }}
        </td>
      </tr>
      <tr>
        <td>Explicit</td>
        <td>{{ video.explicit ? 'Yes' : 'No' }}</td>
      </tr>
      <tr>
        <td>Copyright</td>
        <td>{{ video.copyright }}</td>
      </tr>
      <tr>
        <td>Label</td>
        <td>{{ video.label }}</td>
      </tr>
      <tr>
        <td>Duration</td>
        <td>{{ formatDuration(video.duration) }}</td>
      </tr>
      <tr>
        <td>ISRC</td>
        <td>{{ video.id }}</td>
      </tr>
    </tbody>
  </v-table>
  <VideoExtraInfo :video="video" />
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();
</script>
