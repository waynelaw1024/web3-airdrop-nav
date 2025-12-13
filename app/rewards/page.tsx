import Link from "next/link";

export default function RewardsPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>🟩 短期奖励项目</h1>
      <p>如果你看到这行字，说明 /rewards 页面创建成功。</p>
      <p><Link href="/">← 返回首页</Link></p>
    </main>
  );
}
