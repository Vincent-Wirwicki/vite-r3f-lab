import { OrbitControls, useAspect } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ShaderMaterial } from "three/webgpu";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <PlaneBg />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const PlaneBg = () => {
  const matRef = useRef<ShaderMaterial>(null!);
  const scale = useAspect(window.innerWidth, window.innerHeight, 0.25);

  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 } },
      vertex: vert,
      fragment: frag,
    }),
    []
  );

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh scale={scale}>
      <planeGeometry args={[10, 10, 300, 300]} />
      {/* <boxGeometry args={[1, 1, 1, 300]} /> */}

      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        transparent={true}
        wireframe
      />
    </mesh>
  );
};
