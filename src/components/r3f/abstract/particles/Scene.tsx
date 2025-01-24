import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0.7, 5.2] }}>
      {/* <color attach="background" args={["#BF0426"]} /> */}
      <Particles />
      {/* <LinesFibo /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const COUNT = 10000;
  const matRef = useRef<ShaderMaterial>(null!);
  // Evenly points distrubution on a sphere
  // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere

  const pos = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const c = 3; // Scale factor for the catenoid

    for (let i = 0; i < COUNT; i++) {
      const v = (i / COUNT) * 2 - 1; // Map `v` to a range
      const u = (i % 360) * (Math.PI / 180); // Convert angle to radians

      const x = c * Math.cosh(v / c) * Math.cos(u);
      const y = c * Math.cosh(v / c) * Math.sin(u);
      const z = v;

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

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <Points positions={pos} scale={[2, 2, 2]}>
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        transparent={false}
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </Points>
  );
};
// rotation={[Math.PI * 0.5, 0, 0]}
// HELIX FORMULA
// const spacing = 0.01;
// const x = 0.5 * Math.cos(i * spacing);
// const y = 0.5 * Math.sin(i * spacing);
// const z = i * spacing

// WEIRD CURVE BASE OF FAIL IMPLEMENTATION OF SPHERE LOXODROME
// play with u and v value to make things
// const u = i * 0.1;
// const v = i * 0.01;
// const x = 2.1 * Math.cos(u) * Math.sin(v);
// const y = 2.1 * Math.sin(u) * Math.sin(v);
// const z = Math.cos(u);
