export const vert = /* glsl */ `

    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPos;
    varying vec3 vNormal;

    #define PI 3.141592653

    void main(){
        vUv = uv;
        vPos = position;        
        vNormal = normal;
        vec3 newPos = position;
        newPos.z -=  sin(newPos.y * .15)  ;   
        // newPos.z +=  newPos.x * newPos.x *-0.1;      
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.);
    }

`;
