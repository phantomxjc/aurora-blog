<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-gray-800">文章管理</h2>
        <span class="text-sm text-gray-400">({{ total }} 篇)</span>
      </div>
      <button @click="router.push('/posts/new')" class="btn-primary">✍️ 写新文章</button>
    </div>

    <!-- Search & Filter -->
    <div class="card p-4 flex flex-wrap items-center gap-3">
      <input v-model="searchQuery" placeholder="搜索文章..." class="input flex-1 min-w-[200px]" @input="debouncedSearch" />
      <select v-model="categoryFilter" class="input w-auto" @change="fetchPosts">
        <option value="">全部分类</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <label class="flex items-center gap-2 text-sm text-gray-500">
        <input type="checkbox" v-model="includeDrafts" @change="fetchPosts" class="rounded" /> 包含草稿
      </label>
    </div>

    <!-- Posts Table -->
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">标题</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">分类</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">标签</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">浏览</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">日期</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">状态</th>
            <th class="text-right px-4 py-3 text-sm font-medium text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-all">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span v-if="post.pinned" class="text-aurora-500">📌</span>
                <span class="text-sm font-medium text-gray-800 truncate max-w-xs">{{ post.title }}</span>
              </div>
            </td>
            <td class="px-4 py-3"><span class="badge-info" v-if="post.category">{{ post.category }}</span></td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                <span v-for="tag in post.tags.slice(0, 2)" :key="tag.id" class="text-xs text-gray-400">#{{ tag.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ post.views }}</td>
            <td class="px-4 py-3 text-sm text-gray-400">{{ formatDate(post.published) }}</td>
            <td class="px-4 py-3">
              <span :class="post.draft ? 'badge-warning' : 'badge-success'">{{ post.draft ? '草稿' : '已发布' }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="router.push(`/posts/${post.slug}/edit`)" class="text-sm text-aurora-600 hover:text-aurora-700 mr-3">编辑</button>
              <button @click="deletePost(post)" class="text-sm text-red-500 hover:text-red-600">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!posts.length" class="text-center py-12 text-gray-400">暂无文章</div>
    </div>

    <!-- Pagination -->
    <div v-if="total > limit" class="flex items-center justify-center gap-2">
      <button v-for="p in totalPages" :key="p" @click="page = p; fetchPosts()"
        :class="p === page ? 'bg-aurora-500 text-white' : 'bg-white text-gray-600 border border-gray-200'"
        class="w-9 h-9 rounded-lg text-sm font-medium transition-all">{{ p }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
import dayjs from "dayjs";

const router = useRouter();
const posts = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const categoryFilter = ref("");
const includeDrafts = ref(false);
const categories = ref<string[]>([]);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

function formatDate(d: string) { return dayjs(d).format("YYYY-MM-DD"); }

let debounceTimer: any;
function debouncedSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { page.value = 1; fetchPosts(); }, 300);
}

async function fetchPosts() {
  try {
    const res = await api.get("/posts", {
      params: { page: page.value, limit: limit.value, q: searchQuery.value || undefined, category: categoryFilter.value || undefined, draft: includeDrafts.value ? "true" : undefined },
    });
    posts.value = res.data.data || [];
    total.value = res.data.total || 0;
    // Extract categories
    const cats = new Set<string>();
    posts.value.forEach((p) => { if (p.category) cats.add(p.category); });
    categories.value = [...cats];
  } catch {}
}

async function deletePost(post: any) {
  if (!confirm(`确定删除「${post.title}」吗？`)) return;
  try {
    await api.delete(`/posts/${post.slug}`);
    await fetchPosts();
  } catch (e: any) {
    alert(e.response?.data?.error || "删除失败");
  }
}

onMounted(fetchPosts);
</script>
