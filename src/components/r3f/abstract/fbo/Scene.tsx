import {
  // MeshPortalMaterial,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import PortScene from "./PortScene";
// import { Vector3 } from "three";

const finalScene = () => {
  return (
    <Canvas
      dpr={2}
      camera={{
        position: [0.41, 0.5, 2],
        // lookAt: () => new Vector3(0, 0, 0),
      }}
    >
      <color attach="background" args={["#000"]} />
      {/* <LinesFibo MeshReflectorMaterial/> */}
      <PortScene />
      <Stats />
      {/* 
      <ambientLight intensity={5} color={"black"} />
      <directionalLight intensity={5} position={[0, 0, 2]} color={"black"} />
      <directionalLight intensity={5} position={[0, 0, -2]} color={"black"} /> */}
      {/* <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 32]} />
        <meshBasicMaterial color={"#056CF2"} />
      </mesh> */}
      <OrbitControls />
    </Canvas>
  );
};

export default finalScene;
// // _Vector3x: 2.134020007477742, y: -0.07615052403032826, z: 3.252317651591264}
// _Vector3{x: 1.7816329827140975, y: -0.20277482903953706, z: 3.4506373735316345}
