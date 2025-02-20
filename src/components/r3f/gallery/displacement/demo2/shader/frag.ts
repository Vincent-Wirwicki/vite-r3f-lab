export const frag = /* glsl */ `

    uniform sampler2D uCurrTex;
    uniform sampler2D uNextTex;
    uniform sampler2D uDispTex;
    uniform float uProgress;
    uniform float uTime;
    uniform float uDir;

    varying vec2 vUv;
    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    void main(){
        float pixelSize = 5.;
        float pixProg = map(uProgress, 20.,1.,0.,1.);
        pixProg = floor(pixProg * pixelSize) / pixelSize;
        vec2 pixel = floor(vUv * pixelSize ) / pixelSize ;
        float s = floor(mix(11., 5.,pixProg));

        vec4 dispTex = texture2D(uDispTex, vUv);
        vec2 scaleUv = (vUv - 0.5) * 4.2 + 0.5;

        // experiment math here to mix uv
        float dispX =  uDir * vUv.y * s * dispTex.x;
        float dispY =  uDir * pixel.x * dispTex.x * 2.;

        vec2 uv1 = vec2(vUv.x + dispX * uProgress, vUv.y );
        vec2 uv2 = vec2(vUv.x - dispX * (1. - uProgress), vUv.y);

        vec4 current = texture2D(uCurrTex, uv1);
        vec4 next = texture2D(uNextTex, uv2);
        
        vec4 render = mix(current, next,uProgress  );

        // gl_FragColor = vec4(vec3(uDispFac), 1.);
        gl_FragColor = vec4(render);

    }

`;
