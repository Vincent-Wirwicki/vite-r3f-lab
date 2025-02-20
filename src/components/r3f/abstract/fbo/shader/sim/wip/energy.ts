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
//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
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


    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float time2 = mod(mod(uTime*0.5, 1.0) + 1.0, 1.0);

      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
      float angle = atan(pos.x, pos.y);
      float dist = length(pos.xy);
      // offset = params x/y speed y/z life and decay
      vec4 offset = texture2D(uOffset, uv);
      vec3 ip = pos.xyz;

      float life = offset.z;
      float decay = offset.w;
      float angle2 = atan(offset.x, offset.y);
      // pos.x += cos(offset.x)* smoothstep(0.15,0., dist);
      // pos.y += sin(offset.y)* smoothstep(0.15,0., dist);
      // to polar
      vec2 polar = vec2(angle , dist);
      float move = map(sin(time * 2. * PI),-1.,1.,.5,0.95);
      float freq = map(offset.y - time,-1.,1.,2.,.5);
      // vec2 n = curl(vec2(0.5 * cos(pos.x),0.5 * sin(pos.y)) + (dist + uTime *0.1));
      float n = snoiseFractal(vec3(vec2(sin(angle*  2. * PI + time2) , dist ), uTime *0.5    )  )  ;
      // float n = snoiseFractal(vec3(vec2(angle * 2., dist * dist ), time *0.5 + offset.x    )  )  ;

      float bounds = smoothstep(0.,0.15,dist );
      pos.x = dist * cos(angle + n ) * bounds;
      pos.y = dist * sin(angle + n ) * bounds;
      // pos.z = n *0.15;
      // pos.xy -= normalize(pos.xy)  * n * smoothstep(0.95,0.15, dist-n ); ;
      // pos.z -= .15 * n * smoothstep(0.15,0.75,dist);


      gl_FragColor = vec4( pos);


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
