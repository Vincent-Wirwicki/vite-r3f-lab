import { useFBO } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  ShaderMaterial,
  Scene,
  OrthographicCamera,
  NearestFilter,
  RGBAFormat,
  FloatType,
  DataTexture,
} from "three";
import { vertSim } from "../vertSim";
import { fragSim } from "../fragSim";
import { vertRender } from "../../render/vertRender";
import { fragRender } from "../../render/fragRender";

const PortScene = () => {
  const size = 512;
  const simRef = useRef<ShaderMaterial>(null!);
  const renderRef = useRef<ShaderMaterial>(null!);
  const scene = useMemo(() => new Scene(), []);
  const cam = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, -1, 1), []);

  // UV
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

  // DATA POINT ------------
  const getPlane = (density: number, r1: number, r2: number) => {
    const size = density * density * 4;
    const data = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      const stride = i * 4;

      const x = Math.random() * r1 - r2;
      const y = Math.random() * r1 - r2;
      const z = 1;
      const w = 1;

      data[stride] = x;
      data[stride + 1] = y;
      data[stride + 2] = z;
      data[stride + 3] = w;
    }
    return data;
  };

  // DATA POINT TEXTURE --------------
  const dataTex = useMemo(
    () =>
      new DataTexture(getPlane(size, 2, 1), size, size, RGBAFormat, FloatType),
    []
  );
  dataTex.needsUpdate = true;

  const offsetTex = useMemo(
    () =>
      new DataTexture(
        getPlane(size, 1, 0.5),
        size,
        size,
        RGBAFormat,
        FloatType
      ),
    []
  );

  offsetTex.needsUpdate = true;

  // SIM MAT ---------------
  const shaderSim = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uPositions: { value: dataTex },
        uOffset: { value: offsetTex },
      },
      vertex: vertSim,
      fragment: fragSim,
    }),
    [dataTex, offsetTex]
  );

  // RENDER MAT ---------------
  const shaderRender = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 }, uPositions: { value: null } },
      vertex: vertRender,
      fragment: fragRender,
    }),
    []
  );

  // FBO
  let targetA = useFBO(512, 512, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
    depth: true,
    stencilBuffer: true,
  });

  let targetB = targetA.clone();

  const state = useThree();

  //init FBO the texture
  useEffect(() => {
    const { gl } = state;
    gl.setRenderTarget(targetA);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(targetB);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
  });

  useFrame(({ gl, clock, camera }) => {
    gl.setRenderTarget(targetA);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    simRef.current.uniforms.uTime.value = clock.elapsedTime;
    simRef.current.uniforms.uPositions.value = targetA.texture;
    renderRef.current.uniforms.uPositions.value = targetB.texture;
    console.log(camera.position);
    const temp = targetA;
    targetA = targetB;
    targetB = temp;
  });

  return (
    <>
      {createPortal(
        <mesh scale={1} position={[0, 0, 0]}>
          <shaderMaterial
            ref={simRef}
            uniforms={shaderSim.uniforms}
            fragmentShader={shaderSim.fragment}
            vertexShader={shaderSim.vertex}
          />
          <planeGeometry args={[2, 2]} />
          {/* <bufferGeometry>
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
          </bufferGeometry> */}
        </mesh>,
        scene
      )}

      <points>
        <shaderMaterial
          ref={renderRef}
          uniforms={shaderRender.uniforms}
          fragmentShader={shaderRender.fragment}
          vertexShader={shaderRender.vertex}
          blending={AdditiveBlending}
          transparent={true}
          depthTest={true}
          depthWrite={true}
        />

        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
};

export default PortScene;
