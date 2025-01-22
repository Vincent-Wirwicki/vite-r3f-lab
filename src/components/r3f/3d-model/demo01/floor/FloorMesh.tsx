import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
import { ShaderMaterial } from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FloorMesh = () => {
  const matRef = useRef<ShaderMaterial>(null!);
  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 } },
      vert: vert,
      frag: frag,
    }),
    []
  );

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh
      receiveShadow
      rotation={[Math.PI * -0.5, 0, 0]}
      position={[0, -0.85, -5]}
    >
      <planeGeometry args={[4, 30, 100, 100]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        uniforms={shader.uniforms}
        fragmentShader={shader.frag}
        vertexShader={shader.vert}
      />
    </mesh>
  );
};

export default FloorMesh;
