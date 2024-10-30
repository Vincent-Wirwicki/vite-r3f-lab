import { useAspect, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import { frag } from "../shader/frag";
import { vert } from "../shader/vert";

const ImagePlane = ({
  images,
  active,
  next,
  update,
  isAnim,
}: {
  images: string[];
  active: number;
  next: number;
  update: () => void;
  isAnim: boolean;
}) => {
  const matRef = useRef<ShaderMaterial>(null!);
  const textures = useTexture(images);
  const dispTexture = useTexture("/images/dispTexture/Turbulence.png");
  const ratioImg = useAspect(
    textures[0].source.data.naturalWidth,
    textures[0].source.data.naturalHeight,
    1
  );
  const uniforms = useRef({
    uCurrTex: { value: null },
    uNextTex: { value: null },
    uDispTex: { value: dispTexture },
    uDispFac: { value: 0.0 },
  });

  useEffect(() => {
    matRef.current.uniforms.uCurrTex.value = textures[active];
    matRef.current.uniforms.uNextTex.value = textures[next];
  }, [active, next, textures]);

  useFrame(() => {
    if (isAnim) {
      matRef.current.uniforms.uDispFac.value += 0.02;
      if (matRef.current.uniforms.uDispFac.value >= 1) {
        uniforms.current.uDispFac.value = 1;
        update();
        matRef.current.uniforms.uDispFac.value = 0;
        matRef.current.uniforms.uCurrTex.value = textures[next];
      }
    }
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
