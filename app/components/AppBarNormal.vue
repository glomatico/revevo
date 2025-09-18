<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const appMenu = ref();
const query = ref<string>(route.query.q as string || '');

const search = async () => {
  if (!query.value.trim()) return;

  await router.push({
    path: '/search',
    query: {
      q: query.value,
    }
  });
};
</script>

<template>
  <AppMenu ref="appMenu" />

  <v-toolbar color="surface">
    <v-container>
      <v-row align="center">
        <v-col cols="auto">
          <v-app-bar-nav-icon @click="appMenu.toggleDrawer()" />
        </v-col>

        <v-col cols="auto">
          <v-toolbar-title>
            <NuxtLink class="text-decoration-none text-white" to="/">
              Revevo
            </NuxtLink>
          </v-toolbar-title>
        </v-col>

        <v-col align="center">
          <v-text-field rounded label="Search" variant="solo" single-line density="compact" outlined dense hide-details
            @keyup.enter="search" v-model="query" max-width="600">
            <template #append-inner>
              <v-btn variant="text" @click="search" icon="mdi-send">
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>
