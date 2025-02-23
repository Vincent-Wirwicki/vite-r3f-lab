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

    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float time2 = mod(mod(uTime*0.5, 1.0) + 1.0, 1.0);

      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
        vec4 offset = texture2D( uOffset, uv );
      vec4 ip = pos;

      float angle = atan(pos.x, pos.y);
      float radius = length(pos.xy);
      vec2 dir = normalize(pos.xy);
      vec2 vel = offset.xy;
      // float zz = exp(-pos.z * (radius  )  );

        vec2 pixel = vec2(1./512., 1./512.);

        //  params
        float fluid_dt = 0.15 * uTime ;
        const float fluid_visco = 0.16;
        const float fluid_decay = 5e-6;
        const float fluid_vorty = 0.3;

        vec2 force = vec2(0.15,0.15);

        // divergeance
        const float k = 0.2;
         float s = k/fluid_dt;
        const float dx = 1.;

        vec4 d = texture2D( uPositions, uv );
        vec4 dR = texture2D( uPositions, uv + vec2(pixel.x,0.) );
        vec4 dL = texture2D( uPositions, uv - vec2(pixel.x,0.) );
        vec4 dT = texture2D( uPositions, uv + vec2(0.,pixel.y) );
        vec4 dB = texture2D( uPositions, uv - vec2(0.,pixel.y) );

        // Delta Data
        vec4 ddx = (dR - dL).xyzw; // delta data on X
        vec4 ddy = (dT - dB).xyzw; // delta data on Y
        float divergence = (ddx.x + ddy.y) * 0.5;
        divergence = (ddx.x + ddy.y) / (2.0 * dx * dx);
       
        // Solving for density with one jacobi iteration 
        float a = 1.0 / (dx * dx);
        d.z = 1.0 / ( -4.0 * a ) * ( divergence - a * (dT.z + dR.z + dB.z + dL.z));


        // Solving for velocity
        vec2 laplacian = dR.xy + dL.xy + dT.xy + dB.xy - 4.0 * d.xy;
        vec2 viscosityForce = fluid_visco * laplacian;

        // Semi-lagrangian advection
        vec2 densityInvariance = s * vec2(ddx.z, ddy.z);
        vec2 was = uv - fluid_dt * d.xy * pixel;
        d.xyw = texture2D(uPositions, was).xyw;
        d.xy += fluid_dt * (viscosityForce - densityInvariance );

        // velocity decay
        d.xy = max(vec2(0.), abs(d.xy) - fluid_decay) * sign(d.xy);

        // vorticity
        d.w = (dB.x - dT.x + dR.y - dL.y); // curl stored in the w channel
        vec2 vorticity = vec2(abs(dT.w) - abs(dB.w), abs(dL.w) - abs(dR.w));
        vorticity *= fluid_vorty/(length(vorticity) + 1e-5) * d.w;
        d.xy += vorticity *2.;

        // Boundary conditions
        d.xy *= smoothstep(0.5, 0.49,abs(uv - 0.5));

        // Pack XY, Z and W data
        d.xy = clamp(d.xy, -0.999, 0.999);
        d.zw = clamp(d.zw,0.,1.);
       
        pos *= divergence  ;


      float waveRadius = pow(1. - radius,  .75) *4.15;
      float wave = sin((radius + uTime*0.15) * 25.  + angle ) * waveRadius ;
      float bounds = smoothstep(0.,1., log(radius));
      // pos.z = wave * waveRadius ;



      gl_FragColor = vec4(pos);


    }

`;

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
