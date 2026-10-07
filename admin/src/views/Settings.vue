<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800">系统设置</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Site Info -->
      <div class="card p-6 space-y-4">
        <h3 class="font-semibold text-gray-700">站点信息</h3>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">站点名称</label>
          <input v-model="settings.siteName" class="input" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">站点描述</label>
          <textarea v-model="settings.siteDescription" class="input h-20 resize-none"></textarea>
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">站点口号（Footer 显示）</label>
          <input v-model="settings.siteSlogan" class="input" placeholder="用技术记录生活，用文字分享思考" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">作者名称</label>
          <input v-model="settings.siteAuthor" class="input" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">作者主页 URL</label>
          <input v-model="settings.siteAuthorUrl" class="input" placeholder="https://github.com/..." />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">站点 URL</label>
          <input v-model="settings.siteUrl" class="input" />
        </div>
      </div>

      <!-- Homepage Display Text -->
      <div class="card p-6 space-y-4">
        <h3 class="font-semibold text-gray-700">首页展示文字</h3>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">Hero 欢迎徽标文字</label>
          <input v-model="settings.heroBadgeText" class="input" placeholder="欢迎来到" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-500 mb-1 block">文章数量标签</label>
            <input v-model="settings.heroPostCountLabel" class="input" placeholder="篇文章" />
          </div>
          <div>
            <label class="text-sm text-gray-500 mb-1 block">更新状态标签</label>
            <input v-model="settings.heroUpdateLabel" class="input" placeholder="持续更新中" />
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">CTA 标题</label>
          <input v-model="settings.ctaTitle" class="input" placeholder="开始你的写作之旅" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">CTA 副标题</label>
          <textarea v-model="settings.ctaSubtitle" class="input h-20 resize-none" placeholder="用 Markdown 记录想法，用技术分享知识。{siteName} 让写作变得简单而美好。"></textarea>
          <p class="text-xs text-gray-400 mt-1">可用 <code class="bg-gray-100 px-1 rounded">{siteName}</code> 占位符自动替换为站点名称</p>
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">CTA 按钮文字</label>
          <input v-model="settings.ctaButtonText" class="input" placeholder="了解更多" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-500 mb-1 block">精选文章区标题</label>
            <input v-model="settings.featuredSectionTitle" class="input" placeholder="精选文章" />
          </div>
          <div>
            <label class="text-sm text-gray-500 mb-1 block">最新文章区标题</label>
            <input v-model="settings.latestSectionTitle" class="input" placeholder="最新文章" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm text-gray-500 mb-1 block">查看全部按钮</label>
            <input v-model="settings.viewAllText" class="input" placeholder="查看全部" />
          </div>
          <div>
            <label class="text-sm text-gray-500 mb-1 block">空文章提示</label>
            <input v-model="settings.emptyPostText" class="input" placeholder="暂无文章，去后台发布第一篇吧！" />
          </div>
        </div>
      </div>
    </div>

    <!-- About Page Text -->
    <div class="card p-6 space-y-4">
      <h3 class="font-semibold text-gray-700">关于页面文字</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1 block">关于本站（标题）</label>
          <input v-model="settings.aboutTitle" class="input" placeholder="关于本站" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">技术特性（标题）</label>
          <input v-model="settings.aboutFeaturesTitle" class="input" placeholder="技术特性" />
        </div>
      </div>
      <div>
        <label class="text-sm text-gray-500 mb-1 block">关于本站（描述）</label>
        <textarea v-model="settings.aboutDescription" class="input h-20 resize-none" placeholder="站点介绍文字"></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1 block">技术栈（标题）</label>
          <input v-model="settings.aboutTechStackTitle" class="input" placeholder="技术栈" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">开发者（标题）</label>
          <input v-model="settings.aboutDeveloperTitle" class="input" placeholder="开发者" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1 block">开发者角色描述</label>
          <input v-model="settings.aboutDeveloperRole" class="input" placeholder="全栈开发者 · 博客维护者" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">联系我（标题）</label>
          <input v-model="settings.aboutContactTitle" class="input" placeholder="联系我" />
        </div>
      </div>
      <div>
        <label class="text-sm text-gray-500 mb-1 block">联系我（描述）</label>
        <textarea v-model="settings.aboutContactText" class="input h-20 resize-none" placeholder="如果你对这个项目有任何问题或建议，欢迎通过以下方式联系我："></textarea>
      </div>
    </div>

    <!-- Social Links -->
    <div class="card p-6 space-y-4">
      <h3 class="font-semibold text-gray-700">社交链接</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1 block">GitHub</label>
          <input v-model="social.github" class="input" placeholder="https://github.com/..." />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">Twitter</label>
          <input v-model="social.twitter" class="input" placeholder="https://twitter.com/..." />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">Email</label>
          <input v-model="social.email" class="input" placeholder="admin@example.com" />
        </div>
      </div>
    </div>

    <!-- ICP Filing Info -->
    <div class="card p-6 space-y-4">
      <h3 class="font-semibold text-gray-700">备案信息</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500 mb-1 block">ICP 备案号</label>
          <input v-model="settings.icpNumber" class="input" placeholder="如：京ICP备202XXXXXX号" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">ICP 备案链接</label>
          <input v-model="settings.icpUrl" class="input" placeholder="https://beian.miit.gov.cn/" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">公安备案号</label>
          <input v-model="settings.policeIcp" class="input" placeholder="如：京公网安备110XXXXXXX号" />
        </div>
        <div>
          <label class="text-sm text-gray-500 mb-1 block">公安备案链接</label>
          <input v-model="settings.policeIcpUrl" class="input" placeholder="https://beian.mps.gov.cn/" />
        </div>
      </div>
      <p class="text-xs text-gray-400">备案信息将显示在博客首页底部。留空则不显示。</p>
    </div>

    <!-- Security Settings -->
    <div class="card p-6 space-y-4">
      <h3 class="font-semibold text-gray-700">安全设置</h3>
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="captchaEnabled" class="w-5 h-5 rounded text-aurora-500" />
          <div>
            <span class="text-sm font-medium text-gray-700">启用登录验证码</span>
            <p class="text-xs text-gray-400">登录时需要输入 4 位数字图片验证码</p>
          </div>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="autoLogoutEnabled" class="w-5 h-5 rounded text-aurora-500" />
          <div>
            <span class="text-sm font-medium text-gray-700">启用无操作自动退出</span>
            <p class="text-xs text-gray-400">长时间无操作后自动退出登录</p>
          </div>
        </label>
        <div v-if="autoLogoutEnabled" class="pl-8">
          <label class="text-sm text-gray-500 mb-1 block">自动退出时间（分钟）</label>
          <input v-model.number="autoLogoutMinutes" type="number" min="1" max="1440" class="input w-40" />
        </div>
      </div>
    </div>

    <!-- Save button -->
    <div class="flex justify-end">
      <button @click="save" class="btn-primary" :disabled="saving">{{ saving ? "保存中..." : "💾 保存设置" }}</button>
    </div>

    <!-- Change Password -->
    <div class="card p-6">
      <h3 class="font-semibold text-gray-700 mb-4">修改密码</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input v-model="oldPassword" type="password" placeholder="原密码" class="input" />
        <input v-model="newPassword" type="password" placeholder="新密码" class="input" />
        <input v-model="confirmPassword" type="password" placeholder="确认新密码" class="input" />
      </div>
      <button @click="changePassword" class="btn-secondary">修改密码</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const settings = ref({
  siteName: "", siteDescription: "", siteSlogan: "", siteAuthor: "", siteAuthorUrl: "", siteUrl: "",
  heroBadgeText: "", heroPostCountLabel: "", heroUpdateLabel: "",
  ctaTitle: "", ctaSubtitle: "", ctaButtonText: "",
  featuredSectionTitle: "", latestSectionTitle: "", viewAllText: "", emptyPostText: "",
  icpNumber: "", icpUrl: "", policeIcp: "", policeIcpUrl: "",
  aboutTitle: "", aboutDescription: "", aboutFeaturesTitle: "",
  aboutTechStackTitle: "", aboutDeveloperTitle: "", aboutDeveloperRole: "",
  aboutContactTitle: "", aboutContactText: "",
});
const social = ref({ github: "", twitter: "", email: "" });
const captchaEnabled = ref(true);
const autoLogoutEnabled = ref(true);
const autoLogoutMinutes = ref(30);
const saving = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function fetchSettings() {
  try {
    const res = await api.get("/settings");
    const data = res.data;
    settings.value = {
      siteName: data.siteName || "", siteDescription: data.siteDescription || "",
      siteSlogan: data.siteSlogan || "", siteAuthor: data.siteAuthor || "",
      siteAuthorUrl: data.siteAuthorUrl || "", siteUrl: data.siteUrl || "",
      heroBadgeText: data.heroBadgeText || "", heroPostCountLabel: data.heroPostCountLabel || "",
      heroUpdateLabel: data.heroUpdateLabel || "",
      ctaTitle: data.ctaTitle || "", ctaSubtitle: data.ctaSubtitle || "",
      ctaButtonText: data.ctaButtonText || "",
      featuredSectionTitle: data.featuredSectionTitle || "", latestSectionTitle: data.latestSectionTitle || "",
      viewAllText: data.viewAllText || "", emptyPostText: data.emptyPostText || "",
      icpNumber: data.icpNumber || "", icpUrl: data.icpUrl || "",
      policeIcp: data.policeIcp || "", policeIcpUrl: data.policeIcpUrl || "",
      aboutTitle: data.aboutTitle || "", aboutDescription: data.aboutDescription || "",
      aboutFeaturesTitle: data.aboutFeaturesTitle || "", aboutTechStackTitle: data.aboutTechStackTitle || "",
      aboutDeveloperTitle: data.aboutDeveloperTitle || "", aboutDeveloperRole: data.aboutDeveloperRole || "",
      aboutContactTitle: data.aboutContactTitle || "", aboutContactText: data.aboutContactText || "",
    };
    if (data.socialLinks) {
      try { social.value = JSON.parse(data.socialLinks); } catch {}
    }
    captchaEnabled.value = data.captchaEnabled !== "false";
    autoLogoutEnabled.value = data.autoLogoutEnabled !== "false";
    autoLogoutMinutes.value = parseInt(data.autoLogoutMinutes || "30", 10);
  } catch {}
}

async function save() {
  saving.value = true;
  try {
    await api.put("/settings", {
      ...settings.value,
      socialLinks: JSON.stringify(social.value),
      captchaEnabled: captchaEnabled.value ? "true" : "false",
      autoLogoutEnabled: autoLogoutEnabled.value ? "true" : "false",
      autoLogoutMinutes: String(autoLogoutMinutes.value),
    });
    alert("设置已保存");
  } catch { alert("保存失败"); } finally { saving.value = false; }
}

async function changePassword() {
  if (!oldPassword.value || !newPassword.value) return alert("请填写完整");
  if (newPassword.value !== confirmPassword.value) return alert("两次密码不一致");
  try {
    await api.post("/auth/change-password", { oldPassword: oldPassword.value, newPassword: newPassword.value });
    oldPassword.value = ""; newPassword.value = ""; confirmPassword.value = "";
    alert("密码修改成功");
  } catch (e: any) { alert(e.response?.data?.error || "修改失败"); }
}

onMounted(fetchSettings);
</script>
