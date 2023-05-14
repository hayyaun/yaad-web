import { Box, OrbitControls, OrthographicCamera, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, useRapier } from "@react-three/rapier";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import BalanceModel from "./Balance";
import Objects from "./objects";

const accentBlue = new THREE.Color(57, 127, 243);
const bgColor = new THREE.Color(246, 248, 252);

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

  useFrame((state, delta) => {
    // update camera
    state.camera.lookAt(CAMERA.final.look);
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

  const matcap = useTexture("/3d/2D2D2F_C6C2C5_727176_94949B.png");

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
            <meshStandardMaterial color="greenyellow" />
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
          <RigidBody mass={20}>
            <Box position={[1, 1.5, 0]} scale={0.3}>
              <meshStandardMaterial color="mediumpurple" />
            </Box>
          </RigidBody>
        )}
      </Physics>
    </Fragment>
  );
}
