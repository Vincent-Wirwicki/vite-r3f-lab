export const frag = /*glsl*/ `

    varying float vTime;
    varying vec3 vPos ;

        #define PI 3.141592653


    vec3 spectral_soft(float x) {
    float delta = 0.5;
    vec3 color = vec3(1.0);
    float freq = x * PI;
    color.r = sin(freq - delta);
    color.g = sin(freq);
    color.b = sin(freq + delta);
    return pow(color, vec3(4.0));
}

vec3 bump(vec3 x) { return max(vec3(1.,1.,1.) - x * x, vec3(0.,0.,0.)); }

vec3 spectral_gems (float x) {
    return bump(vec3(   4. * (x - 0.75),    // Red
                        4. * (x - 0.5),     // Green
                        4. * (x - 0.25)     // Blue
                    ) );
}

vec3 spectral_geoffrey(float t) {
    vec3 r = (t * 2.0 - 0.5) * 2.1 - vec3(1.8, 1.14, 0.3);
    return 0.99 - r * r;
}

vec3 hue(float x, float r) { 
    vec3 v = abs( mod(fract(1.0-x) + vec3(0.0,1.0,2.0) * r, 1.0) * 2.0 - 1.0); 
    return v*v*(3.0-2.0*v);
}

vec3 water(float x) {
    return pow(vec3(.1, .7, .8), vec3(4.* saturate(1.0-x) ));
}

    vec3 hue2rgb( in float hue) {
        float R = abs(hue * 6.0 - 3.0) - 1.0;
        float G = 2.0 - abs(hue * 6.0 - 2.0);
        float B = 2.0 - abs(hue * 6.0 - 4.0);
        return clamp(vec3(R,G,B),0.,1.);
    }

vec3 tonemapACES(vec3 v) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return saturate((v*(a*v+b))/(v*(c*v+d)+e));
}

vec3 tonemapFilmic(vec3 v) {
    v = max(vec3(0.0), v - 0.004);
    v = (v * (6.2 * v + 0.5)) / (v * (6.2 * v + 1.7) + 0.06);
    return v;
}

    void main(){
      // float dist = length(gl_PointCoord - vec2(0.5));
      // float alpha =1.- smoothstep(0.4,0.5,dist);
      // gl_FragColor = vec4(1.,1.,1.,alpha);
      float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
      float alpha = smoothstep(0.5,0.65,dist);
      vec3 nPos = normalize(vPos - 0.5);
      float dis = length(vPos);
      // vec3 col = mix(vec3(vPos.x,0.455,0.0), vec3(0.955,vPos.y,0.), vPos.x * vTime*vTime);
      vec3 col = mix(vPos -0.5, vec3(0.,0.,0.),  vTime*vTime);
      float luminance = dot(vPos.rgb, vec3(0.2126, 0.7152, 0.0722));

    
      float s = smoothstep(-1.,1.,sin(vPos.x * vPos.y));
      vec3 spec = spectral_soft(luminance * vTime);
      vec3 test = hue2rgb(dis * 2.);
      vec3 tone = tonemapACES((spec ));
      // tone = max(tone - (0.0001 + tone*0.004)*.5, 0.);

      gl_FragColor = vec4(vec3( (tone *0.5) + .15),1.);
      // gl_FragColor = vec4(vec3(.5),alpha);

    }
`;
// vec3(cos(angle * vTime), sin(angle*vTime),0.)
