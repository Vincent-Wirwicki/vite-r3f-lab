export const vert = /* glsl */ `

    uniform float uTime;
    #define PI 3.141592653

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

    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec3 rotateX(vec3 position, float angle) {
    float cosA = cos(angle);
    float sinA = sin(angle);

    float newY = position.y * cosA - position.z * sinA;
    float newZ = position.y * sinA + position.z * cosA;

    return vec3(position.x, newY, newZ);
}

    void main(){
        float size = 10.;
        float freq = 8.;

        vec3 pos = position;

        float angle = atan(pos.x , pos.y )  ;
        float dist = length(pos.xy) -0.5;

        float time = mod(mod(uTime *0.15, 1.0) + 1.0, 1.0);
        float waveMod = map(time  * 2. * PI, -1.,1.,-4.,4.);

        float waveAmp = exp(1. - dist * .5);
        // float waveAmp = 1. / (dist * 10.01) * 0.15;
        float wave = sin(dist * freq + waveMod + angle * 2.) * 0.25 * waveAmp ;   
        pos.z = wave ;

        float n = snoise(pos.xy * freq ) * ( waveAmp ) ;
        float mn = map(n * 2. * PI , 0.,1. , 0.075 * dist * 2., 0.1 * dist);
        pos.z += mn  ; 
        
        // float scale = abs(1. - pos.z *10. * 1. - (waveAmp)   ) ; 
        float scale = abs(1. - pos.z *10. * 1. - (waveAmp)    ) ;
        size *=  scale ;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.);
        gl_PointSize = size *  (1. / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
    }

`;
