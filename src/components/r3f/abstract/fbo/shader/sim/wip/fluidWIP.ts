export const fragSim = /* glsl */ `
    uniform sampler2D uPositions;
    // uniform sampler2D uOffset;

    uniform float uTime;
    varying vec2 vUv;  
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

vec2 PeterdeJong(vec2 last)
{
    
    float a = -2.;
    float b =-2.0;
    float c = .4;
    float d = 2.0;
    
	vec2 next = vec2(0);
	
    next.x = sin(a * last.y) - cos(b * last.x);
    next.y = sin(c * last.x) - cos(d * last.y);
    
    return next;
}

    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
    vec3 depthColor(vec2 p) {
        float depth = length(p); // Compute magnitude of the point
        return vec3(depth * 0.1, depth * 0.05, 0.5 + depth * 0.02); // Map depth to RGB
    }

float fbm(in vec2 st) {
    // Initial values
    float value = 0.;
    float amplitud = 0.5;

    // Loop of octaves
    for (int i = 0; i < 4; i++) {
        value += amplitud * snoise(st);
        st *= 4.;
        amplitud *= 0.5;
    }
    return value;
}

    void main(){
          vec2 uv = vUv;
        vec4 pos = texture2D( uPositions, uv );
        // vec4 offset = texture2D( uPositions, uv );

        vec4 newPos = pos;
        float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
        float repeat = sin(time *2. * PI);
        
        vec2 pixel = vec2(1./512., 1./512.);

        //  params
        float fluid_dt = 0.15 * uTime ;
        const float fluid_visco = 0.16;
        const float fluid_decay = 5e-6;
        const float fluid_vorty = 0.3;

        vec2 force = vec2(0.15,0.15);

        // divergeance
        const float k = 0.2;
         float s = k/fluid_dt;
        const float dx = 1.;

        vec4 d = texture2D( uPositions, uv );
        vec4 dR = texture2D( uPositions, uv + vec2(pixel.x,0.) );
        vec4 dL = texture2D( uPositions, uv - vec2(pixel.x,0.) );
        vec4 dT = texture2D( uPositions, uv + vec2(0.,pixel.y) );
        vec4 dB = texture2D( uPositions, uv - vec2(0.,pixel.y) );

        // Delta Data
        vec4 ddx = (dR - dL).xyzw; // delta data on X
        vec4 ddy = (dT - dB).xyzw; // delta data on Y
        float divergence = (ddx.x + ddy.y) * 0.5;
        divergence = (ddx.x + ddy.y) / (2.0 * dx * dx);
       
        // Solving for density with one jacobi iteration 
        float a = 1.0 / (dx * dx);
        d.z = 1.0 / ( -4.0 * a ) * ( divergence - a * (dT.z + dR.z + dB.z + dL.z));


        // Solving for velocity
        vec2 laplacian = dR.xy + dL.xy + dT.xy + dB.xy - 4.0 * d.xy;
        vec2 viscosityForce = fluid_visco * laplacian;

        // Semi-lagrangian advection
        vec2 densityInvariance = s * vec2(ddx.z, ddy.z);
        vec2 was = uv - fluid_dt * d.xy * pixel;
        d.xyw = texture2D(uPositions, was).xyw;
        d.xy += fluid_dt * (viscosityForce - densityInvariance );

        // velocity decay
        d.xy = max(vec2(0.), abs(d.xy) - fluid_decay) * sign(d.xy);

        // vorticity
        d.w = (dB.x - dT.x + dR.y - dL.y); // curl stored in the w channel
        vec2 vorticity = vec2(abs(dT.w) - abs(dB.w), abs(dL.w) - abs(dR.w));
        vorticity *= fluid_vorty/(length(vorticity) + 1e-5) * d.w;
        d.xy += vorticity *0.5;

        // Boundary conditions
        d.xy *= smoothstep(0.5, 0.49,abs(uv - 0.5));

        // Pack XY, Z and W data
        d.xy = clamp(d.xy, -0.999, 0.999);
        d.zw = clamp(d.zw,0.,1.);
       
        pos = d  ;
        // pos = mod(pos, 1.);


        gl_FragColor = vec4(pos);

    }

`;

// vec2 center = pos.xy * 2. - vec2(4.);

// float diff = length(center - 0.5 ) / 0.5;

// float dist = length(newPos.xy - vec2(0.5)) ;
// float nd = normalize(dist);
// // dist = pow(dist, 0.5);
// float height = (1./diff) * cos(dist *12.  - uTime *0.5)*0.1 ;

// newPos.z -= height  *0.95 ;
// vec2 test3(vec2 p, float t, float md) {
//         float a = 0.49 ;
//         float b = -.16;
//         float c = 2.;
//         float d = 0.5;

//         float x = p.x * p.x - p.y*p.y + a * p.x + b *p.y;
//         float y = 2. * p.x * p.y + c * p.x + d * p.y;

//         return vec2(x, y);
// }
