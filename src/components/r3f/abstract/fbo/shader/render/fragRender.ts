export const fragRender = /* glsl */ `
    varying vec3 vPos;
    varying vec2 vUv;
    varying float vDiff;

float viewZ2depth( const in float viewZ, const in float near, const in float far ) {

    return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
    
}

    void main(){
 
      float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
      float alpha = smoothstep(0.5,0.65,dist);
          // float dist = length(vDistance - vec2(0.5));
      vec3 color = vec3(1.000, 0.153, 0.008);

          // vec3 purple = vec3(0.063, 0.012, 0.243);
        //   purple attractor vec3(0.114, 0.086, 0.220)
// vec3(0.251, 0.220, 0.212) light white
      gl_FragColor = vec4(vec3(0.18),1.);

    }

`;
