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
  <v-btn block variant="outlined" class="text-none" @click="dialogVisible = true">Show Extra Info</v-btn>

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

              <!-- <div v-if="extraInfo?.basicMetaV3?.credits?.length">
                <p class="text-subtitle-1">Credits:</p>
                <v-list dense>
                  <v-list-item v-for="credit in extraInfo.basicMetaV3.credits" :key="credit.role + credit.name">
                    <v-list-item-content>
                      <v-list-item-title>{{ credit.role }}: {{ credit.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>

              <div v-if="extraInfo?.views?.youTubeId">
                <p class="text-subtitle-1">YouTube ID:</p>
                <p>{{ extraInfo.views.youTubeId }}</p>
              </div> -->
              <v-table class="rounded-lg" v-if="extraInfo?.basicMetaV3?.credits?.length">
                <tbody>
                  <tr v-if="extraInfo?.views?.youTubeId">
                    <td>YouTube URL</td>
                    <td><a :href="`https://www.youtube.com/watch?v=${extraInfo.views.youTubeId}`" target="_blank">{{
                      `https://www.youtube.com/watch?v=${extraInfo.views.youTubeId}` }}</a></td>
                  </tr>
                  <tr v-for="credit in extraInfo.basicMetaV3.credits" :key="credit.role + credit.name">
                    <td>{{ credit.role }}</td>
                    <td>{{ credit.name }}</td>
                  </tr>
                </tbody>
              </v-table>
            </StatusContainer>
          </v-col>

          <v-col cols="12" align="end">
            <v-btn variant="outlined" class="text-none" @click="dialogVisible = false">Close</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
