<script lang="ts" setup>
const props = defineProps<{
  video: any;
}>();
</script>

<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4 text-wrap text-break font-weight-bold">
        {{ props.video.title }}
      </p>
    </v-col>

    <v-divider thickness="2" />

    <v-col cols="12">
      <v-table class="rounded-lg">
        <tbody>
          <tr v-if="props.video.artists?.length">
            <td>Artists</td>
            <td>
              <v-row dense class="my-2">
                <v-col v-for="artist in props.video.artists" :key="artist.artist.id" cols="auto">
                  <ArtistLinkChip :artist="artist.artist" />
                </v-col>
              </v-row>
            </td>
          </tr>
          <tr v-if="props.video.viewCounts?.total">
            <td>Views</td>
            <td>{{ props.video.viewCounts.total.toLocaleString() }}</td>
          </tr>
          <tr>
            <td>ISRC</td>
            <td>{{ props.video.id }}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>{{ formatDuration(props.video.duration) }}</td>
          </tr>
          <tr v-if="props.video.created">
            <td>Release date</td>
            <td>{{ new Date(props.video.created).toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Genre</td>
            <td>
              {{ props.video.genre }}
            </td>
          </tr>
          <tr>
            <td>Explicit</td>
            <td>{{ props.video.explicit ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td>Lyric Video</td>
            <td>{{ props.video.lyricVideo ? 'Yes' : 'No' }}</td>
          </tr>
          <tr v-if="props.video.copyright">
            <td>Copyright</td>
            <td>{{ props.video.copyright }}</td>
          </tr>
          <tr v-if="props.video.copyrightYear">
            <td>Copyright Year</td>
            <td>{{ props.video.copyrightYear }}</td>
          </tr>
          <tr>
            <td>Label</td>
            <td>{{ props.video.label }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>

    <v-col v-if="props.video.hls || props.video.mp4?.length || props.video.captions" cols="12" md="6">
      <VideoStreamUrls :video="props.video" />
    </v-col>

    <v-col cols="12" md="6">
      <VideoExtraInfo :video="props.video" />
    </v-col>
  </v-row>
</template>
