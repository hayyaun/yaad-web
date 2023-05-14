import { useGLTF } from "@react-three/drei";
import { RigidBody, useRevoluteJoint } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import Objects from "./objects";

const modelPath = "/3d/balance-transformed.glb";

type GLTFResult = GLTF & {
  nodes: { [name: string]: THREE.Mesh };
  materials: {};
};

export default function BalanceModel({ children, ...props }: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(modelPath) as GLTFResult;

  const _balanceTop = useRef<any>(null!);

  const _rigidMain = useRef<any>(null!);
  const _rigidTop = useRef<any>(null!);
  const _rigidLeft = useRef<any>(null!);
  const _rigidRight = useRef<any>(null!);

  useLayoutEffect(() => {
    // _rigidRight.current.addForce({ x: 0, y: 0.01, z: 0 }, true);
  }, []);

  const topJoint = useRevoluteJoint(_rigidMain, _rigidTop, [
    [0, 2.63, 0],
    [0, 2.63, 0],
    [0, 0, 1],
  ]);

  const leftJoint = useRevoluteJoint(_rigidTop, _rigidLeft, [
    [-1, 2.63, 0],
    [-1, 2.63, 0],
    [0, 0, 1],
  ]);

  const rightJoint = useRevoluteJoint(_rigidTop, _rigidRight, [
    [1, 2.63, 0],
    [1, 2.63, 0],
    [0, 0, 1],
  ]);

  useEffect(() => {
    if (topJoint.current && leftJoint.current && rightJoint.current) {
      topJoint.current.setLimits(-0.15, 0.15);
      // config contacts
      topJoint.current.setContactsEnabled(false);
      leftJoint.current.setContactsEnabled(false);
      rightJoint.current.setContactsEnabled(false);
      // config motors
      // leftJoint.current.configureMotor(0, 0, 10, 0.001);
      // rightJoint.current.configureMotor(0, 0, 10, 0.001);
    }
  }, [leftJoint, rightJoint, topJoint]);

  return (
    <group {...props} dispose={null} scale={0.2}>
      <group position={[0.321, 0, 0.128]}>
        <RigidBody ref={_rigidMain} type="fixed" colliders={false}>
          <mesh geometry={nodes.balance.geometry}>{children}</mesh>
        </RigidBody>
        <group name={Objects.BalanceTop} ref={_balanceTop}>
          <RigidBody ref={_rigidTop} type="dynamic">
            <mesh geometry={nodes.balance001.geometry}>{children}</mesh>
          </RigidBody>
        </group>
        <RigidBody ref={_rigidLeft} name={Objects.BalanceLeft} colliders="trimesh">
          <group>
            <mesh geometry={nodes.balance002.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance003.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance004.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance005.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance006.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance007.geometry}>{children}</mesh>
            <group>
              <mesh geometry={nodes.balance008.geometry}>{children}</mesh>
            </group>
            <mesh geometry={nodes.balance009.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance010.geometry}>{children}</mesh>
          </group>
        </RigidBody>
        <RigidBody ref={_rigidRight} name={Objects.BalanceRight} colliders="trimesh">
          <group>
            <mesh geometry={nodes.balance011.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance012.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance013.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance014.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance015.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance016.geometry}>{children}</mesh>
            <group>
              <mesh geometry={nodes.balance017.geometry}>{children}</mesh>
            </group>
            <mesh geometry={nodes.balance018.geometry}>{children}</mesh>
            <mesh geometry={nodes.balance019.geometry}>{children}</mesh>
          </group>
        </RigidBody>
      </group>
    </group>
  );
}

useGLTF.preload(modelPath);
