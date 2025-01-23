import { Canvas } from "@react-three/fiber";
import { BustModel } from "./model/BustModel";
import Floor from "./floor/FloorMesh";
import { Vector3 } from "three";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-2">
      {/* <div className="w-1/2 h-8  bg-[navy] border-[#808080] border-4">
        VapoWave.exe{" "}
      </div> */}

      <div className="h-4/5 w-1/2 p-2 border-[#808080] border-8 bg-[#C0C0C0] flex flex-col">
        <div className="w-full h-[5px] bg-[#1084d0]"></div>
        <Canvas
          camera={{
            position: [0, 3, 6.15],
            lookAt: () => new Vector3(0, 0, 0),
          }}
          dpr={1}
        >
          <BustModel />
          <Floor />
        </Canvas>
      </div>
    </div>
  );
};

export default Scene;
