import { createRouter, createWebHistory } from "vue-router";
import OrgIndex from "../views/org/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: OrgIndex,
    },
    {
      path: "/org-detail",
      name: "OrgDetail",
      query: {
        showAside: false,
      },
      component: () => import("../views/org/detail.vue"),
    },
    {
      path: "/positions",
      name: "positions",
      component: () => import("../views/org/position.vue"),
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("../views/org/employee.vue"),
    }
  ],
});

export default router;
