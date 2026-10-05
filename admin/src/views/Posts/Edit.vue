<template>
  <div class="space-y-4">
    <!-- Title bar -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">{{ isEdit ? "编辑文章" : "写新文章" }}</h2>
      <div class="flex items-center gap-2">
        <button @click="save(true)" class="btn-secondary">保存草稿</button>
        <button @click="save(false)" class="btn-primary">🚀 发布</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Editor -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Title -->
        <input v-model="form.title" placeholder="文章标题..." class="input text-lg font-semibold" />

        <!-- Description -->
        <input v-model="form.description" placeholder="文章描述（选填）..." class="input" />

        <!-- Markdown Editor -->
        <div class="card overflow-hidden">
          <!-- Toolbar -->
          <div class="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">
            <button v-for="btn in toolbar" :key="btn.label" @click="insertMarkdown(btn)"
              class="px-2.5 py-1.5 rounded-lg hover:bg-white text-sm text-gray-600 transition-all" :title="btn.label">
              {{ btn.icon }}
            </button>
            <div class="flex-1"></div>
            <button @click="previewMode = !previewMode"
              :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-all', previewMode ? 'bg-aurora-500 text-white' : 'text-gray-500 hover:bg-white']">
              {{ previewMode ? "📝 编辑" : "👁 预览" }}
            </button>
          </div>

          <!-- Editor / Preview -->
          <div v-if="!previewMode" class="relative">
            <textarea v-model="form.content" @drop="handleDrop" @dragover.prevent
              placeholder="在此输入 Markdown 内容... 支持拖拽图片上传"
              class="w-full h-[500px] p-4 outline-none resize-none font-mono text-sm leading-relaxed"></textarea>
            <div v-if="uploading" class="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span class="text-aurora-500">上传中...</span>
            </div>
          </div>
          <div v-else class="p-6 h-[500px] overflow-y-auto prose max-w-none" v-html="previewHtml"></div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Cover image -->
        <div class="card p-4">
          <label class="text-sm font-medium text-gray-700 mb-2 block">封面图片</label>
          <input v-model="form.coverImage" placeholder="图片 URL" class="input" />
          <img v-if="form.coverImage" :src="form.coverImage" class="mt-2 rounded-xl w-full h-32 object-cover" />
        </div>

        <!-- Category -->
        <div class="card p-4">
          <label class="text-sm font-medium text-gray-700 mb-2 block">分类</label>
          <input v-model="form.category" placeholder="输入分类" class="input" list="categories" />
          <datalist id="categories">
            <option v-for="cat in categories" :key="cat" :value="cat" />
          </datalist>
        </div>

        <!-- Tags -->
        <div class="card p-4">
          <label class="text-sm font-medium text-gray-700 mb-2 block">标签</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="(tag, i) in form.tags" :key="i"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-aurora-50 text-aurora-600 text-sm">
              {{ tag }}
              <button @click="form.tags.splice(i, 1)" class="text-aurora-400 hover:text-aurora-600">×</button>
            </span>
          </div>
          <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="输入标签后回车" class="input" />
        </div>

        <!-- Options -->
        <div class="card p-4 space-y-3">
          <label class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">置顶</span>
            <input type="checkbox" v-model="form.pinned" class="w-4 h-4 rounded text-aurora-500" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">精选</span>
            <input type="checkbox" v-model="form.featured" class="w-4 h-4 rounded text-aurora-500" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/api";
import { marked } from "marked";

const router = useRouter();
const route = useRoute();
const isEdit = computed(() => !!route.params.slug);

const form = ref({
  title: "", description: "", content: "", coverImage: "",
  category: "", tags: [] as string[], pinned: false, featured: false,
});
const tagInput = ref("");
const categories = ref<string[]>([]);
const previewMode = ref(false);
const previewHtml = ref("");
const uploading = ref(false);

const toolbar = [
  { label: "加粗", icon: "B", prefix: "**", suffix: "**" },
  { label: "斜体", icon: "I", prefix: "*", suffix: "*" },
  { label: "标题", icon: "H", prefix: "## ", suffix: "" },
  { label: "链接", icon: "🔗", prefix: "[", suffix: "](url)" },
  { label: "图片", icon: "🖼", prefix: "![", suffix: "](url)" },
  { label: "代码", icon: "</>", prefix: "`", suffix: "`" },
  { label: "代码块", icon: "{}", prefix: "\n```\n", suffix: "\n```\n" },
  { label: "引用", icon: "❝", prefix: "> ", suffix: "" },
  { label: "列表", icon: "•", prefix: "- ", suffix: "" },
  { label: "分隔线", icon: "—", prefix: "\n---\n", suffix: "" },
];

function insertMarkdown(btn: any) {
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = form.value.content;
  form.value.content = text.slice(0, start) + btn.prefix + text.slice(start, end) + btn.suffix + text.slice(end);
  textarea.focus();
}

function addTag() {
  if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
    form.value.tags.push(tagInput.value.trim());
  }
  tagInput.value = "";
}

async function updatePreview() {
  if (!form.value.content) { previewHtml.value = ""; return; }
  try {
    const res = await api.post("/posts/preview", { content: form.value.content });
    previewHtml.value = res.data.html;
  } catch {
    previewHtml.value = marked(form.value.content) as string;
  }
}

watch(() => form.value.content, () => { if (previewMode.value) updatePreview(); });
watch(previewMode, (val) => { if (val) updatePreview(); });

async function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (!files?.length) return;
  e.preventDefault();
  uploading.value = true;
  try {
    const formData = new FormData();
    for (const file of files) formData.append("images", file);
    const res = await api.post("/images/upload", formData);
    const urls = res.data.data.map((img: any) => img.url);
    const markdown = urls.map((url: string) => `![](${url})`).join("\n");
    form.value.content += "\n" + markdown;
  } catch {
    alert("图片上传失败");
  } finally {
    uploading.value = false;
  }
}

async function save(draft: boolean) {
  if (!form.value.title) return alert("请输入标题");
  try {
    const data = { ...form.value, draft };
    if (isEdit.value) {
      await api.put(`/posts/${route.params.slug}`, data);
    } else {
      await api.post("/posts", data);
    }
    router.push("/posts");
  } catch (e: any) {
    alert(e.response?.data?.error || "保存失败");
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await api.get(`/posts/${route.params.slug}`, { params: { draft: true } });
      const post = res.data;
      form.value = {
        title: post.title, description: post.description, content: post.content,
        coverImage: post.coverImage, category: post.category || "",
        tags: post.tags?.map((t: any) => t.name) || [], pinned: post.pinned, featured: post.featured,
      };
    } catch {}
  }
  // Load categories
  try {
    const res = await api.get("/posts", { params: { limit: 100 } });
    const cats = new Set<string>();
    res.data.data.forEach((p: any) => { if (p.category) cats.add(p.category); });
    categories.value = [...cats];
  } catch {}
});
</script>

</script>
