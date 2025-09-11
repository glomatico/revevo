<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p class="text-h4">Options</p>
      </v-col>

      <v-divider thickness="2" />

      <v-col cols="12">
        <p>Playback method</p>
        <v-radio-group v-model="settings.playBackMethod">
          <v-radio label="HLS" value="hls"></v-radio>
          <v-radio label="MP4" value="mp4"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="12">
        <v-switch v-model="settings.enableCaptions" label="Enable captions"></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { settings, loadSettings } = useSettings();

onMounted(() => {
  loadSettings();
});
</script>
