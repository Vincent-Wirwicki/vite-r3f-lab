export const vert = /* glsl */ `

    uniform float uTime;
    #define PI 3.141592653


    void main(){
        float size = 20.;
        vec3 pos = position;
        // float dist = distance(gl_PointCoord, vec2(0.5));
        float dist = length(pos.xy) -0.5;
        float angle = atan(pos.x, pos.y)  ;

        float intensity = pow(dist, 3.);
        // float n = snoise(pos.xy * 2. * PI) *0.1;

        // pos.z = sin(dist * 5. - uTime * 4. ) * .5;
        pos.z = sin(dist *4. - uTime * 4. ) * .5;
        // pos.z +=n;

        float sizeFactor = abs(1.-pos.z) + .5 ; 
        gl_PointSize = size * sizeFactor ;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.);
        gl_PointSize *=  (1. / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
    }

`;
