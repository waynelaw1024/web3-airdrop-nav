import Link from "next/link";

export default function PointsPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>🟦 中长线积分项目</h1>
      <p>如果你看到这行字，说明 /points 页面创建成功。</p>
      <p><Link href="/">← 返回首页</Link></p>
    </main>
  );
}
