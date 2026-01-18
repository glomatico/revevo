<script lang="ts" setup>
const props = defineProps<{
  video: any;
}>();

const {
  loadingState,
  extraInfo,
  isExtraInfoValid,
  initializeFromRoute,
} = useVideoExtraInfo();

const dialogVisible = ref(false);

onMounted(async () => {
  await initializeFromRoute();
});
</script>

<template>
  <v-btn block variant="outlined" class="text-none" @click="dialogVisible = true" rounded>Extra Info</v-btn>

  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-item>
        <v-row dense>
          <v-col cols="12">
            <p class="text-h6">Extra Info</p>
          </v-col>

          <v-col cols="12">
            <StatusContainer :loading-state="loadingState" :empty="!isExtraInfoValid">
              <template #error-message>
                Failed to load extra info.
              </template>

              <template #empty-message>
                No extra info available.
              </template>

              <v-table class="rounded-lg">
                <tbody>
                  <tr v-if="extraInfo?.views?.youTubeId">
                    <td>YouTube URL</td>
                    <td><a :href="`https://www.youtube.com/watch?v=${extraInfo.views.youTubeId}`" target="_blank">{{
                      `https://www.youtube.com/watch?v=${extraInfo.views.youTubeId}` }}</a></td>
                  </tr>
                  <tr v-if="extraInfo?.basicMetaV3?.credits?.length" v-for="credit in extraInfo.basicMetaV3.credits"
                    :key="credit">
                    <td>{{ credit.role }}</td>
                    <td>{{ credit.name }}</td>
                  </tr>
                </tbody>
              </v-table>
            </StatusContainer>
          </v-col>

          <v-col cols="12" align="end">
            <v-btn rounded variant="outlined" class="text-none" @click="dialogVisible = false">Close</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
