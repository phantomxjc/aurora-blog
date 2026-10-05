import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/admin/login", name: "login", component: () => import("@/views/Login.vue") },
  {
    path: "/admin",
    component: () => import("@/layout/AdminLayout.vue"),
    children: [
      { path: "", name: "dashboard", component: () => import("@/views/Dashboard.vue") },
      { path: "posts", name: "posts", component: () => import("@/views/Posts/List.vue") },
      { path: "posts/new", name: "post-new", component: () => import("@/views/Posts/Edit.vue") },
      { path: "posts/:slug/edit", name: "post-edit", component: () => import("@/views/Posts/Edit.vue") },
      { path: "dynamics", name: "dynamics", component: () => import("@/views/Dynamics.vue") },
      { path: "projects", name: "projects", component: () => import("@/views/Projects.vue") },
      { path: "tags", name: "tags", component: () => import("@/views/Tags.vue") },
      { path: "images", name: "images", component: () => import("@/views/Images.vue") },
      { path: "settings", name: "settings", component: () => import("@/views/Settings.vue") },
    ],
  },
];

const router = createRouter({ history: createWebHistory("/admin/"), routes });

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.name !== "login") next("/admin/login");
  else if (token && to.name === "login") next("/admin");
  else next();
});

export default router;
