import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0.7, 3.8] }}>
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

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <Points positions={pos} scale={[2, 2, 2]}>
      {/* <pointsMaterial size={0.015} /> */}
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        // transparent={true}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
};

// const LinesFibo = () => {
//   const COUNT = 300;

//   // Evenly points distrubution on a sphere
//   // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
//   const pos = useMemo(() => {
//     const phi = Math.PI * (Math.sqrt(5) - 1);
//     const pos: Vector3[] = [];
//     for (let i = 0; i < COUNT; i++) {
//       const y = 1 - (i / (COUNT - 1)) * 2;
//       const radius = Math.sqrt(1 - y * y);
//       const theta = phi * i;
//       const x = Math.cos(theta) * radius;
//       const z = Math.sin(theta) * radius;
//       const vec = new Vector3(x, y, z);
//       pos.push(vec);
//     }

//     return pos;
//   }, []);

//   const lineSegments = useMemo(() => {
//     const segmentsList = [];
//     for (let i = 0; i < pos.length; i++) {
//       for (let j = i + 1; j < pos.length; j++) {
//         if (pos[i].distanceTo(pos[j]) < 0.25) {
//           segmentsList.push([pos[i], pos[j]]);
//         }
//       }
//     }
//     return segmentsList;
//   }, [pos]);

//   return (
//     <Instances limit={lineSegments.length}>
//       <sphereGeometry args={[5, 64, 64]} />
//       <meshStandardMaterial color="#f0f0f0" />
//       <Instance>
//         {lineSegments.map((segment, index) => (
//           <Line
//             key={index}
//             points={segment}
//             color="white"
//             lineWidth={1.5}
//             // segments={true}
//           />
//         ))}
//       </Instance>
//     </Instances>
//   );
// };
