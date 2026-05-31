<script setup lang="ts">
import { LoadingState } from '@/composables/enums';

const props = defineProps<{
  loadingState?: LoadingState;
  empty?: boolean;
}>();
</script>

<template>
  <v-row>
    <template v-if="props.loadingState === LoadingState.IDLE" />

    <v-col v-else-if="props.loadingState === LoadingState.LOADING" align="center" cols="12">
      <v-progress-linear indeterminate />
    </v-col>

    <v-col v-else-if="props.loadingState === LoadingState.ERROR" cols="12">
      <slot name="error" />
    </v-col>

    <v-col v-else-if="props.empty" cols="12">
      <slot name="empty" />
    </v-col>

    <v-col v-else cols="12">
      <slot />
    </v-col>
  </v-row>
</template>
