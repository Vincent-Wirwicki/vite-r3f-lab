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
    // https://www.shadertoy.com/view/wsBfzK
    float WaveletNoise(vec2 p, float z, float k) {
        float d=0.,s=1.,m=0., a;
        for(float i=0.; i<4.; i++) {
            vec2 q = p*s, g=fract(floor(q)*vec2(123.34,233.53));
        	g += dot(g, g+23.234);
	    	a = fract(g.x*g.y)*1e3;// +z*(mod(g.x+g.y, 2.)-1.); // add vorticity
            q = (fract(q)-.5)*mat2(cos(a),-sin(a),sin(a),cos(a));
            d += sin(q.x*10.+z)*smoothstep(.25, .0, dot(q,q))/s;
            p = p*mat2(.54,-.84, .84, .54)+i;
            m += 1./s;
            s *= k; 
        }
        return d/m;
    }
    #define PI 3.141592653
    uniform float uTime;

    void main(){
        vec3 newPos = position;
        // float t = mod(uTime,3.);
        // newPos.y -= time*0.5; + newPos.x * newPos.x 
        float progress = smoothstep(-2.,2.,newPos.y);
        // newPos.y -= t*0.1;
        newPos.z +=  newPos.y*newPos.y ;
        float sn = snoise(newPos.xy *1.25 + uTime*0.15  );
        vec2 n = snoise2(newPos.xz   + uTime*0.05  );
        float w = WaveletNoise(n, uTime*0.5, 4. );    
        newPos.z +=  sn*0.15;
        newPos.y +=  sn*0.15;
        newPos.z +=  sin(w) *0.15;
        // newPos.y +=  w*0.1;
        
        float size = 10.;
        vec4 mvPos = modelViewMatrix * vec4(newPos, 1.);
        gl_PointSize = size * (1. / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
    } `;
