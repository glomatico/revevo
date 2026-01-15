<script lang="ts" setup>
const {
  settings,
  initialize: initializeSettings,
} = useSettings();

const playQueue = usePlayQueue(settings.value);

provide('playQueue', playQueue);

onMounted(async () => {
  initializeSettings();
});
</script>

<template>
  <NuxtLayout name="default">
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <slot />
        </v-col>

        <v-col cols="12" md="4">
          <PlayQueue :play-queue="playQueue" />
        </v-col>
      </v-row>
    </v-container>
  </NuxtLayout>
</template>
