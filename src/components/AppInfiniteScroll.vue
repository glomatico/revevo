<script setup lang="ts">
import type { VInfiniteScroll } from 'vuetify/components';

const props = defineProps<{
  load: NonNullable<VInfiniteScroll['$props']['onLoad']>;
}>();
</script>

<template>
  <v-infinite-scroll class="overflow-x-hidden" @load="props.load($event)">
    <template #loading>
      <v-progress-linear class="mt-2" indeterminate />
    </template>

    <template #empty>
      <p class="text-center ma-0 mt-2">
        {{ $t('loading.noMore') }}
      </p>
    </template>

    <template #error>
      <p class="text-center ma-0 mt-2">
        {{ $t('loading.error') }}
      </p>
    </template>

    <v-row>
      <slot />
    </v-row>
  </v-infinite-scroll>
</template>
