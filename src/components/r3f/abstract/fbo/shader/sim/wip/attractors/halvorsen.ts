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

// vec2 test (vec2 p, float dt){
//   vec2 target = vec2(0.);
//   float x = p.x;
//   float y = p.y;

//   target.x = y-x*()
// }

    void main(){
      vec2 uv = vUv;
      float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
      float time2 = mod(mod(uTime*0.5, 1.0) + 1.0, 1.0);

      float repeat = sin(time * 2. * PI);
      vec4 pos = texture2D( uPositions, uv );
      vec4 offset = texture2D(uOffset, uv);
      vec3 ip = pos.xyz;
      
      float radius = length(pos.xy);
      float angle = atan(pos.x, pos.y);
      vec2 polar = vec2(angle , radius);

      vec2 vel = normalize(pos.xy) * offset.x;
      vec2 vel2 = vec2(-pos.y, pos.y);

      float dist = distance(pos.xy, vec2(0.));
      float n = snoiseFractal(offset.xyz * 4.);
      vec3 target = attractor(pos.xyz * n , offset.x * 0.15 * n);
      
      pos.xyz += normalize(target) * n ;
    //  pos.xyz += target ;

      // pos.xyz += n;


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
