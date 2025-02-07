import {
  // MeshPortalMaterial,
  MeshReflectorMaterial,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import PortScene from "./PortScene";
import { DoubleSide, Vector3 } from "three";

const finalScene = () => {
  return (
    <Canvas
      camera={{
        position: [0.41, 0.5, 2],
        lookAt: () => new Vector3(0, 0, 0),
      }}
    >
      <color attach="background" args={["black"]} />
      {/* <LinesFibo MeshReflectorMaterial/> */}

      <PortScene />

      <ambientLight intensity={5} />
      <directionalLight position={[0, 2, 0]} />
      {/* <mesh rotation={[Math.PI * -0.5, 0, 0]} position={[2, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <MeshReflectorMaterial
          mirror={1}
          // blur={[400, 100]}
          resolution={1024}
          // mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.15}
          color="#151515"
          metalness={0.6}
          roughness={1}
          side={DoubleSide}
        />
      </mesh> */}
      <OrbitControls />
    </Canvas>
  );
};

export default finalScene;
// // _Vector3x: 2.134020007477742, y: -0.07615052403032826, z: 3.252317651591264}
// _Vector3{x: 1.7816329827140975, y: -0.20277482903953706, z: 3.4506373735316345}
