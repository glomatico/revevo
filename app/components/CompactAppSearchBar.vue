<script lang="ts" setup>
const searchOpened = ref(false);
</script>

<template>
  <v-row dense align="center">
    <v-col v-if="!searchOpened" align="right">
      <v-btn icon="mdi-magnify" variant="text" @click="searchOpened = true" />
    </v-col>

    <div v-if="searchOpened" class="position-absolute top-0 left-0 right-0 bottom-0">
      <v-toolbar color="surface">
        <v-container>
          <v-row dense align="center">
            <v-col cols="auto">
              <v-btn icon="mdi-arrow-left" variant="text" @click="searchOpened = false" />
            </v-col>

            <v-col align="center">
              <NormalAppSearchBar />
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
    </div>
  </v-row>
</template>
