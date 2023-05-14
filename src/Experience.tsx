import { Box, OrbitControls, OrthographicCamera, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
// import { KernelSize, Resolution } from "postprocessing";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import BalanceModel from "./Balance";

// const accentBlue = new THREE.Color(57, 127, 243);
// const bgColor = new THREE.Color(246, 248, 252);
const accentBlue = "#397ff3";
const bgColor = "#222222";

const CAMERA = {
  init: {
    look: new THREE.Vector3(1, 0.25, 0),
    position: new THREE.Vector3(-1, 7, 3),
    zoom: 500,
  },
  final: {
    look: new THREE.Vector3(0, 1.5, 0),
    position: new THREE.Vector3(10, 10, -20),
    zoom: 200,
  },
};

export default function Experience() {
  const camera = useThree((s) => s.camera);

  // config camera
  useLayoutEffect(() => {
    camera.zoom = CAMERA.final.zoom;
    camera.position.x = CAMERA.final.position.x;
    camera.position.y = CAMERA.final.position.y;
    camera.position.z = CAMERA.final.position.z;
    camera.updateProjectionMatrix();
  }, [camera]);

  const _rightObjectMaterial = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state, delta) => {
    const et = state.clock.elapsedTime;
    // update camera
    state.camera.lookAt(CAMERA.final.look);
    // update glow
    if (_rightObjectMaterial.current) {
      _rightObjectMaterial.current.emissiveIntensity = 0.6 + Math.abs(Math.sin(Math.PI * et * 0.12)) * 0.2;
    }
  });

  const [showRight, setShowRight] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  useLayoutEffect(() => {
    setTimeout(async () => {
      setShowLeft(true);
    }, 100);
    setTimeout(async () => {
      setShowRight(true);
    }, 2000);
  }, []);

  const matcap = useTexture("/3d/2A2A2A_B3B3B3_6D6D6D_848C8C.png");

  return (
    <Fragment>
      <color attach="background" args={[bgColor]} />
      <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping />
      <OrthographicCamera makeDefault />
      <ambientLight intensity={0.75} />
      <directionalLight />
      <Physics updateLoop="independent" timeStep={1 / 30}>
        {/* ground */}
        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-0.21}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshBasicMaterial color={bgColor} />
          </mesh>
        </RigidBody>
        {/* balance model */}
        <BalanceModel>
          <meshMatcapMaterial matcap={matcap} />
        </BalanceModel>
        {/* falling objects */}
        {showLeft && (
          <RigidBody mass={10}>
            <Box position={[-1, 1, 0]} scale={0.25}>
              <meshStandardMaterial color="mediumpurple" />
            </Box>
          </RigidBody>
        )}
        {showRight && (
          <RigidBody mass={1000}>
            <Box position={[1, 1.5, 0]} scale={0.3}>
              <meshStandardMaterial
                ref={_rightObjectMaterial}
                name="RightObjectMaterial"
                color={accentBlue}
                emissive="white"
                emissiveIntensity={0.75}
                toneMapped={false}
              />
            </Box>
          </RigidBody>
        )}
      </Physics>
      <EffectComposer>
        <Bloom
          intensity={1.0} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          // blendFunction={THREE.NormalBlending}
          // kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur // Enables or disables mipmap blur.
          // resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          // resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
      </EffectComposer>
    </Fragment>
  );
}
