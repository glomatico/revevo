<template>
  <v-btn block variant="text" class="text-none" @click="isExtraInfoDialogVisible = true">Show Stream URLs</v-btn>

  <v-dialog v-model="isExtraInfoDialogVisible" max-width="600px">
    <v-card>
      <v-card-item>
        <v-row dense>
          <v-col cols="12">
            <p class="text-h6">Stream URLs</p>
          </v-col cols="12">
          <v-col>
            <v-table fixed-header>
              <tbody v-for="value in video.streamsV3" :key="value.url">
                <tr>
                  <td>{{ value.format }}
                    <template v-if="value.quality">
                      ({{ value.quality }})
                    </template>
                  </td>
                  <td>
                    <CopyableReadOnlyField :value="value.url" />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col cols="12" align="end">
            <v-btn variant="text" @click="isExtraInfoDialogVisible = false">Close</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  video: Video;
}>();

const isExtraInfoDialogVisible = ref(false);
</script>
