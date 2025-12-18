export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { supabase } from "../../lib/supabase";
export default async function RewardsPage() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("type", "REWARD")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(50);

  return (
    <main style={{ padding: 40 }}>
      <h1>🟩 短期奖励项目</h1>
      <p style={{ color: "#666" }}>
        限时任务，直接拿 Token / USDT / NFT
      </p>

      <p>
        <Link href="/">← 返回首页</Link>
      </p>

      {error && (
        <pre style={{ color: "crimson", marginTop: 20 }}>
          读取失败：{error.message}
        </pre>
      )}

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {(data ?? []).map((p: any) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              padding: 16,
              borderRadius: 10,
            }}
          >
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ color: "#666", marginTop: 6 }}>
              {p.summary}
            </div>

            {p.end_at && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
                截止时间：{new Date(p.end_at).toLocaleString("zh-CN")}
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <a
                href={p.referral_url}
                target="_blank"
                rel="noreferrer"
              >
                👉 去参与（邀请码）
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
