export const frag = /* glsl */ `

    uniform sampler2D uCurrTex;
    uniform sampler2D uNextTex;
    uniform sampler2D uDispTex;
    uniform float uDispFac;

    varying vec2 vUv;

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

    // 	<https://www.shadertoy.com/view/MdX3Rr>
    //	by inigo quilez
    const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
    float fbm( in vec2 p ){
        float f = 0.0;
        f += 0.5000*noise( p ); p = m2*p*2.02;
        f += 0.2500*noise( p ); p = m2*p*2.03;
        f += 0.1250*noise( p ); p = m2*p*2.01;
        f += 0.0625*noise( p );

        return f/0.9375;
    }

    // easing can add a little something to the transition
    float circularIn(in float t) { return 1.0 - sqrt(1.0 - t * t); }
    float cubicOut(in float t) {
        float f = t - 1.0;
        return f * f * f + 1.0;
    }

    void main(){
    
        float uvx = fbm(vUv * vec2(3.15,2.) );
        vec3 disp = texture2D(uDispTex,vUv * uvx ).xyz;
        float duvx = fbm(disp.xy );
        float amp = .5;
        
        // experiment math here to mix uv
        vec2 distortion1 = vec2(vUv.x + uDispFac* (disp.y * duvx)  ,vUv.y + uDispFac *disp.x );
        vec2 distortion2 = vec2(vUv.x - (1. - uDispFac)*disp.y, vUv.y - (1. - uDispFac)*disp.x *duvx);

        vec4 current = texture2D(uCurrTex, distortion1);
        vec4 next = texture2D(uNextTex, distortion2);

        vec4 render = mix(current, next, smoothstep(0.2,0.8, cubicOut(uDispFac)) );

        gl_FragColor = vec4(render);
    }

`;
