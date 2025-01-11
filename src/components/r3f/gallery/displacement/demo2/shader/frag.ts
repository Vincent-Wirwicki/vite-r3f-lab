export const frag = /* glsl */ `

    uniform sampler2D uCurrTex;
    uniform sampler2D uNextTex;
    uniform sampler2D uDispTex;
    uniform float uProgress;
    uniform float uTime;
    uniform float uDir;

    varying vec2 vUv;

    void main(){
        float pixelSize = 10.;
        vec2 pixel = floor(vUv * pixelSize) / pixelSize;
        
        // experiment math here to mix uv
        vec2 distortion1 = vec2(vUv.x + uProgress * pixel.x * uDir, vUv.y   );
        vec2 distortion2 = vec2(vUv.x - ( 1. - uProgress) * pixel.x * uDir , vUv.y );

        vec4 current = texture2D(uCurrTex, distortion1);
        vec4 next = texture2D(uNextTex, distortion2);
        
        vec4 render = mix(current, next,uProgress  );

        // gl_FragColor = vec4(vec3(uDispFac), 1.);
        gl_FragColor = vec4(render);

    }

`;
