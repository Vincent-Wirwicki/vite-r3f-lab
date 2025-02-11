export const frag = /* glsl */ `
    uniform float uTime;
    varying vec2 vScreenSpace;
    varying vec3 vNormal;
        varying float vFresnel;


float random(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2  cubic(const in vec2 v)  { return v*v*(3.0-2.0*v); }


float gnoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = cubic(f);
    return mix( a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
}


    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    void main(){
      float light = max(dot(vNormal, normalize(vec3(0.,1.,1.))),0.);
      float n1 =  gnoise(vScreenSpace * 5. + uTime);
      float n2 =  gnoise(vScreenSpace * 500. + uTime);
      float stroke = cos((vScreenSpace.y - 0.5 ) *500. );

      // stroke += (n1 *2. - 1.) + (n2 *2. - 1.);
      light +=  (n2 *2. - 1.);
      stroke =1. -  smoothstep(2.*light -8.,2.*light + 8.,stroke)  - vFresnel *0.5;

      gl_FragColor = vec4(vec3(stroke),1.);
    }

`;
