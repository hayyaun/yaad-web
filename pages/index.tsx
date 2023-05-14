import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../src/Scene"), { ssr: false });

export default function Home() {
  return (
    <div style={{ height: "100%" }}>
      <Scene />
    </div>
  );
}
