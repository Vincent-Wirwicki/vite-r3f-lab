export const frag = /*glsl*/ `
    uniform float uTime;
    varying float vNoise;
    varying vec2 vUv;

    void main(){

      vec3 colorA = vec3(0.912,0.429,0.865) * vNoise;
      vec3 colorB =    vec3(0.912,0.877,0.573)* vNoise;
      vec3 color = mix(colorA , colorB  , smoothstep(0.0, .5, vNoise));
       
      gl_FragColor = vec4(color,vNoise);
    }
`;
// color = mix(color, vec3(0, 0, 0.0), smoothstep(0.0, 0.2, vNoise));
// color = mix(color, vec3(0.2, 0, 0.95), smoothstep(0, 0.4, vNoise));
// color = mix(color, vec3(0.6, 0, 0.85), smoothstep(0, 0.6, vNoise));
// color = mix(color, vec3(0.8, 0, 0.8), smoothstep(0, 0.8, vNoise));
// color = mix(color, vec3(0.9, 0, 0.75), smoothstep(0.8, 1, vNoise));
