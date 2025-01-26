import {
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Points,
  RenderTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial, Vector3 } from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0.85, 5] }}>
      <color attach="background" args={["black"]} />
      {/* <fog attach="fog" args={["#17171b", 100, 30]} /> */}

      {/* <color attach="background" args={["#BF0426"]} /> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 0]} />
      {/* <pointLight position={[0, 2, 0]} intensity={1} /> */}
      <Particles />
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.5, 2]}>
        <planeGeometry args={[20, 10]} />
        <MeshReflectorMaterial
          mirror={1}
          // blur={[400, 100]}
          resolution={1024}
          // mixBlur={1}
          mixStrength={15}
          // depthScale={1}
          minDepthThreshold={0.15}
          color="#151515"
          metalness={0.6}
          roughness={1}
        />
      </mesh>
      {/* <LinesFibo /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const COUNT = 100000;
  const matRef = useRef<ShaderMaterial>(null!);

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
    <mesh position={[0, 1, 0]}>
      <planeGeometry args={[8, 3]} />

      <meshStandardMaterial>
        <RenderTexture attach={"map"} anisotropy={16}>
          <PerspectiveCamera
            makeDefault
            manual
            aspect={1 / 1}
            position={[0, 0.25, 10]}
            lookAt={() => new Vector3(0, 0, 0)}
          />
          <color attach="background" args={["#262626"]} />
          <Points
            positions={pos}
            // scale={[2, 2, 2]}
            rotation={[0, Math.PI * 0.5, 0]}
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
          </Points>
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
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
