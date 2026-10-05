<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">图片管理</h2>
      <label class="btn-primary cursor-pointer">
        📤 上传图片
        <input type="file" multiple accept="image/*" class="hidden" @change="uploadImages" />
      </label>
    </div>

    <!-- Upload area -->
    <div @drop="handleDrop" @dragover.prevent
      class="card p-8 border-2 border-dashed border-gray-200 text-center cursor-pointer hover:border-aurora-300 transition-all">
      <span class="text-4xl block mb-2">🖼</span>
      <p class="text-gray-400">拖拽图片到此处或点击上方按钮上传</p>
    </div>

    <!-- Gallery -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="img in images" :key="img.id" class="card overflow-hidden group relative animate-fade-up">
        <img :src="getImageUrl(img.url)" :alt="img.originalName" class="w-full h-32 object-cover" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button @click="copyUrl(img)" class="px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 text-sm mr-2">复制</button>
          <button @click="deleteImage(img)" class="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-sm">删除</button>
        </div>
      </div>
    </div>
    <div v-if="!images.length" class="text-center py-12 text-gray-400">暂无图片</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const images = ref<any[]>([]);

function getImageUrl(url: string) { return url.startsWith("http") ? url : `${API_BASE}${url}`; }

async function fetchImages() {
  try { const res = await api.get("/images"); images.value = res.data.data || []; } catch {}
}

async function uploadImages(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;
  const formData = new FormData();
  for (const file of files) formData.append("images", file);
  try { await api.post("/images/upload", formData); await fetchImages(); } catch { alert("上传失败"); }
}

async function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (!files?.length) return;
  const formData = new FormData();
  for (const file of files) formData.append("images", file);
  try { await api.post("/images/upload", formData); await fetchImages(); } catch {}
}

function copyUrl(img: any) {
  navigator.clipboard.writeText(getImageUrl(img.url));
  alert("链接已复制");
}

async function deleteImage(img: any) {
  if (!confirm("确定删除这张图片吗？")) return;
  try { await api.delete(`/images/${img.id}`); await fetchImages(); } catch {}
}

onMounted(fetchImages);
</script>
