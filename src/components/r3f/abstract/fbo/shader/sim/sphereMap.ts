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

// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(vec3 p) {

	vec3 s = floor(p + dot(p, vec3(F3)));
	vec3 x = p - s + dot(s, vec3(G3));
	 
	vec3 e = step(vec3(0.0), x - x.yzx);
	vec3 i1 = e*(1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	vec3 x1 = x - i1 + G3;
	vec3 x2 = x - i2 + 2.0*G3;
	vec3 x3 = x - 1.0 + 3.0*G3;
	 
	vec4 w, d;
	 
	w.x = dot(x, x);
	w.y = dot(x1, x1);
	w.z = dot(x2, x2);
	w.w = dot(x3, x3);
	 
	w = max(0.6 - w, 0.0);
	 
	d.x = dot(random3(s), x);
	d.y = dot(random3(s + i1), x1);
	d.z = dot(random3(s + i2), x2);
	d.w = dot(random3(s + 1.0), x3);
	 
	w *= w;
	w *= w;
	d *= w;
	 
	return dot(d, vec4(52.0));
}

float snoiseFractal(vec3 m) {
	return   0.5333333* snoise(m)
				+0.2666667* snoise(2.0*m)
				+0.1333333* snoise(4.0*m)
				+0.0666667* snoise(8.0*m);
}


//	Classic Perlin 3D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}


float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < 4; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


        float map0(float v, float iMin, float iMax ) { return (v-iMin)/(iMax-iMin); }
  
    vec3 attractor(vec3 pos, float dt){
        float a = 1.89;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a*x - 4.*y - 4.*z - y*y;
        target.y = -a*y - 4.*z - 4.*x -z*z ;
        target.z = -a*z -4.*x - 4.*y - x*x ;
        
        return target * dt;
      
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



    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float time2 = mod(mod(uTime*0.5, 1.0) + 1.0, 1.0);

      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
      vec4 offset = texture2D(uOffset, uv);
      vec3 ip = pos.xyz;

      float life = offset.w;

      life -= 0.1;
      if(life < 0.) {
        pos.xyz = ip;
        life = offset.w;
      
      };
      // sphere
      float radius = length(pos.xyz);
      float theta = atan(pos.x, pos.y);
      float phi = acos(pos.z / radius);  
      // clelia


      float noiseTheta = snoiseFractal(vec3(theta + uTime*0.1   , phi *2.  , radius));
      float noisePhi = snoiseFractal(vec3(phi * 2. + uTime*0.1, theta   , radius));
      float noiseZ = snoiseFractal(vec3(theta , phi , uTime * 0.1));
      float bounds = smoothstep(0.15,0.75,theta * 4.);
      float str = 2. ;
      // theta += noiseTheta;
      // phi += noisePhi;

      float x = radius * sin(phi  + noisePhi * str) * cos(theta  + noiseTheta*str)   ;
      float y = radius * sin(phi  + noisePhi * str) * sin(theta  + noiseTheta*str)    ;
      float z = radius * cos(phi  + noisePhi * str)  ;
      vec3 disp = vec3(x,y,z) ;

      // vec3 vel = offset.xyz;
      // vel = disp *0.1;

      pos.xyz = disp  ;
      // pos.z += noiseZ * 0.5;
      // pos.x = radius * sin(phi + noisePhi * str) * cos(theta + noiseTheta*str)  ;
      // pos.y = radius * sin(phi + noisePhi * str) * sin(theta + noiseTheta*str)  ;
      // pos.z = radius * cos(phi + noisePhi * str) ;



      gl_FragColor = vec4( pos);


    }

`;
// -y * x(x*x* + y*y)
//  x-y*(x*x + y*y)
// vec2 flow = vec2(cos(noise *2. * PI ), sin(noise*2. * PI));
// float x = map(flow.x, -1.,1.,-2.,1.);
// float y = map(flow.y, -1.,1.,-2.,1.);
// vec2 test = vec2(x,y);

// pos.xy -= velocity*0.5 * nv  ;
// pos.xy -= velocity*0.1 * smoothstep(0.75,0.25, length(pos.xy));
