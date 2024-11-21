import { OrbitControls, Point, Points, PositionPoint } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <Canvas>
      <Particles />
      {/* <Particles2 /> */}
      <OrbitControls />
    </Canvas>
  );
};

const Particles = () => {
  const COUNT = 500;

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
  function getInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return (
    <>
      {Array.from({ length: 500 }, (_, i) => (
        <MyMesh
          key={`${i}--${pos[i]}`}
          index={i}
          pos={pos}
          delay={getInt(100, 300)}
        />
      ))}
    </>
  );
};

const MyMesh = ({
  index,
  pos,
  delay,
}: {
  index: number;
  pos: Float32Array;
  delay: number;
}) => {
  //   const meshRef = useRef<Mesh>(null!);
  const pRef = useRef<PositionPoint>(null!);

  const [target, setTarget] = useState(index);
  useEffect(() => {
    const interval = setInterval(() => {
      setTarget(prev => (prev + 1) % (pos.length / 3));
    }, 1500);

    return () => clearInterval(interval);
  }, [pos.length, delay]);

  useFrame(() => {
    const targetPos = [
      pos[target * 3],
      pos[target * 3 + 1],
      pos[target * 3 + 2],
    ];

    pRef.current.position.lerp(
      {
        x: targetPos[0] * 5,
        y: targetPos[1] * 5,
        z: targetPos[2] * 5,
      },
      0.075
    );
  });

  return (
    <>
      <Points
      // positions={[pos[target * 3], pos[target * 3 + 1], pos[target * 3 + 2]]}
      >
        <pointsMaterial size={0.1} color="white" />
        <Point ref={pRef}></Point>
      </Points>
      {/* <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh> */}
    </>
  );
};

export default Scene;

// useEffect(() => {
//   const interval = setInterval(() => {
//     setTarget(prev => (prev + 1) % (pos.length / 3));
//   }, 500);

//   return () => clearInterval(interval);
// }, [pos.length]);

// useFrame(() => {
//   const targetPos = [pos[target * 3], pos[target * 3 + 1], pos[target * 3 + 2]];

//   meshRef.current.position.lerp(
//     {
//       x: targetPos[0] * SCALE,
//       y: targetPos[1] * SCALE,
//       z: targetPos[2] * SCALE,
//     },
//     0.15
//   );
// });
