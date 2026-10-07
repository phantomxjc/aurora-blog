<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-aurora-900 to-purple-900">
    <!-- Animated background -->
    <div class="absolute top-20 left-20 w-72 h-72 bg-aurora-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>

    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-[0.03]" :style="{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }"></div>

    <!-- Login card -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="glass rounded-3xl p-8 shadow-2xl animate-fade-up">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-block w-16 h-16 rounded-2xl bg-gradient-to-br from-aurora-400 via-purple-400 to-pink-400 flex items-center justify-center mb-4 shadow-xl shadow-aurora-500/30">
            <span class="text-3xl">🌌</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Aurora Admin</h1>
          <p class="text-white/50 text-sm mt-1">管理后台登录</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm text-white/70 mb-2">用户名</label>
            <input v-model="username" type="text" required
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-aurora-400 focus:ring-4 focus:ring-aurora-400/20 outline-none transition-all"
              placeholder="请输入用户名" />
          </div>
          <div>
            <label class="block text-sm text-white/70 mb-2">密码</label>
            <input v-model="password" type="password" required
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-aurora-400 focus:ring-4 focus:ring-aurora-400/20 outline-none transition-all"
              placeholder="请输入密码" />
          </div>

          <!-- Captcha -->
          <div v-if="captchaEnabled">
            <label class="block text-sm text-white/70 mb-2">验证码</label>
            <div class="flex gap-3">
              <input v-model="captchaCode" type="text" required maxlength="4"
                class="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-aurora-400 focus:ring-4 focus:ring-aurora-400/20 outline-none transition-all"
                placeholder="请输入验证码" />
              <img v-if="captchaImage" :src="captchaImage" @click="fetchCaptcha"
                class="h-12 rounded-xl cursor-pointer border border-white/20 hover:border-aurora-400 transition-all" title="点击刷新" />
              <div v-else class="w-[120px] h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span class="text-white/30 text-sm">加载中...</span>
              </div>
            </div>
          </div>

          <div v-if="error" class="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-aurora-500 to-purple-500 text-white font-medium hover:shadow-xl hover:shadow-aurora-500/30 transition-all disabled:opacity-50">
            <span v-if="loading">登录中...</span>
            <span v-else>登 录</span>
          </button>
        </form>

        <p class="text-center text-white/30 text-xs mt-6">默认账号: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";

const router = useRouter();
const auth = useAuthStore();
const username = ref("admin");
const password = ref("admin123");
const error = ref("");
const loading = ref(false);

// Captcha
const captchaEnabled = ref(true);
const captchaId = ref("");
const captchaImage = ref("");
const captchaCode = ref("");

async function fetchCaptcha() {
  try {
    const res = await api.get("/auth/captcha");
    captchaId.value = res.data.id;
    captchaImage.value = res.data.image;
    captchaCode.value = "";
  } catch {
    // If captcha endpoint fails, disable captcha
    captchaEnabled.value = false;
  }
}

async function checkCaptchaEnabled() {
  try {
    const res = await api.get("/settings");
    captchaEnabled.value = res.data.captchaEnabled !== "false";
  } catch {
    captchaEnabled.value = true;
  }
}

async function handleLogin() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(username.value, password.value, captchaId.value, captchaCode.value);
    router.push("/");
  } catch (e: any) {
    error.value = e.response?.data?.error || "登录失败，请重试";
    // Refresh captcha on login failure
    if (captchaEnabled.value) await fetchCaptcha();
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await checkCaptchaEnabled();
  if (captchaEnabled.value) await fetchCaptcha();
});
</script>
