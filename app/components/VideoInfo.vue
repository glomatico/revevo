<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4 text-wrap text-break">
        {{ title }}
      </p>
    </v-col>

    <v-divider thickness="2" />

    <v-col cols="12">
      <v-table class="rounded-lg">
        <tbody>
          <tr v-if="$slots.artists">
            <td>Artists</td>
            <td>
              <slot name="artists" />
            </td>
          </tr>
          <tr v-if="views">
            <td>Views</td>
            <td>{{ views.toLocaleString() }}</td>
          </tr>
          <tr>
            <td>ISRC</td>
            <td>{{ id }}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>{{ formatDuration(duration) }}</td>
          </tr>
          <tr v-if="date">
            <td>Release date</td>
            <td>{{ new Date(date).toLocaleString() }}</td>
          </tr>
          <tr>
            <td>Genre</td>
            <td>
              {{ genre }}
            </td>
          </tr>
          <tr>
            <td>Explicit</td>
            <td>{{ explicit ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td>Lyric Video</td>
            <td>{{ lyricVideo ? 'Yes' : 'No' }}</td>
          </tr>
          <tr v-if="copyright">
            <td>Copyright</td>
            <td>{{ copyright }}</td>
          </tr>
          <tr v-if="copyrightYear">
            <td>Copyright Year</td>
            <td>{{ copyrightYear }}</td>
          </tr>
          <tr>
            <td>Label</td>
            <td>{{ label }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>

    <v-col v-if="$slots.streamurls" cols="12">
      <slot name="streamurls" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id: string;
  title: string;
  genre: string;
  duration: number;
  explicit: boolean;
  lyricVideo: boolean;
  date: string;
  copyright: string;
  label: string;
  copyrightYear: number;
  views: number;
}>();
</script>
