export const vert = /*glsl*/ `
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

    const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
    float fbm( in vec2 p ){
      float f = 0.0;
      f += 0.5000*snoise( p ); p = m2*p*2.02;
      f += 0.2500*snoise( p ); p = m2*p*2.03;
      f += 0.1250*snoise( p ); p = m2*p*2.01;
      f += 0.0625*snoise( p );

      return f/0.9375;
    }

    float pattern(vec2 p, float t){
        vec2 a = vec2(fbm(p), fbm(p + vec2(10.,1.5)));
        vec2 b = vec2(fbm(p + a * 2. + vec2(t) + vec2(2.7,7.)), vec2(fbm(p + a * 2. + vec2(t) + vec2(7.,1.8))));
        vec2 c = vec2(fbm(p + b* 2. + vec2(t * 20.)+ vec2(2.,5.7)), vec2(fbm(p + b *2. + vec2(t * 10.) + vec2(6.,1.5))));
        return fbm(p + 2. * c + vec2(-t * 4.));
    }
    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    #define PI 3.141592653
    uniform float uTime;
    varying float vNoise;
    varying vec2 vUv;
    varying vec3 vPos;

    void main(){
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    } `;
