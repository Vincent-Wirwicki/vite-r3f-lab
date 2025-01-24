import { Center, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
import { Mesh, MeshStandardMaterial, ShaderMaterial } from "three";
// import { BustModel } from "./model/BustModel";
// import { GLTF } from "three-stdlib";
// import { Mesh, Points as P } from "three";

const Scene = () => {

  const cylHelix = () => {
    const t = 1
    const x = Math.cos(t)
    const y = Math.sin(t)
    const z = t
  
  }

  return (
    <Canvas shadows>
      <pointLight castShadow intensity={4} position={[0, 1, 2]} color="#fff" />
      {/* <pointLight castShadow intensity={2} position={[0, 0, 2]} color="#fff" /> */}

      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry />
        <meshBasicMaterial toneMapped={true} color="red" />
      </mesh>
      <mesh
        position={[0, -0.1, 0]}
        rotation={[Math.PI * -0.5, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshStandardMaterial />
      </mesh>

      {/* <Particles /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
