import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../src/Scene"), { ssr: true });

export default function Home() {
  return <Scene />;
}
