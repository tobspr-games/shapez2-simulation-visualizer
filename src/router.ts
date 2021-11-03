import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    alias: "/home",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
  },
  {
    path: "/axios",
    name: "Axios",
    component: () => import("@/pages/Axios.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/pages/About.vue"),
  },
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
});

export default router;
