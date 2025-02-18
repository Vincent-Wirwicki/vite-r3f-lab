export const vert = /* glsl */ `

    uniform float uTime;
    varying vec2 vScreenSpace;
    varying vec3 vNormal;
    varying float vFresnel;
    varying vec2 vUv;
    #define PI 3.141592653

    void main(){
      // vNormal = normal;
      vNormal = normalize(mat3(modelMatrix) *normal) ;

      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.);
      vec3 viewDir= normalize(worldPos.xyz - cameraPosition);
      vFresnel =1. - dot(normal, -viewDir );

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      vScreenSpace = gl_Position.xy / gl_Position.z;

    }

`;
