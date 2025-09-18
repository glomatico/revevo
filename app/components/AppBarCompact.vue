<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const appMenu = ref();
const query = ref(route.query.q as string);
const showSearch = ref(false);

const search = async () => {
  if (!query.value.trim()) return;

  await router.push({
    path: '/search',
    query: {
      q: query.value,
    }
  });
};

const onMagnifyClick = () => {
  showSearch.value = !showSearch.value;
};
</script>

<template>
  <AppMenu ref="appMenu" />

  <v-toolbar color="surface">
    <v-container>
      <v-row align="center">
        <template v-if="!showSearch">
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
            <v-btn icon variant="text" @click="onMagnifyClick">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="auto">
            <v-btn icon variant="text" @click="onMagnifyClick">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <v-text-field rounded label="Search" variant="solo" single-line density="compact" outlined dense
              hide-details @keyup.enter="search" v-model="query">
              <template #append-inner>
                <v-btn variant="text" @click="search" icon="mdi-send">
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-toolbar>
</template>
