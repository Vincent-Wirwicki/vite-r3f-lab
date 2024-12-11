export const frag = /*glsl*/ `
    uniform float uTime;
    uniform sampler2D uTexture;
    varying float vNoise;
    varying vec2 vUv;
    varying vec3 vPos;

// this shader was helpfull https://www.shadertoy.com/view/wtXXD2
    float noise( in vec2 x ){
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f*f*(3.0-2.0*f);
      float a = textureLod(uTexture,(p+vec2(0.5,0.5))/256.0,0.0).x;
	    float b = textureLod(uTexture,(p+vec2(1.5,0.5))/256.0,0.0).x;
	    float c = textureLod(uTexture,(p+vec2(0.5,1.5))/256.0,0.0).x;
	    float d = textureLod(uTexture,(p+vec2(1.5,1.5))/256.0,0.0).x;
      return mix(mix( a, b,f.x), mix( c, d,f.x),f.y);
  }

  const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

    float fbm( vec2 p )
    {
        float f = 0.0;
    
        f += 0.500000*noise( p ); p = mtx*p*2.02;
        f += 0.250000*noise( p ); p = mtx*p*2.03;
        f += 0.125000*noise( p ); p = mtx*p*2.01;
        f += 0.062500*noise( p ); p = mtx*p*2.04;
        f += 0.031250*noise( p ); p = mtx*p*2.01;
        f += 0.015625*noise( p );
    
        return f/0.96875;
    }

    
    float pattern(in vec2 p, in float t, out vec2 q, out vec2 r, out vec2 g)
    {
    	  q = vec2(fbm(p), fbm(p + vec2(10, 1.3)));
        r = vec2(fbm(p + 4.0 * q + vec2(t) + vec2(1.5, 10.)), fbm(p + 4.0 * q + vec2(t) + vec2(8.3, 2.8)));
        g = vec2(fbm(p + 2.0 * r + vec2(t * 20.0) + vec2(2, 6)), fbm(p + 2.0 * r + vec2(t * 10.0) + vec2(5, 3)));
        return fbm(p + 5.5 * g + vec2(t * 7.0));
    }
      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    void main(){
      vec2 uv = vUv;
      vec3 p = vPos;
      vec4 tex = texture2D(uTexture, uv);

      float loopTime = mod(uTime * 0.15, 2.0 * 3.14159);
      float time = sin(loopTime) * sin(loopTime * 2.);

      vec2 q, r, g;
      float noise = pattern(vUv.xy * vec2(20.5,2.), time, q, r, g);
      vec3 col = mix(vec3(0.496,0.957,0.995), vec3(0., 0., 0.), smoothstep(0.8,1., noise) );
      col = mix(col, vec3(.0,0,0), .8 * r.x * r.x);
      // col = mix(col, vec3(1., 0., 0), smoothstep(0.0, .2, 0.5*r.y*r.y));
      col = mix(col, vec3(0,0,0.5), dot(q,q));
      col = mix(col, vec3(1), .8*g.y);
      col = mix(col, vec3(0), smoothstep(0., 0.5, noise) * smoothstep(0.5, 0.3, noise));
      col = mix(col, vec3(0), smoothstep(0.3, 0.5, noise) * smoothstep(0.5, 0.3, noise));



      // col = mix(col, vec3(0), smoothstep(0.3, 0.5, noise) * smoothstep(0.5, 0.8, noise));


      gl_FragColor = vec4(col,1.);
    }
`;
