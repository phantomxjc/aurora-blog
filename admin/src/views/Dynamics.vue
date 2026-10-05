<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">动态管理</h2>
    </div>

    <!-- New Dynamic -->
    <div class="card p-4">
      <textarea v-model="newContent" placeholder="说点什么..." class="input h-24 resize-none mb-3"></textarea>
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" v-model="newPinned" class="rounded" /> 置顶
        </label>
        <button @click="createDynamic" class="btn-primary" :disabled="!newContent.trim()">发布动态</button>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div v-for="dyn in dynamics" :key="dyn.id" class="card p-4 animate-fade-up">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span v-if="dyn.pinned" class="text-aurora-500">📌</span>
              <p class="text-gray-700 whitespace-pre-wrap">{{ dyn.content }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ formatDate(dyn.published) }}</span>
          </div>
          <button @click="deleteDynamic(dyn.id)" class="text-sm text-red-500 hover:text-red-600">删除</button>
        </div>
      </div>
      <div v-if="!dynamics.length" class="text-center py-12 text-gray-400">暂无动态</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";
import dayjs from "dayjs";

const dynamics = ref<any[]>([]);
const newContent = ref("");
const newPinned = ref(false);

function formatDate(d: string) { return dayjs(d).format("YYYY-MM-DD HH:mm"); }

async function fetchDynamics() {
  try { const res = await api.get("/dynamics"); dynamics.value = res.data.data || []; } catch {}
}

async function createDynamic() {
  if (!newContent.value.trim()) return;
  try {
    await api.post("/dynamics", { content: newContent.value, pinned: newPinned.value });
    newContent.value = ""; newPinned.value = false;
    await fetchDynamics();
  } catch (e: any) { alert(e.response?.data?.error || "发布失败"); }
}

async function deleteDynamic(id: number) {
  if (!confirm("确定删除这条动态吗？")) return;
  try { await api.delete(`/dynamics/${id}`); await fetchDynamics(); } catch {}
}

onMounted(fetchDynamics);
</script>
