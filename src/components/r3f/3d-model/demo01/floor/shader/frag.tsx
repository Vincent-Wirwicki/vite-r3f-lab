export const frag = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uDiffuse;
    varying vec2 vUv;
    varying vec3 vPos;
    varying vec3 vNormal;

    void main(){
    
      vec2 newUv = vUv;
      vec3 newPos = vPos;
      vec3 newNormal = vNormal;

      newPos.y -= uTime *0.5;
      float check = mod(floor(newPos.x)  + floor(newPos.y) , 2.0);

      vec2 f = fract(newPos.xy); // Fractional part of newPos
      
      vec2 distToEdge = min(f, 1.0 - f); // Distance to nearest edge in both x and y 
      float aaWidth = 0.01;
      float edgeBlend = smoothstep(0.0, aaWidth, distToEdge.x) * smoothstep(0.0, aaWidth, distToEdge.y);
      
      vec3 col = mix(vec3(0.),vec3(1.),check * edgeBlend);

      gl_FragColor = vec4(col,1.);
    }

`;

// basic grid
// newPos.y += uTime *0.2;
// float check = mod(floor(newPos.x)  + floor(newPos.y) , 2.0);
// vec3 gridCol = mix(vec3(0.),vec3(1.),check);
