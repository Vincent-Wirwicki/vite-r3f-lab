import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, -0.25, -5.15] }}>
      <Particles />
      {/* <LinesFibo /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const COUNT = 2000;
  const matRef = useRef<ShaderMaterial>(null!);
  // Evenly points distrubution on a sphere
  // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
  const pos = useMemo(() => {
    const phi = Math.PI * (Math.sqrt(5) - 1);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  const shader = useMemo(
    () => ({
      uniforms: { uSize: { value: 1 }, uTime: { value: 0 } },
      vertex: vert,
      fragment: frag,
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    console.log(camera.position);
  });

  return (
    <Points positions={pos} scale={[2, 2, 2]} rotation={[0, 0, 0]}>
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        transparent={true}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
};
