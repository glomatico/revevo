<script lang="ts" setup>
const props = defineProps<{
  loadingState?: LoadingState;
  empty?: boolean;
}>();
</script>

<template>
  <v-row>
    <template v-if="props.loadingState === LoadingState.IDLE" />

    <v-col v-else-if="props.loadingState === LoadingState.LOADING" cols="12">
      <LoadingSpinner />
    </v-col>

    <v-col v-else-if="props.loadingState === LoadingState.ERROR" cols="12">
      <v-alert type="error">
        <slot name="error-message" />
      </v-alert>
    </v-col>

    <v-col v-else-if="props.empty" cols="12">
      <v-alert type="info">
        <slot name="empty-message" />
      </v-alert>
    </v-col>

    <v-col v-else cols="12">
      <slot />
    </v-col>
  </v-row>
</template>
