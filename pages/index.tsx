import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../src/Scene"), { ssr: false });

export default function Home() {
  return (
    <div className="scene">
      <Scene />
    </div>
  );
}
