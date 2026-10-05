<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">标签分类</h2>
      <div class="flex items-center gap-2">
        <input v-model="newTag" placeholder="新标签名" class="input w-40" @keydown.enter="createTag" />
        <button @click="createTag" class="btn-primary">添加</button>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex flex-wrap gap-3">
        <div v-for="tag in tags" :key="tag.id" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-aurora-50 transition-all group">
          <span class="text-aurora-400">#</span>
          <span class="font-medium text-gray-700 group-hover:text-aurora-600">{{ tag.name }}</span>
          <span class="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">{{ tag.postCount }}</span>
          <button @click="deleteTag(tag)" class="text-gray-300 hover:text-red-500 transition-colors">×</button>
        </div>
      </div>
      <div v-if="!tags.length" class="text-center py-8 text-gray-400">暂无标签</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const tags = ref<any[]>([]);
const newTag = ref("");

async function fetchTags() {
  try { const res = await api.get("/tags"); tags.value = res.data.data || []; } catch {}
}

async function createTag() {
  if (!newTag.value.trim()) return;
  try { await api.post("/tags", { name: newTag.value.trim() }); newTag.value = ""; await fetchTags(); }
  catch (e: any) { alert(e.response?.data?.error || "创建失败"); }
}

async function deleteTag(tag: any) {
  if (!confirm(`确定删除标签「${tag.name}」吗？`)) return;
  try { await api.delete(`/tags/${tag.id}`); await fetchTags(); } catch {}
}

onMounted(fetchTags);
</script>
