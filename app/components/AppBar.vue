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
            <AppLink to="/">
              <span class="font-weight-bold">Revevo</span>
            </AppLink>
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
