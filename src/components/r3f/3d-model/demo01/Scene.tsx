import { Center, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { vert } from "./shader/vert";
import { frag } from "./shader/frag";
import { Mesh, MeshStandardMaterial, ShaderMaterial } from "three";
// import { BustModel } from "./model/BustModel";
import { GLTF } from "three-stdlib";
// import { Mesh, Points as P } from "three";

const Scene = () => {
  return (
    <Canvas>
      <pointLight castShadow intensity={2} position={[1, 1, 2]} color="#fff" />
      <pointLight
        castShadow
        intensity={2}
        position={[-1, -1, 2]}
        color="#fff"
      />

      {/* <Particles /> */}
      <BustModel />
      <OrbitControls />
    </Canvas>
  );
};

type GLTFResult = GLTF & {
  nodes: {
    marble_bust_01: Mesh;
  };
  materials: {
    marble_bust_01: MeshStandardMaterial;
  };
  // animations: GLTFAction[]
};
const BustModel = () => {
  const { nodes } = useGLTF("/model/bust/marble_bust_01_1k.gltf") as GLTFResult;
  const texture = useTexture(
    "/model/bust/textures/marble_bust_01_nor_gl_1k.jpg"
  );
  // materials
  const matRef = useRef<ShaderMaterial>(null!);

  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 }, uDiffuse: { value: texture } },
      vert: vert,
      frag: frag,
    }),
    [texture]
  );

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group dispose={null}>
      <Center>
        <mesh
          scale={10}
          castShadow
          geometry={nodes.marble_bust_01.geometry}
          // material={materials.marble_bust_01}
          position={[0, 0.2, 0.15]}
        >
          <shaderMaterial
            ref={matRef}
            attach="material"
            uniforms={shader.uniforms}
            fragmentShader={shader.frag}
            vertexShader={shader.vert}

            // wireframe
          />
        </mesh>
        {/* <mesh
          scale={10.2}
          castShadow
          geometry={nodes.marble_bust_01.geometry}
          // material={materials.marble_bust_01}
          position={[0, 0.2, 0.15]}
        >
          <shaderMaterial
            ref={matRef}
            attach="material"
            uniforms={shader.uniforms}
            fragmentShader={shader.frag}
            vertexShader={shader.vert}
            transparent
            wireframe
          />
        </mesh> */}
      </Center>
    </group>
  );
};

useGLTF.preload("/model/bust/marble_bust_01_1k.gltf");

export default Scene;
