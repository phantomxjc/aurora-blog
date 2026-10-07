import { defineStore } from "pinia";
import api from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as any,
    autoLogoutSeconds: 0,
  }),
  actions: {
    async login(username: string, password: string, captchaId?: string, captchaCode?: string) {
      const res = await api.post("/auth/login", { username, password, captchaId, captchaCode });
      this.token = res.data.token;
      this.user = res.data.user;
      this.autoLogoutSeconds = res.data.autoLogout || 0;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
      if (this.autoLogoutSeconds > 0) {
        localStorage.setItem("autoLogoutSeconds", String(this.autoLogoutSeconds));
      } else {
        localStorage.removeItem("autoLogoutSeconds");
      }
    },
    logout() {
      this.token = "";
      this.user = null;
      this.autoLogoutSeconds = 0;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("autoLogoutSeconds");
    },
    loadUser() {
      const stored = localStorage.getItem("user");
      if (stored) this.user = JSON.parse(stored);
      const autoLogout = localStorage.getItem("autoLogoutSeconds");
      if (autoLogout) this.autoLogoutSeconds = parseInt(autoLogout, 10);
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
