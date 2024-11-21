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
      #ifndef CURL_UNNORMALIZED
      return normalize( vec2(x, y) * divisor );
      #else
      return vec2(x, y) * divisor;
      #endif
    }
    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    void main(){
      float size = 15.;
      vec3 p0 = position;
      float time = mod(mod(uTime *0.45, 1.0) + 1.0, 1.0);
      float m1 = map(sin(time  * PI ),0.,1.,0.,1.);
      float phi = acos(1. - 2. * position.y);
      float theta = 8. * PI * position.x;

      vec2 polar = vec2(cos(theta) * sin(phi), sin(phi) * sin(theta));
      vec2 polar2 = vec2(phi, theta);
      float angle = atan(cos(polar.x), sin(polar.y));

      
      
      
      vec2 noise = curl( p0.xy * 4. * m1   );
      float mc = map(noise.x  ,-1.,1.,.075,.15);

      p0.z -= mc;
      size += abs( 1. - p0.z *5. + 5.*mc   ) ;


      // p0.x = cos(theta) * sin(phi);
      // p0.y = sin(phi) * sin(theta);
      // p0.z = cos(phi);


      vec4 mvPos = modelViewMatrix * vec4(p0 , 1.);
      gl_PointSize = size * (1. / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }`;
