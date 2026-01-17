<script lang="ts" setup>
const props = defineProps<{
  video: any;
}>();

const dialogVisible = ref(false);
</script>

<template>
  <v-btn block variant="outlined" class="text-none" @click="dialogVisible = true" rounded>Show Stream
    URLs</v-btn>

  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-item>
        <v-row dense>
          <v-col cols="12">
            <p class="text-h6">Stream URLs</p>
          </v-col cols="12">

          <v-col>
            <v-table>
              <tbody>
                <tr v-if="props.video.hls">
                  <td>HLS</td>
                  <td>
                    <CopyableReadOnlyField :value="props.video.hls" />
                  </td>
                </tr>
                <tr v-for="mp4Item in props.video.mp4" :key="mp4Item.quality">
                  <td>MP4 ({{ mp4Item.quality }})</td>
                  <td>
                    <CopyableReadOnlyField :value="mp4Item.url" />
                  </td>
                </tr>
                <tr v-if="props.video.captions?.srt?.url">
                  <td>Captions (SRT)</td>
                  <td>
                    <CopyableReadOnlyField :value="props.video.captions.srt.url" />
                  </td>
                </tr>
                <tr v-if="props.video.captions?.vtt?.url">
                  <td>Captions (VTT)</td>
                  <td>
                    <CopyableReadOnlyField :value="props.video.captions.vtt.url" />
                  </td>
                </tr>
                <tr v-if="props.video.captions?.ttml?.url">
                  <td>Captions (TTML)</td>
                  <td>
                    <CopyableReadOnlyField :value="props.video.captions.ttml.url" />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-col cols="12" align="end">
            <v-btn rounded variant="outlined" class="text-none" @click="dialogVisible = false">Close</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
