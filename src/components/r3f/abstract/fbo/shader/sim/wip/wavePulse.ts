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

float smoothMod(float axis, float amp, float rad) {
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
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

// float z = log(  abs(sin((radius -0.5) * 2. * c - time *2. * PI ) * 2. )) *0.075 ;

      float waveRadius = pow(1. - radius,  .75) *4.15;
      float wave = sin((radius + uTime*0.15) * 25.  + angle ) * waveRadius ;
      float bounds = smoothstep(0.,1., log(radius));
      // pos.z = wave * waveRadius ;


    //  ----- NO LOOP 
    //    float fz = exp(repeat * 0.2);
    //    float fr1 = pow(radius / fz , .1 - fz);
    //    float fr2 = pow(radius * fz * fz , 2. - fz );
       
    //   float z1 = log(abs(sin((1. - radius) * 8. + uTime *2. * PI *0.25 ) )) *.15;
    //   float reset = map(radius,  0.,1., PI, PI *0.5);
    //   float n = snoiseFractal(vec3( angle * 8. , radius * reset  , 1. ) ) *0.15;
    //   // float z2 = exp(-pos.z / pow(radius/zoomF , 1.15  ) * z1 + n    ) *.5;
    //   float z2 = exp(-pos.z / radius * z1 + n    ) *.5;

      
    //   pos.z = z2 * fr2 ;


    //   pos.x = (radius) * cos(angle + uTime *0.25) ;
    //   pos.y = (radius) * sin(angle + uTime *0.25) ;

    // ----LOOPED VERSION
    float t1,t2;
      for(int i = 0; i<4; i++){
        float fl =  exp(repeat   * 0.2 * float(i) );
        float t1 = pow((radius*float(i))  , 1. / (fl * 2.  )) *1.;
        float r = pow(0.8, fl);

      float z1 = log(abs(sin((1. - (radius )) * 8.  + uTime *2. * PI *0.3    ) )) *.25;
        float reset = map(radius,  0.,1., PI, PI *0.5);
        float n = snoiseFractal(vec3( angle * 8. , radius + r , 1. ) ) *0.15;
        // float z2 = exp(-pos.z / pow(radius/zoomF , 1.15  ) * z1 + n    ) *.5;
        float z2 = exp((-pos.z )  / (radius )  * z1 + n     ) *.25;
        pos.z = z2 * t1 *fl ;
        pos.x = (radius) * cos(angle - uTime *0.3 + r) ;
        pos.y = (radius) * sin(angle - uTime *0.3 + r) ;
      }

      // float z1 = log(abs(sin((1. - radius ) * 8.  - time *2. * PI   ) )) *.085;
      // float z1 = log((radius - 0.5)   ) *.25;
      // float n = snoise(vec2(z1, z1)) *0.1;
      // float z2 = exp(-pos.z /  radius    )*0.075 ;
      // pos.z = z1  ;

      // pos.y -= length(z1 * radius ) * cos(angle * n ) *0.01  ;
      // pos.x -= length(z1 * radius ) * sin(angle * n ) *0.01 ;

      // float speed = offset.x * normalize(z1)*0.1 ;
      // pos.x = radius * cos(angle  + uTime * 0.5  )   ;
      // pos.y = radius * sin(angle  + uTime * 0.5 )  ;

    //---- noise move to center start----------------------------------------------------------------
      // float t1,t2;
      // for(int i = 0; i<4; i++){
      //   float fl =  exp(repeat   * 0.2 * float(i) );
      //   float t1 = pow((radius*float(i))  , 1. / (fl * 2.  )) ;
      //   float r = pow(0.8, fl);
      //   float n = snoiseFractal(vec3( angle *12. , radius  , fl   ) ) *0.9 ;

      //   float z1 = log(abs(sin((1. - (radius + n )) * 2.  - uTime *2. * PI *0.3    ) )) *.45;
      //   // float z2 = exp(-pos.z / pow(radius/zoomF , 1.15  ) * z1 + n    ) *.5;
      //   float amp = map(fl, -1.,1.,0.15,0.3);
      //   float z2 = exp((-pos.z  )  / (radius )  * z1 +n*0.5    ) *0.3;
      //   pos.z = z2 * t1  ;

      //   pos.x = (radius) * cos(angle - uTime *0.3 ) ;
      //   pos.y = (radius) * sin(angle - uTime *0.3 ) ;
      // }
    //---- noise move to center end----------------------------------------------------------------

      // --- SINGLE WAVE start ---------------------------------------------------------------------
      // for(int i = 0; i<4; i++){
      //   float r = pow(0.8, repeat * float(i) );

      //   float t1 = pow((radius*float(i)), .06 / r ) ;
      //   float n = snoiseFractal(vec3( angle *12., radius * (.1 / r) , 1.) ) *.5 ;

      //   float z1 = log(abs(sin(((radius  + n)) * 4. - uTime *2. * PI *0.3))) *.45;
      //   float z2 = exp(-pos.z / radius * z1 ) *.25;
      //   pos.z = z2 * t1;

      //   pos.x = radius * cos(angle + uTime * .3) ;
      //   pos.y = radius * sin(angle + uTime * .3) ;
      // }
      // --- SINGLE WAVE end ---------------------------------------------------------------------

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
