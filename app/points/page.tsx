export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { supabase } from "../../lib/supabase";
export default async function PointsPage() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("type", "POINTS")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(50);

  return (
    <main style={{ padding: 40 }}>
      <h1>🟦 中长线积分项目</h1>
      <p style={{ color: "#666" }}>做任务拿 Points/XP，等待未来空投</p>
      <p><Link href="/">← 返回首页</Link></p>

      {error ? (
        <pre style={{ marginTop: 20, color: "crimson" }}>
          读取失败：{error.message}
        </pre>
      ) : null}

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {(data ?? []).map((p: any) => (
          <div
            key={p.id}
            style={{ border: "1px solid #eee", padding: 16, borderRadius: 10 }}
          >
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ color: "#666", marginTop: 6 }}>{p.summary}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
              <a href={p.referral_url} target="_blank" rel="noreferrer">
                去参与
              </a>
              {p.source_url ? (
                <a href={p.source_url} target="_blank" rel="noreferrer">
                  来源
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
