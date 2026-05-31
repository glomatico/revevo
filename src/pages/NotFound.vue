<script setup lang="ts">
import { usePageTitle } from '@/composables/usePageTitle';

usePageTitle('Page not found');
</script>

<template>
  <v-container class="text-center">
    <v-row align="center">
      <v-col cols="12">
        <h1 class="font-weight-bold">
          {{ $t('notFound.title') }}
        </h1>

        <p>
          {{ $t('notFound.message') }}
        </p>
      </v-col>

      <v-col cols="12">
        <v-btn variant="outlined" rounded to="/">
          {{ $t('notFound.goHome') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
