import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0.85, 5] }}>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 0]} />
      <Particles />
      <mesh>
        <torusGeometry /> <meshStandardMaterial />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const COUNT = 3000;
  const matRef = useRef<ShaderMaterial>(null!);

  const pos = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = Math.random() * 2 - 1;

      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  const speed = useMemo(() => {
    const speed = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const x = Math.random();
      const y = Math.random();
      const z = Math.random();

      speed.set([x, y, z], i * 3);
    }
    return speed;
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
    <points
    // positions={pos}
    // scale={[2, 2, 2]}
    // rotation={[0, Math.PI * 0.5, 0]}
    >
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
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={pos.length / 3}
          array={pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speed.length / 3}
          array={speed}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
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
