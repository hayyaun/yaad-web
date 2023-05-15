import { Box, Html, OrbitControls, OrthographicCamera, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
import { Fragment, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import BalanceModel from "./Balance";
import Content from "./Content";
import useWindowSize from "./useWindowSize";

const isDev = process.env.NODE_ENV === "development";
const isDebug = false && isDev;

const accentBlue = "#397ff3";
const bgColor = "#000000";

export default function Experience() {
  const camera = useThree((s) => s.camera);
  const { height: innerHeight = window.innerHeight } = useWindowSize();
  const _dlight = useRef<THREE.DirectionalLight>(null!);
  const _html = useRef<THREE.Group>(null!);
  const { viewport } = useThree();

  const factorH = useMemo(() => innerHeight / 938, [innerHeight]);
  const htmlSize = useMemo(
    () => (viewport.getCurrentViewport().aspect < 1.25 ? factorH * 350 : factorH * 500),
    [viewport, factorH]
  );

  // useHelper(_dlight, DirectionalLightHelper);

  useFrame(() => {
    const { width, aspect } = viewport.getCurrentViewport();
    // attrs
    const data = {
      camera: {
        position: { x: 0, y: 0, z: 0 },
        look: { x: 0, y: 0, z: 0 },
        zoom: 0,
      },
      html: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    };
    data.camera.position.x = -width / 2 + 3;
    data.camera.position.y = 12;
    data.camera.position.z = 15;
    data.camera.zoom = 120 * factorH;
    data.camera.look.x = data.camera.position.x;
    data.camera.look.y = 1;
    data.camera.look.z = 0;
    data.html.position.x = -width + 5.5;
    data.html.position.y = 1;
    // @media
    if (aspect < 1.25) {
      data.camera.position.x = 0;
      data.camera.position.y = 10;
      data.camera.zoom = 75 * factorH;
      data.camera.look.x = 0;
      data.camera.look.y = -3;
      data.html.position.x = 0;
      data.html.position.y = -7;
    }
    // updater
    camera.position.x = data.camera.position.x;
    camera.position.y = data.camera.position.y;
    camera.position.z = data.camera.position.z;
    camera.zoom = data.camera.zoom;
    camera.lookAt(data.camera.look.x, data.camera.look.y, data.camera.look.z);
    camera.updateProjectionMatrix();
    _html.current.position.x = data.html.position.x;
    _html.current.position.y = data.html.position.y;
    _html.current.position.z = data.html.position.z;
  });

  return (
    <Fragment>
      {isDebug && <axesHelper />}
      {isDebug && <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping />}
      <color attach="background" args={[bgColor]} />
      <OrthographicCamera makeDefault />
      <ambientLight intensity={0.75} />
      <directionalLight ref={_dlight} position={[2, 5, 0]} />
      <Physics updateLoop="independent" timeStep={1 / 25} debug={isDebug}>
        <World />
      </Physics>
      <group ref={_html}>
        <Html center>
          <div style={{ width: htmlSize, height: htmlSize }}>
            <Content />
          </div>
        </Html>
      </group>
      <EffectComposer>
        <Bloom
          intensity={2.0} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur // Enables or disables mipmap blur.
        />
        <Vignette />
      </EffectComposer>
    </Fragment>
  );
}

const World = () => {
  // textures
  const matcap = useTexture("/3d/2A2A2A_B3B3B3_6D6D6D_848C8C.png");
  // states
  const [showRight, setShowRight] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  // refs
  const _rightObjectMaterial = useRef<THREE.MeshStandardMaterial>(null!);

  // frame-loop
  useFrame((state, delta) => {
    const et = state.clock.elapsedTime;
    // update glow
    if (_rightObjectMaterial.current) {
      _rightObjectMaterial.current.emissiveIntensity = 0.6 + Math.abs(Math.sin(Math.PI * et * 0.12)) * 0.2;
    }
  });

  // show falling objects
  useLayoutEffect(() => {
    setTimeout(() => setShowLeft(true), 100);
    setTimeout(() => setShowRight(true), 2000);
  }, []);

  return (
    <group rotation={[0, -Math.PI * 0.25, 0]}>
      {/* ground */}
      <RigidBody type="fixed">
        <mesh receiveShadow position-y={-0.05}>
          <boxGeometry args={[4, 0.1, 2.5]} />
          <meshStandardMaterial color={"#222222"} />
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
    </group>
  );
};
