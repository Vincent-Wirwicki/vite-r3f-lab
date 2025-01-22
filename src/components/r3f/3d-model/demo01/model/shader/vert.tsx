export const vert = /* glsl */ `

    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vNoise; 
    varying vec2 vPat1;
    varying vec2 vPat2;
    varying vec2 vPat3;
    varying vec3 vNormal;

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

    float pattern(in vec2 p, in float t, out vec2 q, out vec2 r, out vec2 g)
    {
    	q = vec2(fbm(p), fbm(p + vec2(10, 1.3)));
        r = vec2(fbm(p + 4.0 * q + vec2(t) + vec2(5., 10.)), fbm(p + 4.0 * q + vec2(t) + vec2(9., 2.8)));
        g = vec2(fbm(p + 2.0 * r + vec2(t * 20.0) + vec2(2, 6)), fbm(p + 2.0 * r + vec2(t * 10.0) + vec2(5, 3)));
        return fbm(p + 5.5 * g + vec2(t * 7.0));
    }

    void main(){
        vUv = uv;
        vPos = position;
        float n = fbm(position.xy * 10. + uTime *0.5) * 5. ;
        vec2 p1 = vec2(fbm(position.xy - 0.5), fbm(position.xy  + vec2(10.,8.5) ));
        vec2 p2 = vec2(fbm(p1 + uTime * 0.1 + vec2(10.5, 5.5)), fbm(p1 + vec2(0.75,10.5) + uTime *0.1));
        vec2 p3 = vec2(fbm(p2 + uTime * 0.1 + vec2(-5.5, 15.5)), fbm(p2 + vec2(5.75,10.5) + uTime *0.1));
        
        vNormal = normal;
        vPat1 = p1;
        vPat2 = p2;
        vPat3 = p3;
        vNoise = n;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }

`;
