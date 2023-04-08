import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        alias: "/home",
        name: "Home",
        component: () => import("@/pages/Home.vue"),
    },
];

const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createWebHistory(),
    routes,
});

export default router;
