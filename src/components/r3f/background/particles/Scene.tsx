import { OrbitControls, Points, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three/webgpu";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
// 0.4,2.3,5.2 -0.75, 2.8, 4.6fov: 50
const Scene = () => {
  return (
    <Canvas camera={{ position: [0, -2.75, 4] }}>
      <Particles />

      <OrbitControls />
      <Stats />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const matRef = useRef<ShaderMaterial>(null!);
  const COUNT = 1000;

  const pos = useMemo(() => {
    const pos = new Float32Array(COUNT * COUNT * 3);
    for (let r = 0; r < COUNT; r++) {
      for (let c = 0; c < COUNT; c++) {
        const x = (r / COUNT - 0.5) * 5;
        const y = (c / COUNT - 0.5) * 3;
        const z = 0;
        pos.set([x, y, z], 3 * (COUNT * r + c));
      }
    }
    return pos;
  }, []);

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
    <Points positions={pos} scale={[5, 5, 5]}>
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
      />
    </Points>
  );
};

// const COUNT = 4500;
// const GRID_SIZE = 100;
// const SPACING = 0.1;
// const OFFSET = (GRID_SIZE * SPACING) / 2;
// const { viewport } = useThree();
// const centerX = viewport.width / 2;
// const centerY = viewport.height / 2;

// const pos = useMemo(() => {
//   const pos = new Float32Array(COUNT * 3);
//   for (let i = 0; i < COUNT; i++) {
//     const x = (i % GRID_SIZE) * SPACING - OFFSET + centerX;
//     const y = Math.floor(i / GRID_SIZE) * SPACING - OFFSET + centerY;
//     const z = 0;
//     pos.set([x, y, z], i * 3);
//   }
//   return pos;
// }, []);
