<template>
  <v-row>
    <v-col cols="12" sm="auto" class="text-center">
      <v-avatar size="180">
        <v-img v-if="artistAvatarUrl" :src="artistAvatarUrl" :alt="`Profile avatar of ${artistName}.`" />
        <v-icon v-else size="180">mdi-account-circle</v-icon>
      </v-avatar>
    </v-col>

    <v-col cols="12" sm="auto" align-self="center" class="text-center text-sm-left">
      <p class="text-h4 font-weight-bold">{{ artistName }}</p>
      <p class="text-h6">
        <template v-if="videoCount != null">
          {{ videoCount.toLocaleString() }} video(s)
        </template>

        <template v-if="viewCount != null">
          • {{ viewCount.toLocaleString() }} view(s)
        </template>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artistName: string;
  artistAvatarUrl: string;
  videoCount: number;
  viewCount: number;
}>();
</script>
