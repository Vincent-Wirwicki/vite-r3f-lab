import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
import { ShaderMaterial } from "three";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <Particles />
      <OrbitControls />
    </Canvas>
  );
};

const Particles = () => {
  const matRef = useRef<ShaderMaterial>(null!);
  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 } },
      vert: vert,
      frag: frag,
    }),
    []
  );
  const COUNT = 80;
  const pos = useMemo(() => {
    const pos = new Float32Array(COUNT * COUNT * 3);
    for (let r = 0; r < COUNT; r++) {
      for (let c = 0; c < COUNT; c++) {
        const x = (r / COUNT - 0.5) * 5;
        const y = (c / COUNT - 0.5) * 5;
        const z = 0;
        pos.set([x, y, z], 3 * (COUNT * r + c));
      }
    }
    return pos;
  }, []);

  useFrame(({ clock, camera }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    console.log(camera.position);
  });

  return (
    <>
      <Points positions={pos} scale={[2, 2, 2]}>
        <shaderMaterial
          ref={matRef}
          uniforms={shader.uniforms}
          fragmentShader={shader.frag}
          vertexShader={shader.vert}
          transparent={true}
          depthTest={false}
          depthWrite={false}
        />
      </Points>
    </>
  );
};

export default Scene;
