import { useAspect, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import { frag } from "../shader/frag";
import { vert } from "../shader/vert";
import { MotionValue } from "motion/react";

const ImagePlane = ({
  images,
  active,
  next,
  progress,
  isFinish,
  direction,
}: {
  images: string[];
  active: number;
  next: number;
  progress: MotionValue<number>;
  isFinish: boolean;
  direction: number;
}) => {
  const matRef = useRef<ShaderMaterial>(null!);
  const textures = useTexture(images);
  const dispTexture = useTexture("/images/dispTexture/Perlin.png");
  const ratioImg = useAspect(
    textures[0].source.data.naturalWidth,
    textures[0].source.data.naturalHeight,
    1
  );
  const uniforms = useRef({
    uCurrTex: { value: textures[active] },
    uNextTex: { value: textures[next] },
    uDispTex: { value: dispTexture },
    uProgress: { value: 0.0 },
    uDir: { value: 1. },
    uTime: { value: 0 },
  });

  useEffect(() => {
    matRef.current.uniforms.uNextTex.value = textures[next];
    matRef.current.uniforms.uDir.value = direction;
  }, [active, next, textures, direction]);

  useFrame(({ clock }) => {
    uniforms.current.uProgress.value = progress.get();
    uniforms.current.uTime.value = clock.getElapsedTime();
    if (isFinish) matRef.current.uniforms.uCurrTex.value = textures[next];
  });

  return (
    <mesh scale={new Vector3(ratioImg[0], ratioImg[1], 0)}>
      <planeGeometry args={[1, 1, 10, 10]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms.current}
        fragmentShader={frag}
        vertexShader={vert}
      />
    </mesh>
  );
};

export default ImagePlane;
