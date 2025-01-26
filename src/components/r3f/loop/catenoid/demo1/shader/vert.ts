export const vert = /*glsl*/ `
    
    uniform float uTime;
    varying float vTime ;
    varying vec3 vPos ;

    #define PI 3.141592653

    float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }

    mat2 rotate2d(const in float r){
      float c = cos(r);
      float s = sin(r);
      return mat2(c, s, -s, c);
    }

    vec2 rotate2(in vec2 v, in float r, in vec2 c) {
        return rotate2d(r) * (v - c) + c;
    }
    vec2 rotate(in vec2 v, in float r) {
        return rotate2(v, r, vec2(.5));
    }

    void main(){
    // Normalize time to range [0, 1] and loop
    float time = mod(uTime * 0.15, 1.0);
    float stime = sin(time *2. * PI);
    vTime = stime;

    float mu = map(position.y * stime,-1.,1.,position.y *2. -1., position.z *4. -2. );
    float muX = map(position.x * stime,-1.,1.,position.x *2. -1., position.z -0.5 );
    
    float mv = map(position.z,0.,1.,0.15,position.z + .5);

    float u = position.y ; 
    float v = position.z ; 

    // helicoid 
    float x_heli =  mv * sin(muX);
    float y_heli =  mv * cos(muX);
    float z_heli = u;

    vec3 heli = vec3(x_heli,y_heli,z_heli);

    // Catenoid 
    float x_cat = cosh(v) * cos(mu);
    float y_cat = cosh(v) * sin(mu);
    float z_cat = v;

    vec3 cat = vec3(x_cat,y_cat,z_cat);
    
    vec3 newPos = mix(cat, heli, stime*stime);

    float rot1 = map( stime ,-1.,1.,0., -.5);
    float rot2 = map( stime * stime ,-1.,1.,1., -2.);
    // newPos.yz = rotate(newPos.yz, rot1);
    newPos.xy = rotate(newPos.xy, rot2);

    vPos = newPos;
    
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_PointSize = 20. * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    }`;
