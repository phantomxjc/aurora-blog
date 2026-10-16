<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="rounded-3xl p-6 overflow-hidden relative" style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef)">
      <div class="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style="background:radial-gradient(circle,white,transparent)"></div>
      <div class="relative z-10">
        <h2 class="text-2xl font-bold text-white mb-1">📊 流量监控</h2>
        <p class="text-white/70 text-sm">访问记录与流量统计分析</p>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="(stat, i) in overviewCards" :key="stat.label" class="card p-5 animate-fade-up" :style="{ animationDelay: `${i * 0.1}s` }">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :style="{ background: stat.gradient }">{{ stat.icon }}</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
        <div class="text-sm text-gray-400 mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Trend Chart -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">📈 最近 7 天流量趋势</h2>
      <div class="flex items-end gap-2 h-48">
        <div v-for="item in trend" :key="item.date" class="flex-1 flex flex-col items-center gap-1 group">
          <div class="w-full flex flex-col items-center justify-end h-40 relative">
            <!-- UV bar (lighter, behind) -->
            <div class="w-full max-w-[40px] rounded-t-lg bg-aurora-200 transition-all group-hover:bg-aurora-300" :style="{ height: `${(item.uv / maxTrendPv) * 100}%` }"></div>
            <!-- PV bar (darker, in front) -->
            <div class="w-full max-w-[40px] rounded-t-lg bg-aurora-500 transition-all group-hover:bg-aurora-600 absolute bottom-0" :style="{ height: `${(item.pv / maxTrendPv) * 100}%` }"></div>
          </div>
          <span class="text-xs text-gray-400">{{ item.date.slice(5) }}</span>
          <span class="text-xs font-medium text-gray-600">{{ item.pv }}</span>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-aurora-500 inline-block"></span> PV</span>
        <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-aurora-200 inline-block"></span> UV</span>
      </div>
    </div>

    <!-- Hourly Distribution -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">🕐 今日小时分布</h2>
      <div class="flex items-end gap-1 h-32">
        <div v-for="item in hourly" :key="item.hour" class="flex-1 flex flex-col items-center justify-end h-28 group relative">
          <div class="w-full rounded-t bg-gradient-to-t from-aurora-400 to-aurora-300 transition-all group-hover:from-aurora-600 group-hover:to-aurora-500" :style="{ height: `${(item.pv / maxHourlyPv) * 100}%` }"></div>
          <span v-if="item.hour % 4 === 0" class="text-xs text-gray-400 mt-1">{{ item.hour }}h</span>
          <span v-else class="text-xs text-transparent mt-1">.</span>
          <!-- Tooltip -->
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {{ item.hour }}:00 — PV: {{ item.pv }} / UV: {{ item.uv }}
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pages & Recent Visits -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Pages -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">🔥 热门页面</h2>
        <div v-if="topPages.length" class="space-y-2">
          <div v-for="page in topPages" :key="page.path" class="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-aurora-50/50 transition-all">
            <span class="text-sm font-medium text-gray-700 truncate flex-1">{{ page.path.replace('/api/posts/', '') }}</span>
            <span class="text-xs text-gray-400">{{ page.uniqueVisitors }} UV</span>
            <span class="badge-success">{{ page.count }} PV</span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <span class="text-3xl block mb-2">📭</span>暂无数据
        </div>
      </div>

      <!-- Recent Visitors -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">👥 最近访客</h2>
        <div v-if="visitors.length" class="space-y-2">
          <div v-for="v in visitors" :key="v.visitorId" class="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-aurora-50/50 transition-all">
            <div class="w-8 h-8 rounded-full bg-aurora-100 flex items-center justify-center text-sm text-aurora-600 font-bold">
              {{ v.ip.slice(-2) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-700">{{ v.ip }}</div>
              <div class="text-xs text-gray-400 truncate">{{ v.userAgent.slice(0, 50) || 'Unknown' }}</div>
            </div>
            <span class="text-xs text-gray-400">{{ v.visits }}次</span>
            <span class="text-xs text-gray-400">{{ formatTime(v.lastVisit) }}</span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <span class="text-3xl block mb-2">🔍</span>暂无访客
        </div>
      </div>
    </div>

    <!-- Recent Access Logs -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">📋 最近访问记录</h2>
        <button @click="loadRecent" class="text-sm text-aurora-600 hover:text-aurora-700 transition-colors">刷新 →</button>
      </div>
      <div v-if="recentLogs.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-100">
              <th class="py-2 px-3 font-medium">时间</th>
              <th class="py-2 px-3 font-medium">IP</th>
              <th class="py-2 px-3 font-medium">方法</th>
              <th class="py-2 px-3 font-medium">路径</th>
              <th class="py-2 px-3 font-medium">状态</th>
              <th class="py-2 px-3 font-medium">耗时</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in recentLogs" :key="log.id" class="border-b border-gray-50 hover:bg-aurora-50/30 transition-colors">
              <td class="py-2 px-3 text-gray-600">{{ formatTime(log.createdAt) }}</td>
              <td class="py-2 px-3 text-gray-600 font-mono text-xs">{{ log.ip }}</td>
              <td class="py-2 px-3">
                <span :class="methodClass(log.method)">{{ log.method }}</span>
              </td>
              <td class="py-2 px-3 text-gray-600 font-mono text-xs truncate max-w-xs">{{ log.path }}</td>
              <td class="py-2 px-3">
                <span :class="statusClass(log.status)">{{ log.status }}</span>
              </td>
              <td class="py-2 px-3 text-gray-400 text-xs">{{ log.duration }}ms</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-10 text-gray-400">
        <span class="text-4xl block mb-2">📋</span>暂无访问记录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/api";

const overview = ref({ todayPV: 0, todayUV: 0, weekPV: 0, weekUV: 0, monthPV: 0, monthUV: 0, totalPV: 0, totalUV: 0 });
const trend = ref<{ date: string; pv: number; uv: number }[]>([]);
const hourly = ref<{ hour: number; pv: number; uv: number }[]>([]);
const topPages = ref<{ path: string; count: number; uniqueVisitors: number }[]>([]);
const visitors = ref<any[]>([]);
const recentLogs = ref<any[]>([]);

const overviewCards = computed(() => [
  { label: "今日 PV", value: overview.value.todayPV, icon: "👁", gradient: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
  { label: "今日 UV", value: overview.value.todayUV, icon: "👤", gradient: "linear-gradient(135deg,#fefce8,#fef9c3)" },
  { label: "本周 PV", value: overview.value.weekPV, icon: "📅", gradient: "linear-gradient(135deg,#faf5ff,#f3e8ff)" },
  { label: "本月 PV", value: overview.value.monthPV, icon: "📊", gradient: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
]);

const maxTrendPv = computed(() => Math.max(...trend.value.map((t) => t.pv), 1));
const maxHourlyPv = computed(() => Math.max(...hourly.value.map((h) => h.pv), 1));

function formatTime(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return d.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function methodClass(method: string) {
  const classes: Record<string, string> = {
    GET: "px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700",
    POST: "px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700",
    PUT: "px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700",
    DELETE: "px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700",
  };
  return classes[method] || "px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700";
}

function statusClass(status: number) {
  if (status >= 200 && status < 300) return "px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700";
  if (status >= 300 && status < 400) return "px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700";
  if (status >= 400 && status < 500) return "px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700";
  return "px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700";
}

async function loadAll() {
  try {
    const [ov, tr, hr, tp, vs, rc] = await Promise.all([
      api.get("/traffic/overview").catch(() => null),
      api.get("/traffic/trend", { params: { days: 7 } }).catch(() => null),
      api.get("/traffic/hourly").catch(() => null),
      api.get("/traffic/top-pages", { params: { limit: 10 } }).catch(() => null),
      api.get("/traffic/visitors", { params: { limit: 15 } }).catch(() => null),
      api.get("/traffic/recent", { params: { limit: 20 } }).catch(() => null),
    ]);
    if (ov?.data) overview.value = ov.data;
    if (tr?.data) trend.value = tr.data;
    if (hr?.data) hourly.value = hr.data;
    if (tp?.data) topPages.value = tp.data;
    if (vs?.data) visitors.value = vs.data;
    if (rc?.data) recentLogs.value = rc.data.data || [];
  } catch {}
}

async function loadRecent() {
  try {
    const rc = await api.get("/traffic/recent", { params: { limit: 20 } });
    if (rc?.data) recentLogs.value = rc.data.data || [];
  } catch {}
}

onMounted(loadAll);
</script>
