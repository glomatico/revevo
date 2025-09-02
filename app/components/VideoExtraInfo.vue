<template>
  <v-btn block variant="text" @click="isExtraInfoDialogVisible = true">Show extra info</v-btn>
  <v-dialog v-model="isExtraInfoDialogVisible" max-width="600px">
    <v-card>
      <v-card-item>
        <v-card-title>
          Extra Info
        </v-card-title>

        <v-table fixed-header>
          <tbody>
            <tr v-if="video.hls">
              <td>HLS Stream URL</td>
              <td>
                <CopyableReadOnlyField :value="video.hls" />
              </td>
            </tr>
          </tbody>
          <tbody v-if="video.dash">
            <tr>
              <td>DASH Stream URL</td>
              <td>
                <CopyableReadOnlyField :value="video.dash" />
              </td>
            </tr>
          </tbody>
          <tbody v-if="video.mp4" v-for="([key, value]) in Object.entries(video.mp4)" :key="key">
            <tr>
              <td>MP4 Stream URL ({{ value.quality }})</td>
              <td>
                <CopyableReadOnlyField :value="value.url" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isExtraInfoDialogVisible = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();

const isExtraInfoDialogVisible = ref(false);
</script>
