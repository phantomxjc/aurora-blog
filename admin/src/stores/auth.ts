import { defineStore } from "pinia";
import api from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as any,
  }),
  actions: {
    async login(username: string, password: string) {
      const res = await api.post("/auth/login", { username, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadUser() {
      const stored = localStorage.getItem("user");
      if (stored) this.user = JSON.parse(stored);
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
