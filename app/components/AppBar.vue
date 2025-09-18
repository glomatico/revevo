<script lang="ts" setup>
const appMenu = ref();
</script>

<template>
  <AppMenu ref="appMenu" />

  <v-toolbar color="surface">
    <v-container>
      <div class="d-none d-sm-block align-center">
        <v-row align="center">
          <v-col cols="auto">
            <v-app-bar-nav-icon @click=" appMenu.toggleDrawer()" />
          </v-col>

          <v-col cols="auto">
            <v-toolbar-title>
              <NuxtLink class="text-decoration-none text-white" to="/">
                Revevo
              </NuxtLink>
            </v-toolbar-title>
          </v-col>

          <v-col align="center">
            <SearchBar />
          </v-col>
        </v-row>
      </div>

      <div class="d-sm-none align-center">
        <v-row align="center">
          <v-col cols="auto">
            <v-app-bar-nav-icon @click=" appMenu.toggleDrawer()" />
          </v-col>

          <v-col cols="auto">
            <v-toolbar-title>
              <NuxtLink class="text-decoration-none text-white" to="/">
                Revevo
              </NuxtLink>
            </v-toolbar-title>
          </v-col>

          <v-col align="right">
            <CompactSearchBar />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-toolbar>
</template>
