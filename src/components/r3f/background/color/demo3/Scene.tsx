import { OrbitControls, useAspect, useTexture } from "@react-three/drei";
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
  const scale = useAspect(window.innerWidth, window.innerHeight, 1);
  const texture = useTexture("/images/dispTexture/Swirl.png");
  // const texture = useTexture("/images/li-zhang.jpg");

  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 }, uTexture: { value: texture } },
      vertex: vert,
      fragment: frag,
    }),
    [texture]
  );

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      {/* <boxGeometry args={[1, 1, 1, 300]} /> */}
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        transparent={true}
        // wireframe
      />
    </mesh>
  );
};
