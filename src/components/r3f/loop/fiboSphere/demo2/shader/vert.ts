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

    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    vec3 simpleRotateY(vec3 position, float angle) {
        float cosA = cos(angle);
        float sinA = sin(angle);
        
        float newX = position.x * cosA - position.z * sinA;
        float newZ = position.x * sinA + position.z * cosA;
        
        return vec3(newX, position.y, newZ);
    }

    void main(){
      float size = 15.;
      vec3 p0 = position;
      float time = mod(mod(uTime *0.45, 1.0) + 1.0, 1.0);
      float m1 = map(sin(time  * PI ),0.,1.,0.,1.);
      float rotAngle = map(sin(time  * 2. * PI ),0.,4.,-1.5,1.75);
      float n = fbm(position.xy *2. ) * m1 * m1;
      float mn = map(n * PI * 2., -1.,1.,1.,2.*PI);
      float ms = map(sin(n * PI * 2.), -1.,1.,0.5,2.5);

    
      float phi;
      float th;

      

      for(float i =0.; i<10.; i++){
        phi = acos( mix((i + 0.5) * 0.5, 20., mn) * position.y  )     ;
        th = (2. * PI * position.x)  * (i + 0.5 ) *0.5   ;
        // th = ( 1. - .5* i * PI * position.x * (mn - i *.5 + 0.5 )   )  ;
        size = (4. * (i+.5)) * (ms  ) ;

      }
      vec3 p1 = vec3(cos(th) * sin(phi),sin(th) * sin(phi), cos(phi) )   ;
      vec3 loop = mix(p0, p1, m1 *m1 *m1);
      loop = simpleRotateY(loop, rotAngle);
      vec4 mvPos = modelViewMatrix * vec4(loop , 1.);
      gl_PointSize = size * (1. / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }`;
