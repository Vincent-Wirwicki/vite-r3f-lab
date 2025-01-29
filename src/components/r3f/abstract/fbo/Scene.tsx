import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import PortScene from "./PortScene";

const finalScene = () => {
  return (
    <Canvas camera={{ position: [1.8, -0.2, 3.45] }}>
      <color attach="background" args={["black"]} />
      {/* <LinesFibo MeshReflectorMaterial/> */}
      <PortScene />
      {/* <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 0]} />
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.5, 2]}>
        <planeGeometry args={[20, 20]} />
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
      </mesh> */}
      <OrbitControls />
    </Canvas>
  );
};

export default finalScene;
// // _Vector3x: 2.134020007477742, y: -0.07615052403032826, z: 3.252317651591264}
// _Vector3{x: 1.7816329827140975, y: -0.20277482903953706, z: 3.4506373735316345}
