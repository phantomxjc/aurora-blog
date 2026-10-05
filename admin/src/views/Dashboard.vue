<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in statsCards" :key="stat.label" class="card p-5 animate-fade-up">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', stat.bg]">{{ stat.icon }}</div>
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
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group">
            <span :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg', action.bg]">{{ action.icon }}</span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-aurora-600">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">近期文章</h2>
          <button @click="router.push('/posts')" class="text-sm text-aurora-600 hover:text-aurora-700">查看全部 →</button>
        </div>
        <div v-if="recentPosts.length" class="space-y-2">
          <div v-for="post in recentPosts" :key="post.id" @click="router.push(`/posts/${post.slug}/edit`)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
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
import dayjs from "dayjs";

const router = useRouter();
const stats = ref({ totalPosts: 0, totalDrafts: 0, totalViews: 0, totalTags: 0, totalDynamics: 0, totalProjects: 0 });
const recentPosts = ref<any[]>([]);

const statsCards = ref([
  { label: "文章总数", value: 0, icon: "📝", bg: "bg-aurora-50" },
  { label: "草稿", value: 0, icon: "✏️", bg: "bg-yellow-50" },
  { label: "总浏览", value: 0, icon: "👀", bg: "bg-purple-50" },
  { label: "标签", value: 0, icon: "🏷", bg: "bg-pink-50" },
]);

const actions = [
  { label: "写新文章", path: "/posts/new", icon: "✍️", bg: "bg-aurora-50" },
  { label: "发动态", path: "/dynamics", icon: "💬", bg: "bg-purple-50" },
  { label: "添加项目", path: "/projects", icon: "📁", bg: "bg-pink-50" },
  { label: "图片管理", path: "/images", icon: "🖼", bg: "bg-green-50" },
  { label: "系统设置", path: "/settings", icon: "⚙", bg: "bg-gray-100" },
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
