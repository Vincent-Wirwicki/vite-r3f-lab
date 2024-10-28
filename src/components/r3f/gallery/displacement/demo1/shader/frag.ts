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

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}

    void main(){

        vec3 disp = texture2D(uDispTex, vUv).xyz;
        float amp = .15;
        float dist = distance(vUv, vec2(0.5));
        float angle = atan(vUv.x, vUv.y) * dist;

        // float d1 = length(vUv - 0.5);

        // float radial =  smoothstep(0.,1.,mix(0.,1.,dist)) * uDispFac;

        // vec2 r1 = vUv - radial * (disp.xy -0.5) * amp;
        // vec2 r2 = vUv - (1. - radial * (disp.xy -0.5) * amp);

        // float angle = atan(vUv.x, vUv.y) * dist;

        // vec2 a1 = vec2(vUv.x + uDispFac * cos(angle) * amp, vUv.y + uDispFac *sin(angle) * amp);
 
        vec2 distortion1 = vec2(vUv.x + uDispFac*disp.y *amp ,vUv.y );
        vec2 distortion2 = vec2(vUv.x - (1. - uDispFac)*disp.y*amp, vUv.y );

        // vec2 distortion1 = vec2(vUv.x + uDispFac*disp.x *amp ,vUv.y + uDispFac*disp.y *amp  );
        // vec2 distortion2 = vec2(vUv.x + (1. - uDispFac)*disp.x*amp, vUv.y - ((1. - uDispFac)*disp.y*amp));


        vec2 dUv1 = vec2(vUv.x + uDispFac*amp * disp.x * cos(angle * 3.14 +  disp.x) ,vUv.y + uDispFac*disp.y *amp *sin(angle*3.14 + uDispFac));
        vec2 dUv2 = vec2(vUv.x - (1.- uDispFac)*amp * disp.x * cos(angle *3.14 + uDispFac), vUv.y - ( 1. - uDispFac)*disp.y *amp *sin(angle*3.14 + uDispFac));

        // vec3 current = texture2D(uCurrTex, dUv1).xyz;
        // vec3 next = texture2D(uNextTex, dUv2).xyz;

        vec4 current = texture2D(uCurrTex, distortion1) ;
        vec4 next = texture2D(uNextTex, distortion2)*uDispFac;

        vec4 fadeOut = current * 1.- uDispFac ;
        vec4 fadeIn = next * ( uDispFac) ;

        vec4 final = fadeIn + fadeOut;

        // vec3 display = mix(current, next, uDispFac);
        vec4 display = mix(current, next, uDispFac);


        gl_FragColor = vec4(final);
    }

`;
