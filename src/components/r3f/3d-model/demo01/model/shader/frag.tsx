export const frag = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uDiffuse;
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vNoise;
    varying vec2 vPat1;
    varying vec2 vPat2;
    varying vec2 vPat3;
    varying vec3 vNormal;

      //	Simplex 3D Noise 
      //	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
      //
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
      
        //  x0 = x0 - 0. + 0.0 * C 
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      
      // Permutations
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        
      // Gradients
      // ( N*N points uniformly over a square, mapped onto an octahedron.)
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
      //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
      // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

    vec3 snoise3( vec3 x ){
      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      return vec3( s , s1 , s2 );
    }

    vec3 tonemapFilmic(vec3 v) {
        v = max(vec3(0.0), v - 0.004);
        v = (v * (6.2 * v + 0.5)) / (v * (6.2 * v + 1.7) + 0.06);
        return v;
    }

    vec3 tonemapACES(vec3 v) {
        const float a = 2.51;
        const float b = 0.03;
        const float c = 2.43;
        const float d = 0.59;
        const float e = 0.14;
        return clamp((v*(a*v+b))/(v*(c*v+d)+e),0.,1.);
    }

    vec3 tonemapUnreal(const vec3 x) { return x / (x + 0.155) * 1.019; }

    vec3 hue2rgb( in float hue) {
        float R = abs(hue * 6.0 - 3.0) - 1.0;
        float G = 2.0 - abs(hue * 6.0 - 2.0);
        float B = 2.0 - abs(hue * 6.0 - 4.0);
        return clamp(vec3(R,G,B),0.,1.);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0f, 2.0f / 3.0f, 1.0f / 3.0f, 3.0f);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0f - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0f, 1.0f), c.y);
    }

    vec3 hsl2rgb(const in vec3 hsl) {
        vec3 rgb = hue2rgb(hsl.x);
        float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
        return (rgb - 0.5) * C + hsl.z;
    }
    vec3  blendDifference(in vec3 base, in vec3 blend) { return abs(base-blend); }
    float map(float v, float iMin, float iMax ) { return (v-iMin)/(iMax-iMin); }
    float map1(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
    
    void main(){

      float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
      float alpha = smoothstep(0.5,0.65,dist);
      vec4 diffuse = texture2D(uDiffuse, vUv);
      vec2 newUv = vUv;
      vec3 newPos = vPos;
      vec3 newNormal = vNormal;

      vec3 noisePos = snoise3((newNormal) * 2.  + uTime *0.2 ) ;
      float n = snoise( (1. - newNormal) *0.85 + uTime *0.1 ) ;
      float sat = map(abs(n), 0.,.25);
      float hue =  map1(n*n, 0.755,.775,0.525,0.585);
      vec3 convert = hsv2rgb(vec3(hue, sat, .5));
      vec3 ease = noisePos * noisePos ;
      vec3 col = tonemapFilmic(ease + newNormal * 2. + .95);
      col *= pow(col, vec3(0.4545));
      // col *= newNormal;
      // float diff = max(dot(nPos, nLight),0.);
      // c *= diff;
      gl_FragColor = vec4(col,1.);
    }

`;
