export const vert = /*glsl*/ `
    
    uniform float uTime;
    #define PI 3.141592653

    // Simplex 2D noise 
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

    const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
    float fbm( in vec2 p ){
      float f = 0.0;
      f += 0.5000*snoise( p ); p = m2*p*2.02;
      f += 0.2500*snoise( p ); p = m2*p*2.03;
      f += 0.1250*snoise( p ); p = m2*p*2.01;
      f += 0.0625*snoise( p );

      return f/0.9375;
    }

    float bounceOut(in float t) {
        const float a = 4.0 / 11.0;
        const float b = 8.0 / 11.0;
        const float c = 9.0 / 10.0;

        const float ca = 4356.0 / 361.0;
        const float cb = 35442.0 / 1805.0;
        const float cc = 16061.0 / 1805.0;

        float t2 = t * t;

        return t < a
            ? 7.5625 * t2
            : t < b
                ? 9.075 * t2 - 9.9 * t + 3.4
                : t < c
                    ? ca * t2 - cb * t + cc
                    : 10.8 * t * t - 20.52 * t + 10.72;
    }

    float bounceInOut(in float t) {
        return t < 0.5
            ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
            : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
    }
    
    void main(){
      float size = 10.;
      vec3 newPos = position;
      float time = sin(uTime*1.15);
      float ease = bounceInOut(time);
      float theta = 2. * PI * position.x;
      float phi = acos(mix(1.,10., ease * 1.25)*abs(time)*position.y  ) - PI *0.5;
      float n = fbm(vec2(theta, phi) * ease  ) *0.15;
      newPos.z += n;
      if(newPos.z > 0.5) size = 15.;
      vec3 loop = mix(position, newPos, ease);
      vec4 mvPos = modelViewMatrix * vec4(loop, 1.);
      gl_PointSize = size * (1. / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }`;
