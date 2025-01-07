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
        return normalize( vec2(x, y) * divisor );
      }

      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
    vec3 simpleRotateY(vec3 position, float angle) {
        float cosA = cos(angle);
        float sinA = sin(angle);
        
        float newX = position.x * cosA - position.z * sinA;
        float newZ = position.x * sinA + position.z * cosA;
        
        return vec3(newX, position.y, newZ);
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
float circularIn(in float t) { return 1.0 - sqrt(1.0 - t * t); }

      void main(){
        float size = 10.;
        vec3 p0 = position;
        float dist = length(position.xy) - 0.5;

        float time = mod(mod(uTime *0.1, 1.0) + 1.0, 1.0);
        float t = sin(time * 2. * PI);

        float delta = map(circularIn(t), 2.,3., .5, 1.5);
        float phi = map( acos( 1.005 * (1. - 2. * p0.y  )) * delta, -1., 1., 2., 8. );          
        p0.y /= phi ;

        // float rotAngle = map(t,-1.,1.,2., -2.);
        float rotAngle = map(t* phi,-1.,1.,.75, -.75);

        p0 = simpleRotateY(p0, rotAngle);
        
        float zoom = map(t * phi  , -1.,1., -.25, .15);
        p0.y +=   zoom   ;

        // p0.y *= zoom;
        // size *= ((1. - phi *0.5   ) * rotAngle * 0.5  ) + 2.  ;

        vec4 mvPos = modelViewMatrix * vec4(p0 , 1.);
        gl_PointSize = size * (1. / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }`;
