<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="[collapsed ? 'w-16' : 'w-60']" class="fixed top-0 left-0 bottom-0 bg-gradient-to-b from-slate-900 to-slate-800 z-50 transition-all duration-300">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-white/10">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-aurora-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
          <span class="text-lg">🌌</span>
        </div>
        <span v-if="!collapsed" class="ml-2 text-lg font-bold text-white">Aurora</span>
      </div>

      <!-- Menu -->
      <nav class="p-3 space-y-1">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="isActive(item.path) ? 'bg-aurora-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'">
          <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <div :class="[collapsed ? 'ml-16' : 'ml-60']" class="flex-1 transition-all duration-300">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <button @click="collapsed = !collapsed" class="p-2 rounded-lg hover:bg-gray-100 transition-all">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">{{ currentLabel }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative" ref="userMenuRef">
            <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                {{ auth.user?.username?.[0]?.toUpperCase() || "A" }}
              </div>
              <span class="text-sm text-gray-600">{{ auth.user?.username || "admin" }}</span>
            </button>
            <div v-if="userMenuOpen" class="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
              <button @click="router.push('/admin/settings'); userMenuOpen = false" class="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">⚙ 个人设置</button>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="logout" class="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50">🚪 退出登录</button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 animate-fade-in">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const collapsed = ref(false);
const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement>();

const menu = [
  { path: "/admin", label: "仪表盘", icon: "📊" },
  { path: "/admin/posts", label: "文章管理", icon: "📝" },
  { path: "/admin/dynamics", label: "动态管理", icon: "💬" },
  { path: "/admin/projects", label: "项目管理", icon: "📁" },
  { path: "/admin/tags", label: "标签分类", icon: "🏷" },
  { path: "/admin/images", label: "图片管理", icon: "🖼" },
  { path: "/admin/settings", label: "系统设置", icon: "⚙" },
];

const currentLabel = computed(() => {
  const active = menu.find((m) => isActive(m.path));
  return active?.label || "仪表盘";
});

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function logout() {
  userMenuOpen.value = false;
  auth.logout();
  router.push("/login");
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) userMenuOpen.value = false;
}

onMounted(() => {
  auth.loadUser();
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>
