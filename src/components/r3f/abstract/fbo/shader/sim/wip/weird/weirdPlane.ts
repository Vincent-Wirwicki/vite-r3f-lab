export const fragSim = /* glsl */ `
    uniform sampler2D uPositions;
    uniform sampler2D uOffset;

    uniform float uTime;
    varying vec2 vUv;  
    #define PI 3.141592653
 
    // ---------------------------------------------------------------------------------
    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      vec2 snoise2( vec2 x ){
        float s  = snoise(vec2( x ));
        float s1 = snoise(vec2( x.y - 19.1, x.x + 47.2 ));
        return vec2( s , s1 );
      } 

      vec2 curl( vec2 p ) {
        const float e = .1;
        vec2 dx = vec2( e   , 0.0 );
        vec2 dy = vec2( 0.0 , e   );

        vec2 p_x0 = snoise2( p - dx );
        vec2 p_x1 = snoise2( p + dx );
        vec2 p_y0 = snoise2( p - dy );
        vec2 p_y1 = snoise2( p + dy );

        float x = p_x1.y + p_x0.y;
        float y = p_y1.x - p_y0.x;

        const float divisor = 1.0 / ( 2.0 * e );
        return normalize( vec2(x, y) * divisor );
      }

      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }


    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float repeat = sin(time * 2. * PI);

      vec4 pos = texture2D( uPositions, uv );
      vec4 offset = texture2D(uOffset, uv);

      float freq = map(repeat*repeat, -1.,1.,0.25,.95);
      float tt = map(repeat, 0.,1.,2.,8.);
      vec2 noise = curl(pos.xy * 0.75 + vec2(0.,uTime *0.5) );
      vec2 nor = normalize(noise  );

      float simp = snoise(offset.xy  - uTime *0.1) *.75;
      float ns = normalize(simp );

       pos.z = ns * .75 * smoothstep(0.,1., length(nor.x ))  ;
      pos.x =  simp;

      gl_FragColor = vec4( pos );


    }

`;

//       float verticalMask = smoothstep(0.15, 0.05, pos.y) * smoothstep(0.95, 0.85, pos.y);
//  *                      smoothstep(-0.7, -0.5, pos.y);
//  float maskX = ns * .15 * smoothstep(0.75,0.45, length(nor.x));
//   float maskY = nor.y * .15 * smoothstep(0.52,0.48, abs(pos.y - 0.5));
// Combine the vertical mask with horizontal adjustment
// maskX *= verticalMask;

// float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
// float repeat = sin(time *2. * PI);
// vec2 center = pos.xy * 2. - vec2(4.);

// float diff = length(center - 0.5 ) / 0.5;

// float dist = length(newPos.xy - vec2(0.5)) ;
// float nd = normalize(dist);
// // dist = pow(dist, 0.5);
// float height = (1./diff) * cos(dist *12.  - uTime *0.5)*0.1 ;

// newPos.z -= height  *0.95 ;
// vec2 test3(vec2 p, float t, float md) {
//         float a = 0.49 ;
//         float b = -.16;
//         float c = 2.;
//         float d = 0.5;

//         float x = p.x * p.x - p.y*p.y + a * p.x + b *p.y;
//         float y = 2. * p.x * p.y + c * p.x + d * p.y;

//         return vec2(x, y);
// }
