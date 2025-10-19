<script lang="ts" setup>
const searchOpened = ref(false);


const onMagnifyClick = () => {
  searchOpened.value = true;
}

const onBackClick = () => {
  searchOpened.value = false;
}
</script>

<template>
  <v-row dense align="center">
    <v-col v-if="!searchOpened" align="right">
      <v-btn icon variant="text" @click="onMagnifyClick">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-col>

    <div v-if="searchOpened" class="position-absolute top-0 left-0 right-0 bottom-0">
      <v-toolbar>
        <v-container>
          <v-row dense align="center">
            <v-col cols="auto">
              <v-btn icon variant="text" @click="onBackClick">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
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
