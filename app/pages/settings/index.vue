<script lang="ts" setup>
const { settings, initializeWatchers } = useSettings();

onMounted(() => {
  initializeWatchers();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p class="text-h4 font-weight-bold">Options</p>
      </v-col>

      <v-divider thickness="2" />

      <v-col cols="12">
        <p class="text-h6">Playback method</p>
        <v-radio-group v-model="settings.playbackMethod">
          <v-radio label="HLS" value="hls"></v-radio>
          <v-radio label="MP4" value="mp4"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="12">
        <p class="text-h6">Enable captions</p>
        <v-switch v-model="settings.enableCaptions"></v-switch>
      </v-col>

      <v-col cols="12">
        <p class="text-h6">Hide explicit videos</p>
        <v-switch v-model="settings.hideExplicit"></v-switch>
      </v-col>

      <v-col cols="12">
        <p class="text-h6">Disable autoplay</p>
        <v-switch v-model="settings.disableAutoplay"></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>
