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
        const float e = .01;
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
vec2 srandom2(in vec2 st) {
    const vec2 k = vec2(.3183099, .3678794);
    st = st * k + k.yx;
    return -1. + 2. * fract(16. * k * fract(st.x * st.y * (st.x + st.y)));
}
      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec3 noised (in vec2 p) {
    // grid
    vec2 i = floor( p );
    vec2 f = fract( p );

    // quintic interpolation
    vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    vec2 du = 30. * f * f * (f * (f - 2.) + 1.);

    vec2 ga = srandom2(i + vec2(0., 0.));
    vec2 gb = srandom2(i + vec2(1., 0.));
    vec2 gc = srandom2(i + vec2(0., 1.));
    vec2 gd = srandom2(i + vec2(1., 1.));

    float va = dot(ga, f - vec2(0., 0.));
    float vb = dot(gb, f - vec2(1., 0.));
    float vc = dot(gc, f - vec2(0., 1.));
    float vd = dot(gd, f - vec2(1., 1.));

    return vec3( va + u.x*(vb-va) + u.y*(vc-va) + u.x*u.y*(va-vb-vc+vd),   // value
                ga + u.x*(gb-ga) + u.y*(gc-ga) + u.x*u.y*(ga-gb-gc+gd) +  // derivatives
                du * (u.yx*(va-vb-vc+vd) + vec2(vb,vc) - va));
}

const mat2 m = mat2(0.8,-0.6,0.6,0.8);

float terrain( in vec2 p )
{
    float a = 0.0;
    float b = 1.0;
    vec2  d = vec2(0.0,0.0);
    for( int i=0; i<15; i++ )
    {
        vec3 n=noised(p);
        d += n.yz;
        a += b*n.x/(1.0+dot(d,d));
        b *= 0.5;
        p = m*p*2.0;
    }
    return a;
}
      
    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
      vec4 offset = texture2D(uOffset, uv);
      vec3 ip = pos.xyz;


      
      // vec2 noiseDer = curl(pos.xy);
      float fr = map(repeat, -1.,1.,4.,8.);
      // vec2 gradient = normalize(noiseDer.yz);
      float tern = terrain(pos.xy - vec2( uTime*0.1, 0.));
      vec2 velocity = offset.xy;
      velocity.x *= tern * 0.1;
      // velocity.y *= noiseDer.x * 0.01;
      pos.y += velocity.x;
      pos.z = abs(tern) * smoothstep(.65,.75, abs(pos.y)) ;
      if(pos.y >= 0.3 || pos.y <= -.3) pos.y = ip.y;
      if(pos.x >= 0.5) pos.x = ip.x;
      // pos.z -= velocity.y;
// pos.z = trn * offset.x ;  // Move in curl direction
      // constrain
      // pos.xy *= smoothstep(0.5, 0.49,abs(uv - 0.5));
      gl_FragColor = vec4( pos);


    }

`;

//  noise to the center 1 Render
// float n = snoiseFractal(vec3(pos.xy * freq, uTime )  ) * smoothstep(0.95,0.,dist) ;
// pos.xy -= normalize(pos.xy) * smoothstep(0.95,0., dist -n); ;
// pos.z = n * smoothstep(0.95,0.,dist);
