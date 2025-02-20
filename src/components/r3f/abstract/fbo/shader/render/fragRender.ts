export const fragRender = /* glsl */ `
    varying vec3 vPos;
    varying vec2 vUv;
    varying float vDiff;
    uniform sampler2D uPositions;

float viewZ2depth( const in float viewZ, const in float near, const in float far ) {

    return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
    
}

    void main(){
 
// Distance-based alpha
float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
float alpha = smoothstep(0.5, 0.65, dist);

// Chromatic aberration offset
// vec3(.35,.155,2.155) electric violet

// Final color output
gl_FragColor = vec4(vec3(.25,.155,2.155), 1.);
    }

`;
