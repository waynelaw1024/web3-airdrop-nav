export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "../lib/supabase";

type Project = {
  id: string;
  type: "POINTS" | "REWARD";
  name: string;
  slug: string | null;
  summary: string | null;
  referral_url: string | null;
  source_url: string | null;
  status: string | null;
  end_at: string | null;
  updated_at: string | null;
};

function Card({ p }: { p: Project }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        padding: 16,
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{p.name}</div>
        <span
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
          }}
        >
          {p.type === "REWARD" ? "🟩 短期奖励" : "🟦 积分项目"}
        </span>
      </div>

      {p.summary ? (
        <div style={{ color: "#666", marginTop: 8, lineHeight: 1.5 }}>
          {p.summary}
        </div>
      ) : null}

      <div style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
        {p.updated_at ? `更新：${new Date(p.updated_at).toLocaleString("zh-CN")}` : null}
        {p.type === "REWARD" && p.end_at ? (
          <span>　|　截止：{new Date(p.end_at).toLocaleString("zh-CN")}</span>
        ) : null}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {p.referral_url ? (
          <a
            href={p.referral_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            👉 去参与
          </a>
        ) : (
          <span style={{ color: "crimson" }}>缺少 referral_url</span>
        )}

        {p.source_url ? (
          <a
            href={p.source_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              textDecoration: "none",
            }}
          >
            来源
          </a>
        ) : null}

        <Link
          href={p.type === "REWARD" ? "/rewards" : "/points"}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          去该板块 →
        </Link>
      </div>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim();

  // 首页只展示“最新”内容：每类各 3 条（你可以改成 20）
  const [{ data: rewards, error: err1 }, { data: points, error: err2 }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("status", "ACTIVE")
        .eq("type", "REWARD")
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("projects")
        .select("*")
        .eq("status", "ACTIVE")
        .eq("type", "POINTS")
        .order("updated_at", { ascending: false })
        .limit(3),
    ]);

  const error = err1 ?? err2;

  let rewardList = (rewards ?? []) as Project[];
  let pointsList = (points ?? []) as Project[];

  // 搜索：在首页只搜索“最新这两组”
  if (q) {
    const ql = q.toLowerCase();
    rewardList = rewardList.filter(
      (x) =>
        (x.name ?? "").toLowerCase().includes(ql) ||
        (x.summary ?? "").toLowerCase().includes(ql)
    );
    pointsList = pointsList.filter(
      (x) =>
        (x.name ?? "").toLowerCase().includes(ql) ||
        (x.summary ?? "").toLowerCase().includes(ql)
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Web3 空投活动导航</h1>
      <div style={{ color: "#666", lineHeight: 1.6 }}>
        首页展示最新活动。
      </div>

      {/* 顶部导航：直接跳转到“完整列表页” */}
      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          全部
        </Link>
        <Link
          href="/rewards"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          🟩 短期奖励
        </Link>
        <Link
          href="/points"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          🟦 积分项目
        </Link>

        <
          action="/"
          method="get"
          style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索（仅在首页最新区内搜索）"
            style={{
              width: 360,
              maxWidth: "80vw",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            搜索
          </button>
        </>
      </div>

      {error ? (
        <pre style={{ marginTop: 20, color: "crimson" }}>
          读取失败：{error.message}
        </pre>
      ) : null}

      {/* 最新短期奖励 */}
      <section style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>🟩 最新短期奖励</h2>
          <Link href="/rewards" style={{ textDecoration: "none" }}>
            查看全部 →
          </Link>
        </div>
<div style={{ marginTop: 12, display: "grid", gap: 12 }}>
  {rewardList.map((p) => (
    <Card key={p.id} p={p} />
  ))}

  {rewardList.length === 0 ? (
    <div style={{ color: "#999" }}>暂无短期奖励项目</div>
  ) : (
   <Link
  href="/rewards"
  style={{
    display: "block",
    padding: 16,
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid #bbf7d0",
    background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
  }}
>
  更多短期奖励，点击进入该板块 →
</Link>

  )}
</div>

      </section>

      {/* 最新积分项目 */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>🟦 最新积分项目</h2>
          <Link href="/points" style={{ textDecoration: "none" }}>
            查看全部 →
          </Link>
        </div>
       <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
  {pointsList.map((p) => (
    <Card key={p.id} p={p} />
  ))}

  {pointsList.length === 0 ? (
    <div style={{ color: "#999" }}>暂无积分项目</div>
  ) : (
  <Link
  href="/points"
  style={{
    display: "block",
    padding: 16,
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff, #eef2ff)",
  }}
>
  更多最新积分项目，点击进入该板块 →
</Link>

  )}
</div>

      </section>

      <div style={{ marginTop: 22, fontSize: 12, color: "#999" }}>
        提醒：请核对官方来源，小额测试，谨防钓鱼链接与恶意授权。
      </div>
    </main>
  );
}
