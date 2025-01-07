export const frag = /*glsl*/ `
      uniform float uTime;
      uniform sampler2D uTexture;
      varying float vNoise;
      varying vec2 vUv;
      varying vec3 vPos;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);

      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
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
          r = vec2(fbm(p + 4.0 * q + vec2(-t) + vec2(5.5)), fbm(p + 4.0 * q + vec2(-t) + vec2(2.5)));
          g = vec2(fbm(p + 2.0 * r + vec2(t * 20.0) + vec2(1.5)), fbm(p + 2.0 * r + vec2(t * 10.0) + vec2(8.5)));
          return fbm(p + 8. * g + vec2(t * 8.0));
      }

      void main(){
        vec2 uv = vUv;
        vec3 p = vPos;

        vec2 q, r, g;
        float noise = pattern(uv.xy * vec2(5.,15.)  , uTime *0.015 - uv.y, q, r, g);
        // blue pattern
        vec3 col = vec3(.0,.5,0.645);
        col = mix(col, vec3(0., 0.15, 0.555), noise    );
        col = mix(col, vec3(0.,0.855,0.855 ), r.y * 2.  );
        col = mix(col, vec3(.0,.0,.755), dot(q,q) *0.75 );
        col = mix(col, vec3(.0,.0,0.), g.x *.2 * g.x );
        col -= noise * .0625;
        // col = mix(col, vec3(0), smoothstep(0.2, .5, noise) * smoothstep(0.5, .2, noise));
        col = pow(col, vec3(0.45));

        gl_FragColor = vec4(col,1.);
      }
  `;
// blue pattern
// vec3 col = vec3(.0,.5,0.645);
// col = mix(col, vec3(0., 0.15, 0.555), noise    );
// col = mix(col, vec3(0.,0.855,0.855 ), r.y * 2.  );
// col = mix(col, vec3(.0,.0,.755), dot(q,q) *0.75 );
// col = mix(col, vec3(.0,.0,0.), g.x *.2 * g.x );
// col += noise * .25;
// col = mix(col, vec3(0), smoothstep(0.2, .5, noise) * smoothstep(0.5, .2, noise));
// col = pow(col, vec3(0.45));
