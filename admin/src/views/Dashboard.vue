<template>
  <div class="space-y-6">
    <!-- Welcome banner -->
    <div class="rounded-3xl p-6 overflow-hidden relative" style="background:linear-gradient(135deg,#0ea5e9,#6366f1,#a855f7)">
      <div class="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style="background:radial-gradient(circle,white,transparent)"></div>
      <div class="relative z-10">
        <h2 class="text-2xl font-bold text-white mb-1">欢迎回来 👋</h2>
        <p class="text-white/70 text-sm">这里是你的博客控制中心</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="(stat, i) in statsCards" :key="stat.label" class="card p-5 animate-fade-up" :style="{ animationDelay: `${i * 0.1}s` }">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :style="{ background: stat.gradient }">{{ stat.icon }}</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
        <div class="text-sm text-gray-400 mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Quick Actions & Recent Posts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">快捷操作</h2>
        <div class="space-y-2">
          <button v-for="action in actions" :key="action.label" @click="router.push(action.path)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-aurora-50/50 transition-all duration-200 group">
            <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all group-hover:scale-110" :style="{ background: action.gradient }">{{ action.icon }}</span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-aurora-600 transition-colors">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">近期文章</h2>
          <button @click="router.push('/posts')" class="text-sm text-aurora-600 hover:text-aurora-700 transition-colors">查看全部 →</button>
        </div>
        <div v-if="recentPosts.length" class="space-y-2">
          <div v-for="post in recentPosts" :key="post.id" @click="router.push(`/posts/${post.slug}/edit`)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-aurora-50/50 cursor-pointer transition-all duration-200">
            <div :class="['w-2 h-2 rounded-full', post.draft ? 'bg-yellow-400' : 'bg-green-400']"></div>
            <span class="flex-1 text-sm font-medium text-gray-700 truncate">{{ post.title }}</span>
            <span class="text-xs text-gray-400">{{ post.category || '未分类' }}</span>
            <span :class="post.draft ? 'badge-warning' : 'badge-success'">{{ post.draft ? '草稿' : '已发布' }}</span>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">
          <span class="text-4xl block mb-2">📋</span>暂无文章
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const router = useRouter();
const stats = ref({ totalPosts: 0, totalDrafts: 0, totalViews: 0, totalTags: 0, totalDynamics: 0, totalProjects: 0 });
const recentPosts = ref<any[]>([]);

const statsCards = ref([
  { label: "文章总数", value: 0, icon: "📝", gradient: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
  { label: "草稿", value: 0, icon: "✏️", gradient: "linear-gradient(135deg,#fefce8,#fef9c3)" },
  { label: "总浏览", value: 0, icon: "👀", gradient: "linear-gradient(135deg,#faf5ff,#f3e8ff)" },
  { label: "标签", value: 0, icon: "🏷", gradient: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
]);

const actions = [
  { label: "写新文章", path: "/posts/new", icon: "✍️", gradient: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
  { label: "发动态", path: "/dynamics", icon: "💬", gradient: "linear-gradient(135deg,#faf5ff,#f3e8ff)" },
  { label: "添加项目", path: "/projects", icon: "📁", gradient: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
  { label: "图片管理", path: "/images", icon: "🖼", gradient: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { label: "系统设置", path: "/settings", icon: "⚙", gradient: "linear-gradient(135deg,#f8fafc,#f1f5f9)" },
];

onMounted(async () => {
  try {
    const [statsRes, postsRes] = await Promise.all([
      api.get("/posts/stats/summary").catch(() => null),
      api.get("/posts", { params: { limit: 6, draft: "true" } }).catch(() => null),
    ]);
    if (statsRes?.data) {
      stats.value = statsRes.data;
      statsCards.value[0].value = statsRes.data.totalPosts;
      statsCards.value[1].value = statsRes.data.totalDrafts;
      statsCards.value[2].value = statsRes.data.totalViews;
      statsCards.value[3].value = statsRes.data.totalTags;
    }
    if (postsRes?.data) recentPosts.value = postsRes.data.data || [];
  } catch {}
});
</script>
