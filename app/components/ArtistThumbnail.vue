<script lang="ts" setup>
const props = defineProps<{
  artistId: string;
  artistName: string;
  artistAvatarUrl?: string;
}>();
</script>

<template>
  <v-card :to="`/artist/${artistId}`">
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <v-img class="ma-2" :src="artistAvatarUrl" :alt="`Profile avatar of ${artistName}.`" rounded="circle"
          :aspect-ratio="1" width="120">
          <div v-if="!artistAvatarUrl">
            <v-icon size="120">
              mdi-account-circle
            </v-icon>
          </div>
        </v-img>
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ artistName }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
