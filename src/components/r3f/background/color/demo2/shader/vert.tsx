export const vert = /*glsl*/ `

    #define PI 3.141592653
    uniform float uTime;
    varying float vNoise;
    varying vec2 vUv;
    varying vec3 vPos;

    void main(){
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    } `;
