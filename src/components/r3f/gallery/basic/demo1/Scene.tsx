import { ScrollControls, useScroll } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

const Scene = () => {
  return (
    <Canvas>
      <ScrollControls horizontal pages={4}>
        <Mesh />
      </ScrollControls>
    </Canvas>
  );
};

export default Scene;

const Mesh = () => {
  const groupRef = useRef<Group>(null!);
  const scroll = useScroll();
  useFrame(() => {
    groupRef.current.position.x = scroll.offset * -8;
  });
  return (
    <group ref={groupRef}>
      <mesh scale={[8, 4.5, 1]} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 100, 100]} />
        <meshBasicMaterial />
      </mesh>
      <mesh scale={[8, 4.5, 1]} position={[10, 0, 0]}>
        <planeGeometry args={[1, 1, 100, 100]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};
