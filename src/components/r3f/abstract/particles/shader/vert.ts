export const vert = /*glsl*/ `
    
    uniform float uTime;
    varying float vTime ;
    varying vec3 vPos ;

    attribute vec3 aSpeed;

    #define PI 3.141592653


    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

// Torus Position Function
    vec3 torus(float u, float v) {
        float R = 6.;
        float r = .5;
        return vec3(
            (R + r * cos(v)) * cos(u),
            (R + r * cos(v)) * sin(u),
            r * sin(v)
        );
    }

    // Tangent to the torus along u (major circle)
    vec3 torusTan(float u, float v) {
        float R = 6.;
        float r = 1.5;
        return normalize(vec3(
             -r * cos(v) * cos(u),
        -r * cos(v) * sin(u),
        -r * sin(v)
        ));
    }

    // Second derivative: Normal direction to torus tube
    vec3 torusD2(float u, float v) {
        float r = .5;
        return normalize(vec3(
            -r * cos(v) * cos(u),
            -r * cos(v) * sin(u),
            -r * sin(v)
        ));
    }

    void main(){
    // Normalize time to range [0, 1] and loop
    float time = mod(uTime * 0.15, 1.0);
    float stime = sin(time *2. * PI);
    vTime = stime;
    vec3 pos = position;
    float dt = fract(time + aSpeed.x);
    float u = fract(time *0.5 + aSpeed.x) * 2. * PI;
    float v = fract(time *1.2 + aSpeed.y) * 2. * PI;

    // pos += torus(u,v);
    vec3 T = torusTan(u,v);
    vec3 D2 = torusD2(u,v);
    vec3 N = normalize(cross(T, D2));

    float angle = aSpeed.z * 2. * PI ;
    vec3 offset = 6. * (cos(angle)* D2 + sin(angle)* N) ;

    pos += offset ;
    // newPos = torus(newPos);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 3. * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    }`;
