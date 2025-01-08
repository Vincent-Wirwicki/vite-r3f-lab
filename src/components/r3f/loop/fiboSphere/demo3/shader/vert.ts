export const vert = /*glsl*/ `
      
      uniform float uTime;
      #define PI 3.141592653


      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
      vec3 simpleRotateY(vec3 position, float angle) {
          float cosA = cos(angle);
          float sinA = sin(angle);

          float newX = position.x * cosA - position.z * sinA;
          float newZ = position.x * sinA + position.z * cosA;

          return vec3(newX, position.y, newZ);
      }

      float circularIn(in float t) { return 1.0 - sqrt(1.0 - t * t); }

      void main(){
        float size = 10.;
        vec3 p0 = position;
        float dist = length(position.xy) - 0.5;

        float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
        float t = sin(time * 2. * PI);

        float delta = map(t * t * t, 4.,6., 2.15, 3.85);
        float phi = map( acos( 1.005 * (1. - 2. * p0.y  )) * delta, -4.,4., -2., 8. );          
        p0.y /= phi   ;

        float rotAngle = map(t * phi * 0.25 ,-3.,3.,-6., 4.);
        p0 = simpleRotateY(p0, rotAngle);

        float zoom = map(t * t *t,-1.,1., .85,-0.25);
        p0.y += zoom;

        float scale = map(phi, -1.,1.,3.,1.5);

        size *= mix(1.75,2.15,phi *t);

        vec4 mvPos = modelViewMatrix * vec4(p0 , 1.);
        gl_PointSize = size * (1. / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }`;
