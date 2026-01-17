<script lang="ts" setup>
const appMenu = ref();
</script>

<template>
  <AppMenu ref="appMenu" />

  <v-toolbar color="surface">
    <v-container>
      <v-row dense align="center">
        <v-col cols="auto">
          <v-btn icon="mdi-menu" variant="text" @click="appMenu.toggleDrawer()" />
        </v-col>

        <v-col cols="auto">
          <v-toolbar-title>
            <NuxtLink class="font-weight-bold text-decoration-none text-white" to="/">
              Revevo
            </NuxtLink>
          </v-toolbar-title>
        </v-col>

        <v-col>
          <div class="d-none d-sm-block align-center">
            <NormalAppSearchBar />
          </div>

          <div class="d-sm-none align-center">
            <CompactAppSearchBar />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>
