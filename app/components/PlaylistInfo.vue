<script lang="ts" setup>
const props = defineProps<{
  playlist: any;
}>();
</script>

<template>
  <v-card variant="text">
    <v-row no-gutters>
      <v-col cols="12">
        <v-img :src="props.playlist.thumbnail" :aspect-ratio="16 / 9" />
      </v-col>

      <v-row class="pa-2">
        <v-col cols="12">
          <p class="text-h4 font-weight-bold text-center">{{ props.playlist.title }}</p>

          <p class="text-caption text-center">
            {{ props.playlist.itemsCount }} video{{ props.playlist.itemsCount !== 1 ? 's' : '' }}
          </p>
        </v-col>

        <v-col cols="12">
          <p v-if="props.playlist.description">
            {{ props.playlist.description }}
          </p>
        </v-col>
      </v-row>
    </v-row>
  </v-card>
</template>
