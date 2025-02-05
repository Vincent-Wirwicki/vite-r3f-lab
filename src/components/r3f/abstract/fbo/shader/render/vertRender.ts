export const vertRender = /* glsl */ `
    // varying vec2 vUv;   
    uniform sampler2D uPositions;
    varying vec3 vPos;
    varying vec2 vUv;
    varying float vDiff;


    void main() {
        vec3 pos = texture2D( uPositions, position.xy ).xyz;
        vec3 newPos = vPos;
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vec3 diff = normalize(pos.xyz );
        vec3 light = normalize(vec3(0.,1.,0.));
        float diffuse = max(dot(diff, light),0.);
        vDiff = diffuse;
        // vDistance = -mvPosition.z;
        gl_PointSize = 1. * (1./ -mvPosition.z);
        // gl_PointSize =  (1./ length(pos));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1. );
    }

`;
