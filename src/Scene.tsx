import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

export default function Scene() {
  return (
    <Canvas style={{ height: "100%" }} gl={{}} dpr={1}>
      <Experience />
    </Canvas>
  );
}
