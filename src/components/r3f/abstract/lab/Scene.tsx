import { OrbitControls, useAspect } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
import { ShaderMaterial } from "three";
// import { BustModel } from "./model/BustModel";
// import { GLTF } from "three-stdlib";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <Canvas shadows>
      <NoisyMesh />
      <OrbitControls />
    </Canvas>
  );
};

const NoisyMesh = () => {
  const matRef = useRef<ShaderMaterial>(null!);
  const screen = useAspect(window.innerWidth, window.innerHeight, 1.25);
  const shader = useMemo(
    () => ({
      uniforms: { uSize: { value: 1 }, uTime: { value: 0 } },
      vertex: vert,
      fragment: frag,
    }),
    []
  );
  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh scale={[...screen]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
      />
    </mesh>
  );
};

export default Scene;
