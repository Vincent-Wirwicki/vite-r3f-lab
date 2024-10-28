import { useAspect, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import { frag } from "../shader/frag";
import { vert } from "../shader/vert";

const ImagePlane = ({
  tex,
  active,
  next,
  update,
  isAnim,
}: {
  tex: string[];
  active: number;
  next: number;
  update: () => void;
  isAnim: boolean;
}) => {
  const matRef = useRef<ShaderMaterial>(null!);
  const ratio = useAspect(window.innerWidth, window.innerHeight, 1);
  const textures = useTexture(tex);
  const dispTexture = useTexture("/images/dispTexture/Perlin.png");
  const uniforms = useRef({
    uCurrTex: { value: null },
    uNextTex: { value: null },
    uDispTex: { value: null },
    uDispFac: { value: 0.0 },
  });

  useEffect(() => {
    matRef.current.uniforms.uDispTex.value = dispTexture;
    matRef.current.uniforms.uCurrTex.value = textures[active];
    matRef.current.uniforms.uNextTex.value = textures[next];
  }, [active, next, dispTexture, textures]);

  useFrame(() => {
    if (isAnim) {
      matRef.current.uniforms.uDispFac.value += 0.02;
      if (matRef.current.uniforms.uDispFac.value >= 1) {
        update();
        matRef.current.uniforms.uDispFac.value = 0;
        matRef.current.uniforms.uCurrTex = matRef.current.uniforms.uNextTex;
      }
    }
  });
  return (
    <mesh scale={new Vector3(ratio[0], ratio[1], 0)}>
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
