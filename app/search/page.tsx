export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  type: "POINTS" | "REWARD";
  name: string;
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim();

  let list: Project[] = [];
  let errorMsg = "";

  if (q) {
    // 全站搜索：name 或 summary 命中（仅 ACTIVE）
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "ACTIVE")
      .or(`name.ilike.%${q}%,summary.ilike.%${q}%`)
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) errorMsg = error.message;
    list = (data ?? []) as Project[];
  }

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>搜索结果</h1>
        <Link href="/" style={{ textDecoration: "none" }}>
          ← 返回首页
        </Link>
      </div>

      <form action="/search" method="get" style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索项目名/简介（全站）"
          style={{
            flex: 1,
            minWidth: 240,
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

      {errorMsg ? <pre style={{ marginTop: 16, color: "crimson" }}>{errorMsg}</pre> : null}

      <div style={{ marginTop: 16, color: "#666" }}>
        {q ? `关键词：${q}，结果：${list.length} 条` : "请输入关键词进行搜索"}
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {list.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
