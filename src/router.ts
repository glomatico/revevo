import { createRouter, createWebHistory } from "vue-router";
import RootLayout from "./layouts/RootLayout.vue";
import Artist from "./pages/Artist.vue";
import Home from "./pages/Home.vue";
import NotFound from "./pages/NotFound.vue";
import Playlist from "./pages/Playlist.vue";
import Search from "./pages/Search.vue";
import Settings from "./pages/Settings.vue";
import VideoLayout from "./layouts/VideoLayout.vue";
import Video from "./pages/Video.vue";

const routes = [
  {
    path: "/",
    component: RootLayout,
    children: [
      {
        path: "/:pathMatch(.*)*",
        component: NotFound,
      },
      {
        path: "",
        component: Home,
      },
      {
        path: "artist/:id",
        component: Artist,
      },
      {
        path: "playlist/:id",
        component: Playlist,
      },
      {
        path: "search/:query?",
        component: Search,
      },
      {
        path: "settings",
        component: Settings,
      },
      {
        path: "video/:id",
        component: VideoLayout,
        children: [
          {
            path: "",
            component: Video,
          },
        ],
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
