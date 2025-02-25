export const vertRender = /* glsl */ `
    // varying vec2 vUv;   
    uniform sampler2D uPositions;
    varying vec3 vPos;
    varying vec2 vUv;
    varying float vDiff;
    varying vec3 vTone;

vec3 tonemapFilmic(vec3 v) {
    v = max(vec3(0.0), v - 0.004);
    v = (v * (6.2 * v + 0.5)) / (v * (6.2 * v + 1.7) + 0.06);
    return v;
}

vec3 tonemapACES(vec3 v) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.,1.);
}


    void main() {
        vec3 pos = texture2D( uPositions, position.xy ).xyz;
        vec3 newPos = vPos;
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vec3 diff = normalize(pos.xyz );
        vec3 light = normalize(vec3(0.,0.,1.));
        float diffuse = max(dot(diff, light),0.);
        float lum = dot(pos, vec3(0.21250175, 0.71537574, 0.07212251));
        vDiff = diffuse;
        vTone = tonemapFilmic(pos * diffuse );
        // vDistance = -mvPosition.z;
        gl_PointSize = 1. * (1./ -mvPosition.z);
        // gl_PointSize =  (1./ length(pos));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1. );
    }

`;
