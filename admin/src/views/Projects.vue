<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">项目管理</h2>
      <button @click="showForm = !showForm" class="btn-primary">{{ showForm ? "取消" : "➕ 添加项目" }}</button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-6 space-y-4 animate-fade-up">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.title" placeholder="项目名称" class="input" />
        <input v-model="form.slug" placeholder="Slug (选填)" class="input" />
      </div>
      <textarea v-model="form.description" placeholder="项目描述" class="input h-20 resize-none"></textarea>
      <input v-model="form.coverImage" placeholder="封面图片 URL" class="input" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.demoUrl" placeholder="Demo URL" class="input" />
        <input v-model="form.repoUrl" placeholder="仓库 URL" class="input" />
      </div>
      <input v-model="techInput" placeholder="技术栈（逗号分隔）" class="input" />
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" v-model="form.featured" class="rounded" /> 精选</label>
        <label class="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" v-model="form.draft" class="rounded" /> 草稿</label>
      </div>
      <button @click="createProject" class="btn-primary">保存项目</button>
    </div>

    <!-- List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="project in projects" :key="project.id" class="card p-5 animate-fade-up">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-gray-800">{{ project.title }}</h3>
          <button @click="deleteProject(project.slug)" class="text-sm text-red-500 hover:text-red-600">删除</button>
        </div>
        <p class="text-sm text-gray-500 mb-3">{{ project.description }}</p>
        <div v-if="project.techStack?.length" class="flex flex-wrap gap-1 mb-3">
          <span v-for="tech in project.techStack" :key="tech" class="px-2 py-0.5 rounded text-xs bg-aurora-50 text-aurora-600">{{ tech }}</span>
        </div>
        <div class="flex gap-3 text-sm">
          <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="text-aurora-600">Demo →</a>
          <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="text-gray-500">Source →</a>
        </div>
      </div>
    </div>
    <div v-if="!projects.length" class="text-center py-12 text-gray-400">暂无项目</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const projects = ref<any[]>([]);
const showForm = ref(false);
const techInput = ref("");
const form = ref({ title: "", slug: "", description: "", coverImage: "", demoUrl: "", repoUrl: "", featured: false, draft: false });

async function fetchProjects() {
  try { const res = await api.get("/projects", { params: { draft: "true" } }); projects.value = res.data.data || []; } catch {}
}

async function createProject() {
  if (!form.value.title) return alert("请输入项目名称");
  try {
    await api.post("/projects", { ...form.value, techStack: techInput.value.split(",").map(s => s.trim()).filter(Boolean) });
    form.value = { title: "", slug: "", description: "", coverImage: "", demoUrl: "", repoUrl: "", featured: false, draft: false };
    techInput.value = ""; showForm.value = false;
    await fetchProjects();
  } catch (e: any) { alert(e.response?.data?.error || "创建失败"); }
}

async function deleteProject(slug: string) {
  if (!confirm("确定删除这个项目吗？")) return;
  try { await api.delete(`/projects/${slug}`); await fetchProjects(); } catch {}
}

onMounted(fetchProjects);
</script>
