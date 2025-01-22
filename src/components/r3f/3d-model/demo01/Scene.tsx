import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { BustModel } from "./model/BustModel";
import Floor from "./floor/FloorMesh";
import { Vector3 } from "three";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 3, 6.15], lookAt: () => new Vector3(0, 0, 0) }}
    >
      <BustModel />
      {/* <Cloud color={"pink"} position={[0, -0.5, 1]} /> */}
      <Floor />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
