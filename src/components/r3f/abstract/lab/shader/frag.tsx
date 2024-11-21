export const frag = /* glsl */ `
    uniform float uTime;

    void main(){

      float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
      float alpha = smoothstep(0.5,0.65,dist);
      gl_FragColor = vec4(1.,1.,1.,alpha);
    }

`;
