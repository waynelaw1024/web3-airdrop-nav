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
            👉 去参与（邀请码）
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
  searchParams?: { q?: string; t?: string };
}) {
  const q = (searchParams?.q ?? "").trim();
  const t = (searchParams?.t ?? "ALL").toUpperCase(); // ALL | POINTS | REWARD

  // 先取最新的 50 条（足够做首页展示），再在服务端做简单过滤
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(50);

  let list = (data ?? []) as Project[];

  if (t === "POINTS") list = list.filter((x) => x.type === "POINTS");
  if (t === "REWARD") list = list.filter((x) => x.type === "REWARD");

  if (q) {
    const ql = q.toLowerCase();
    list = list.filter(
      (x) =>
        (x.name ?? "").toLowerCase().includes(ql) ||
        (x.summary ?? "").toLowerCase().includes(ql)
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Web3 空投活动导航</h1>
      <div style={{ color: "#666", lineHeight: 1.6 }}>
        按更新时间展示最新活动。点击「去参与」会默认使用你的邀请码链接。
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="/?t=ALL"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: t === "ALL" ? 800 : 500,
          }}
        >
          全部
        </a>
        <a
          href="/?t=REWARD"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: t === "REWARD" ? 800 : 500,
          }}
        >
          🟩 短期奖励
        </a>
        <a
          href="/?t=POINTS"
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: t === "POINTS" ? 800 : 500,
          }}
        >
          🟦 积分项目
        </a>

        <form
          action="/"
          method="get"
          style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <input type="hidden" name="t" value={t} />
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索项目名/简介（如：points / usdt / galxe）"
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
        </form>
      </div>

      {error ? (
        <pre style={{ marginTop: 20, color: "crimson" }}>
          读取失败：{error.message}
        </pre>
      ) : null}

      <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
        {list.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>

      <div style={{ marginTop: 22, fontSize: 12, color: "#999" }}>
        提醒：请核对官方来源，小额测试，谨防钓鱼链接与恶意授权。
      </div>
    </main>
  );
}
