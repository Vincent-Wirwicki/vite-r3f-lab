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

    vec3 tonemapACES(vec3 v) {
        const float a = 2.51;
        const float b = 0.03;
        const float c = 2.43;
        const float d = 0.59;
        const float e = 0.14;
        return clamp((v*(a*v+b))/(v*(c*v+d)+e),0.,1.);
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
      vec3 tone = tonemapACES((spec ));
      // tone = max(tone - (0.0001 + tone*0.004)*.5, 0.);

      gl_FragColor = vec4(vec3( (tone *0.5) + .15),1.);
      // gl_FragColor = vec4(vec3(.5),alpha);

    }
`;
// vec3(cos(angle * vTime), sin(angle*vTime),0.)
