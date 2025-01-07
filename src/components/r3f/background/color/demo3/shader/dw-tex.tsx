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
        r = vec2(fbm(p + 4.0 * q + vec2(t) + vec2(5.5)), fbm(p + 4.0 * q + vec2(t) + vec2(2.5)));
        g = vec2(fbm(p + 2.0 * r + vec2(t * 20.0) + vec2(1.5)), fbm(p + 2.0 * r + vec2(t * 10.0) + vec2(8.5)));
        return fbm(p + 8. * g + vec2(t * 8.0));
    }
      float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    void main(){
      vec2 uv = vUv;
      vec3 p = vPos;
      vec4 tex = texture2D(uTexture, uv);
      float angle = atan(uv.x, uv.y);
      float dist = length(uv);

      float loopTime = mod(uTime * 0.01, 2.0 * 3.14159);
      float time = map(loopTime * 2. + (uv.x * uv.y), -4.,4.,2.5,-.5) ;
      float delta = map(time, -1.,1.,15.,20.);
      float delta2 = map(time, 0.,1.,.55,.15);

      vec2 q, r, g;
      float noise = pattern(vUv.xy * vec2(delta) , time, q, r, g);
      vec3 col = vec3(0.);

      col = mix(col, vec3(1., 0., 0.), noise    );
      col = mix(col, vec3(0.75,0.15,0.), r.x * 2. );
      col = mix(col, vec3(0.,0.,0.), g.x * .5 );
      col = mix(col, vec3(0), smoothstep(0.2, .5, noise) * smoothstep(0.5, .2, noise));


      gl_FragColor = vec4(col,1.);
    }
`;

// col = mix(col, vec3(.0,0.15,0.55), .8 * r.x * r.x);
//  col = mix(col, vec3(.0,0.75,0.55), .15 * r.y * r.y);
// col = mix(col, vec3(0.05, 0.5, 0.155), (.5*g.x*g.x - 0.5) +0.5);
// col = mix(col, vec3(0.75, 0., 0.155), delta2*g.y*g.y );

// col = mix(col, vec3(0.15,0.,0.75), q.x*q.x  );
// // col = mix(col, vec3(0.15,0.,0.55), 0.8*g.y * g.y );

// col = mix(col, vec3(0.45,0.,0.), smoothstep(0., .25, noise * g.x * g.y));
// // col *= noise *2.;
// col *= clamp(noise * 2., 0., 1.);

// col = mix(col, vec3(0), smoothstep(0.8, 1., noise) * smoothstep(0.8, 1., noise));

// col = mix(col, vec3(0), smoothstep(0.3, 0.5, noise) * smoothstep(0.5, 0.8, noise));
