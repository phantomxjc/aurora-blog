import { getDynamics } from "@/lib/api";
import dayjs from "dayjs";
import { MessageCircle, Pin } from "lucide-react";
import { MotionDiv } from "@/components/Motion";

export default async function DynamicsPage() {
  let dynamics: any[] = [];
  try {
    const res = await getDynamics();
    dynamics = res.data || [];
  } catch {}

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <MessageCircle className="w-6 h-6 text-aurora-500" />
          <h1 className="text-3xl font-bold font-serif text-gray-900">动态</h1>
        </div>

        {dynamics.length > 0 ? (
          <div className="space-y-6">
            {dynamics.map((dyn, i) => {
              let images: string[] = [];
              try { images = JSON.parse(dyn.images || "[]"); } catch {}
              return (
                <MotionDiv
                  key={dyn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
                >
                  {dyn.pinned && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aurora-50 text-aurora-500 text-xs mb-2">
                      <Pin className="w-3 h-3" /> 置顶
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">{dyn.content}</p>
                  {images.length > 0 && (
                    <div className={`grid ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 mb-3`}>
                      {images.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="rounded-xl w-full h-48 object-cover" />
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-gray-400">{dayjs(dyn.published).format("YYYY-MM-DD HH:mm")}</span>
                </MotionDiv>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">暂无动态</div>
        )}
      </div>
    </div>
  );
}
