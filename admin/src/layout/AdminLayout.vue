<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside :class="[collapsed ? 'w-16' : 'w-64']" class="fixed top-0 left-0 bottom-0 z-50 transition-all duration-300 overflow-hidden" style="background:linear-gradient(180deg,#0f172a 0%,#1e1b4b 50%,#312e81 100%)">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-white/10">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style="background:linear-gradient(135deg,#38bdf8,#a855f7,#ec4899)">
          <span class="text-lg">🌌</span>
        </div>
        <span v-if="!collapsed" class="ml-2 text-lg font-bold text-white">Aurora</span>
      </div>

      <!-- Menu -->
      <nav class="p-3 space-y-1">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.path) ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'"
          :style="isActive(item.path) ? { background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' } : {}">
          <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom decoration -->
      <div v-if="!collapsed" class="absolute bottom-0 left-0 right-0 p-4">
        <div class="rounded-2xl p-4 text-center" style="background:rgba(255,255,255,0.05);backdrop-filter:blur(10px)">
          <div class="text-2xl mb-1">✨</div>
          <p class="text-xs text-gray-400">Aurora Blog System</p>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div :class="[collapsed ? 'ml-16' : 'ml-64']" class="flex-1 transition-all duration-300">
      <!-- Header -->
      <header class="h-16 glass border-b border-white/20 flex items-center justify-between px-6 sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <button @click="collapsed = !collapsed" class="p-2 rounded-lg hover:bg-aurora-50 transition-all">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">{{ currentLabel }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <a :href="homeUrl" target="_blank" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-aurora-50 text-aurora-600 hover:bg-aurora-100 transition-all text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            访问主页
          </a>
          <div class="relative" ref="userMenuRef">
            <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-aurora-50 transition-all">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style="background:linear-gradient(135deg,#38bdf8,#a855f7)">
                {{ auth.user?.username?.[0]?.toUpperCase() || "A" }}
              </div>
              <span class="text-sm text-gray-600">{{ auth.user?.username || "admin" }}</span>
            </button>
            <div v-if="userMenuOpen" class="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
              <button @click="router.push('/settings'); userMenuOpen = false" class="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-aurora-50">⚙ 个人设置</button>
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

    <!-- Auto-logout warning toast -->
    <div v-if="showWarning" class="fixed bottom-6 right-6 z-[100] bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-up">
      ⏰ {{ Math.ceil(warningCountdown) }} 秒后因长时间无操作自动退出登录
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const collapsed = ref(false);

const homeUrl = ref("/");
async function fetchHomeUrl() {
  try {
    const res = await api.get("/settings");
    if (res.data.siteUrl) homeUrl.value = res.data.siteUrl;
  } catch {}
}
const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement>();

const showWarning = ref(false);
const warningCountdown = ref(0);
let idleTimer: ReturnType<typeof setInterval> | null = null;
let countdownTimer: ReturnType<typeof setInterval> | null = null;
let lastActivity = Date.now();
const WARNING_BEFORE = 60;

const menu = [
  { path: "/", label: "仪表盘", icon: "📊" },
  { path: "/posts", label: "文章管理", icon: "📝" },
  { path: "/dynamics", label: "动态管理", icon: "💬" },
  { path: "/projects", label: "项目管理", icon: "📁" },
  { path: "/tags", label: "标签分类", icon: "🏷" },
  { path: "/images", label: "图片管理", icon: "🖼" },
  { path: "/settings", label: "系统设置", icon: "⚙" },
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
  stopAutoLogout();
  auth.logout();
  router.push("/login");
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) userMenuOpen.value = false;
}

function resetActivity() { lastActivity = Date.now(); showWarning.value = false; }

function checkIdle() {
  if (!auth.autoLogoutSeconds || auth.autoLogoutSeconds <= 0) return;
  const idle = (Date.now() - lastActivity) / 1000;
  const remaining = auth.autoLogoutSeconds - idle;
  if (remaining <= 0) { stopAutoLogout(); auth.logout(); router.push("/login"); }
  else if (remaining <= WARNING_BEFORE) { showWarning.value = true; warningCountdown.value = remaining; }
  else { showWarning.value = false; }
}

function startAutoLogout() {
  if (!auth.autoLogoutSeconds || auth.autoLogoutSeconds <= 0) return;
  stopAutoLogout();
  lastActivity = Date.now();
  idleTimer = setInterval(checkIdle, 1000);
  window.addEventListener("mousemove", resetActivity);
  window.addEventListener("keydown", resetActivity);
  window.addEventListener("click", resetActivity);
  window.addEventListener("scroll", resetActivity);
}

function stopAutoLogout() {
  if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  showWarning.value = false;
  window.removeEventListener("mousemove", resetActivity);
  window.removeEventListener("keydown", resetActivity);
  window.removeEventListener("click", resetActivity);
  window.removeEventListener("scroll", resetActivity);
}

onMounted(() => {
  auth.loadUser();
  fetchHomeUrl();
  document.addEventListener("click", handleClickOutside);
  startAutoLogout();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  stopAutoLogout();
});
</script>
