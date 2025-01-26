import {
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Points,
  RenderTexture,
  useFBO,
} from "@react-three/drei";
import { Canvas, createPortal, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  ShaderMaterial,
  Vector3,
  Scene,
  OrthographicCamera,
  NearestFilter,
  RGBAFormat,
  FloatType,
  DataTexture,
} from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const finalScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 0] }}>
      {/* <color attach="background" args={["#BF0426"]} /> */}

      {/* <LinesFibo /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default finalScene;

const PortalScene = () => {
  const size = 512;

  const { scene, cam, positions, uvs } = useMemo(() => {
    const scene = new Scene();
    const cam = new OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const positions = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]);
    const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);
    return { scene, cam, positions, uvs };
  }, []);

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const target = useFBO(512, 512, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
  });

  const getCube = (density: number, radius: number) => {
    const size = density * density * 4;
    const data = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      const stride = i * 4;
      // const d = Math.random() * 2 + 1;
      // const d1 = Math.sqrt(Math.random()) * 2.0;

      const x = Math.random() * radius;
      const y = Math.random() * radius;
      const z = Math.random() * radius;

      data[stride] = x;
      data[stride + 1] = y;
      data[stride + 2] = z;
      data[stride + 3] = 1;
    }
    return data;
  };
  
  const dataTex = new DataTexture(getCube(size, 1));
  dataTex.needsUpdate = true;


  return createPortal(
    <mesh>
      {" "}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          array={uvs}
          itemSize={2}
        />
      </bufferGeometry>
    </mesh>,
    scene
  );
};

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
    <mesh position={[0, 2, 0]}>
      <icosahedronGeometry args={[1, 64]} />

      <meshStandardMaterial>
        <RenderTexture attach={"map"} anisotropy={16}>
          <PerspectiveCamera
            makeDefault
            manual
            aspect={1 / 1}
            position={[0, 0, 8]}
            lookAt={() => new Vector3(0, 0, 0)}
          />
          <color attach="background" args={["black"]} />
          <boxGeometry />
          <meshBasicMaterial color="red" />
          <ambientLight intensity={2.5} />

          <Points
            positions={pos}
            scale={[2, 2, 2]}
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
