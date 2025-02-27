export const fragSim = /* glsl */ `
    uniform sampler2D uPositions;
    uniform sampler2D uOffset;

    uniform float uTime;
    varying vec2 vUv;  
    #define PI 3.141592653
 
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
//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
// vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
// vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

// float snoise(vec3 v){ 
//   const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
//   const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// // First corner
//   vec3 i  = floor(v + dot(v, C.yyy) );
//   vec3 x0 =   v - i + dot(i, C.xxx) ;

// // Other corners
//   vec3 g = step(x0.yzx, x0.xyz);
//   vec3 l = 1.0 - g;
//   vec3 i1 = min( g.xyz, l.zxy );
//   vec3 i2 = max( g.xyz, l.zxy );

//   //  x0 = x0 - 0. + 0.0 * C 
//   vec3 x1 = x0 - i1 + 1.0 * C.xxx;
//   vec3 x2 = x0 - i2 + 2.0 * C.xxx;
//   vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// // Permutations
//   i = mod(i, 289.0 ); 
//   vec4 p = permute( permute( permute( 
//              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
//            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
//            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// // Gradients
// // ( N*N points uniformly over a square, mapped onto an octahedron.)
//   float n_ = 1.0/7.0; // N=7
//   vec3  ns = n_ * D.wyz - D.xzx;

//   vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

//   vec4 x_ = floor(j * ns.z);
//   vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

//   vec4 x = x_ *ns.x + ns.yyyy;
//   vec4 y = y_ *ns.x + ns.yyyy;
//   vec4 h = 1.0 - abs(x) - abs(y);

//   vec4 b0 = vec4( x.xy, y.xy );
//   vec4 b1 = vec4( x.zw, y.zw );

//   vec4 s0 = floor(b0)*2.0 + 1.0;
//   vec4 s1 = floor(b1)*2.0 + 1.0;
//   vec4 sh = -step(h, vec4(0.0));

//   vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
//   vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

//   vec3 p0 = vec3(a0.xy,h.x);
//   vec3 p1 = vec3(a0.zw,h.y);
//   vec3 p2 = vec3(a1.xy,h.z);
//   vec3 p3 = vec3(a1.zw,h.w);

// //Normalise gradients
//   vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
//   p0 *= norm.x;
//   p1 *= norm.y;
//   p2 *= norm.z;
//   p3 *= norm.w;

// // Mix final noise value
//   vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
//   m = m * m;
//   return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
//                                 dot(p2,x2), dot(p3,x3) ) );
// }



//       vec3 snoise3( vec3 x ){
//     float s  = snoise(vec3( x ));
//     float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
//     float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
//     return vec3( s , s1 , s2 );
// }

// vec3 curl( vec3 p ){
//     const float e = .1;
//     vec3 dx = vec3( e   , 0.0 , 0.0 );
//     vec3 dy = vec3( 0.0 , e   , 0.0 );
//     vec3 dz = vec3( 0.0 , 0.0 , e   );

//     vec3 p_x0 = snoise3( p - dx );
//     vec3 p_x1 = snoise3( p + dx );
//     vec3 p_y0 = snoise3( p - dy );
//     vec3 p_y1 = snoise3( p + dy );
//     vec3 p_z0 = snoise3( p - dz );
//     vec3 p_z1 = snoise3( p + dz );

//     float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
//     float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
//     float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

//     const float divisor = 1.0 / ( 2.0 * e );
//     #ifndef CURL_UNNORMALIZED
//     return normalize( vec3( x , y , z ) * divisor );
//     #else
//     return vec3( x , y , z ) * divisor;
//     #endif
// }



// sin(dt * 2. * PI) * cos(dt * 2. * PI)

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

vec2 vortex (vec2 p){
  return vec2(-p.y, p.x) / dot(p,p);
}

vec3 twist(vec3 p, float twistAmount){
    float t = (length(p.x) + p.y) * twistAmount;
    p.xy *= mat2( cos(t), -sin(t), sin(t), cos(t) );
    return p; 
}

vec3 sdgCircle( in vec2 p, in float r ) 
{
    float d = length(p);
    return vec3( d-r, p/d );
}

mat2 rotate2d(const in float r){
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}

vec2 rotate(in vec2 v, in float r, in vec2 c) {
    return rotate2d(r) * (v - c) + c;
}

float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

vec4 latticeBoltzmannPrevPosSampler(sampler2D tex, vec2 st, vec2 pixel) { 
    vec2 offset = texture2D(tex, st).xy;
    return texture2D(tex, st - offset * pixel); 
}


// https://www.shadertoy.com/view/XsXyD2
#define MOD3 vec3(.1031,.11369,.13787)
    vec3 hash33(vec3 p3)
    {
        p3 = fract(p3 * MOD3);
        p3 += dot(p3, p3.yxz+19.19);
        return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }


    float simplex_noise(vec3 p)
    {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;

        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

        // thx nikita: https://www.shadertoy.com/view/XsX3zB
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);

        vec3 d1 = d0 - (i1 - 1.0 * K2);
        vec3 d2 = d0 - (i2 - 2.0 * K2);
        vec3 d3 = d0 - (1.0 - 3.0 * K2);

        vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
        vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));

        return dot(vec4(31.316), n);
    }

    float field(in vec2 p)
    {
        float f0 = simplex_noise(vec3(p,uTime * 0.2)) * 0.5 + 0.5;
        float f1 = simplex_noise(vec3(p * 2.3,uTime * 0.2)) * 0.5 + 0.5;
        return f0 * 0.8 + f1 * 0.2;
    }
// -------------------

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@gmail.com)
// Version: 2024-11-07
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/stegu/webgl-noise
//

mat2 rot2d(float angle){return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));}
float r(float a, float b){return fract(sin(dot(vec2(a,b),vec2(12.9898,78.233)))*43758.5453);}
float h(float a){return fract(sin(dot(a,dot(12.9898,78.233)))*43758.5453);}

float noise(vec3 x){
    vec3 p  = floor(x);
    vec3 f  = fract(x);
    f       = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( h(n+0.0), h(n+1.0),f.x),
                   mix( h(n+57.0), h(n+58.0),f.x),f.y),
               mix(mix( h(n+113.0), h(n+114.0),f.x),
                   mix( h(n+170.0), h(n+171.0),f.x),f.y),f.z);
}

// https://iquilezles.org/articles/morenoise
// http://www.pouet.net/topic.php?post=401468
vec3 dnoise2f(vec2 p){
    float i = floor(p.x), j = floor(p.y);
    float u = p.x-i, v = p.y-j;
    float du = 30.*u*u*(u*(u-2.)+1.);
    float dv = 30.*v*v*(v*(v-2.)+1.);
    u=u*u*u*(u*(u*6.-15.)+10.);
    v=v*v*v*(v*(v*6.-15.)+10.);
    float a = r(i,     j    );
    float b = r(i+1.0, j    );
    float c = r(i,     j+1.0);
    float d = r(i+1.0, j+1.0);
    float k0 = a;
    float k1 = b-a;
    float k2 = c-a;
    float k3 = a-b-c+d;
    return vec3(k0 + k1*u + k2*v + k3*u*v,
                du*(k1 + k3*v),
                dv*(k2 + k3*u));
}

float fbm(vec2 uv){               
    vec2 p = uv;
	float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for(int i = 0; i < 28; ++i){        
        vec3 n = dnoise2f(uv);
        dx += n.y;
        dz += n.z;
        f += w * n.x / (1.0 + dx*dx + dz*dz);
        w *= 0.86;
        uv *= vec2(1.16);
        uv *= rot2d(1.25*noise(vec3(p*0.1, 0.12))+
                    0.75*noise(vec3(p*0.1, 0.20)));
    }
    return f;
}

float fbmLow(vec2 uv){
    float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for(int i = 0; i < 4; ++i){        
        vec3 n = dnoise2f(uv);
        dx += n.y;
        dz += n.z;
        f += w * n.x / (1.0 + dx*dx + dz*dz);
        w *= 0.75;
        uv *= vec2(1.5);
    }
    return f;
}
    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float time2 = mod(mod(uTime*0.25, 1.0) + 1.0, 1.0);

      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
      vec4 offset = texture2D( uOffset, uv );
      vec4 ip = pos;

      float angle = atan(pos.x, pos.y);
      float radius = length(pos.xy);
      vec2 dir = normalize(pos.xy);
      vec2 vel = offset.xy;
      
      //  1----------
      // vec3 nc = curl(vec3(pos.x*.75,pos.y*.5, uTime*0.1))*5.   ;
      // float an = atan(nc.x, nc.y);
      // vel *= nc.xy ;
      // pos.x += vel.x * cos(an * nc.z ) * 0.075   ;
      // pos.y += vel.y * sin(an * nc.z) * 0.085  ;
      // --------------
    
    // 2---------------
    vec2 eps = vec2(0.0001,0);
    
    float dx = (field(pos.xy - eps.xy) - field(pos.xy + eps.xy))/(2.0 * eps.x);
    float dy = (field(pos.xy - eps.yx) - field(pos.xy + eps.yx))/(2.0 * eps.x);
    
    vec2 v = vec2(dy,-dx) * 5.;

      vel *= v * dir *0.1;
      pos.x += vel.x * 0.4   ;
      pos.y += vel.y * 0.4 ;
      //---------------------------

      // vec3 c =curl(pos.x * .5, pos.y * .5, pos.z * .5) * .75;
    //   float fb = fbm(pos.xy + fbmLow(pos.xy) );
    //   float fb2 = fbm(vec2(pos.xy + vec2(5.2,7.8) + vec2(uTime*0.01)) + fbmLow(vec2(pos.xy + vec2(10.5,4.2) + vec2(uTime*0.01))));
    //   // fb = fb *fb*fb;
    //   // fb2 = fb2 * fb2 * fb2;
    //   vec3 color = vec3(0.75,0.15,0.89);
      
      vel *= vec2(fb2);
      pos.xy += mix(pos.xy, vec2(0.01) , fb * fb * 0.1 );
      pos.xy += mix(pos.xy, pos.xy + vec2(.005), smoothstep(0.05,0., fb2) * smoothstep(0.,0.05, fb2));
      pos.x += vel.x *0.01;
      pos.y += vel.y *0.01;

      pos.xyz = mod(pos.xyz, 2.);
      gl_FragColor = vec4(pos);


    }

`;

// float waveRadius = pow(1. - radius,  .75) *4.15;
// float wave = sin((radius * 0.5 + uTime*0.15) * 25.  + angle ) * waveRadius ;
// float bounds = smoothstep(0.,1., log(radius));
// 2 render
// float freq = map(offset.y - time,-1.,1.,2.,.5);
// // vec2 n = curl(vec2(0.5 * cos(pos.x),0.5 * sin(pos.y)) + (dist + uTime *0.1));
// float n = snoiseFractal(vec3(pos.xy * freq, offset.x - time2 )  ) * smoothstep(0.95,0.75,dist) ;
// pos.xy -= normalize(pos.xy)  * n * smoothstep(0.95,0.15, dist-n ); ;
// pos.z -= .15 * n * smoothstep(0.15,0.75,dist);
// 1 render
// vec2 flow = vec2(cos(noise *2. * PI ), sin(noise*2. * PI));
// float x = map(flow.x, -1.,1.,-2.,1.);
// float y = map(flow.y, -1.,1.,-2.,1.);
// vec2 test = vec2(x,y);

// pos.xy -= velocity*0.5 * nv  ;
// pos.xy -= velocity*0.1 * smoothstep(0.75,0.25, length(pos.xy));
