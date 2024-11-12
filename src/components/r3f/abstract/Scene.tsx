import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0.7, 3.8] }}>
      <Particles />
      {/* <LinesFibo /> */}

      <OrbitControls />
    </Canvas>
  );
};

export default Scene;

const Particles = () => {
  const COUNT = 2000;
  const matRef = useRef<ShaderMaterial>(null!);
  // Evenly points distrubution on a sphere
  // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
  const pos = useMemo(() => {
    const phi = Math.PI * (Math.sqrt(5) - 1);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  const shader = useMemo(
    () => ({
      uniforms: { uSize: { value: 1 }, uTime: { value: 0 } },
      vertex: /*glsl*/ `
        // Simplex 2D noise
  //
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

  const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
  float fbm( in vec2 p ){
      float f = 0.0;
      f += 0.5000*snoise( p ); p = m2*p*2.02;
      f += 0.2500*snoise( p ); p = m2*p*2.03;
      f += 0.1250*snoise( p ); p = m2*p*2.01;
      f += 0.0625*snoise( p );

      return f/0.9375;
  }


        uniform float uTime;
        #define PI 3.141592653

          float exponentialIn(in float t) { return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0)); }
float elasticIn(in float t) { return sin(13.0 * t * PI*0.5) * pow(2.0, 10.0 * (t - 1.0)); }

float bounceOut(in float t) {
    const float a = 4.0 / 11.0;
    const float b = 8.0 / 11.0;
    const float c = 9.0 / 10.0;

    const float ca = 4356.0 / 361.0;
    const float cb = 35442.0 / 1805.0;
    const float cc = 16061.0 / 1805.0;

    float t2 = t * t;

    return t < a
        ? 7.5625 * t2
        : t < b
            ? 9.075 * t2 - 9.9 * t + 3.4
            : t < c
                ? ca * t2 - cb * t + cc
                : 10.8 * t * t - 20.52 * t + 10.72;
}

float bounceInOut(in float t) {
    return t < 0.5
        ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
        : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}
        void main(){

          float size = 15.;
          vec3 newPos = position;

          float time = sin(uTime*1.15);
          // float ease = time*time*time;
          float ease = bounceInOut(time);
          // float time = mod(uTime , 6. );

          float theta = 2.*PI * position.x ;
          float phi = acos(mix(1.,15., ease * 0.5)*abs(time)*position.y  ) - PI *0.5;

          float d2 = fbm(vec2(theta, phi) * ease ) *0.15;
          newPos.z += d2 ;
          // newPos.x += d2 ;
          //  newPos.y += d2 ;

          size += d2 *20.;
          float lastSize = mix(d2, 10.,ease);
          vec3 loop = mix(position, newPos, ease);

          vec4 mvPos = modelViewMatrix * vec4(loop, 1.);
          gl_PointSize = 8. * (1. / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }`,
      fragment: /*glsl*/ `
        void main(){
          // float dist = length(gl_PointCoord - vec2(0.5));
          // float alpha =1.- smoothstep(0.4,0.5,dist);
          // gl_FragColor = vec4(1.,1.,1.,alpha);
          float dist = 1. - length(gl_PointCoord.xy - vec2(0.5));
          float alpha = smoothstep(0.45,0.55,dist);
          gl_FragColor = vec4(1.,1.,1.,alpha);
        }
        `,
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    console.log(camera.position);
  });

  return (
    <Points positions={pos} scale={[2, 2, 2]}>
      {/* <pointsMaterial size={0.015} /> */}
      <shaderMaterial
        ref={matRef}
        uniforms={shader.uniforms}
        fragmentShader={shader.fragment}
        vertexShader={shader.vertex}
        // transparent={true}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
};

// const LinesFibo = () => {
//   const COUNT = 300;

//   // Evenly points distrubution on a sphere
//   // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
//   const pos = useMemo(() => {
//     const phi = Math.PI * (Math.sqrt(5) - 1);
//     const pos: Vector3[] = [];
//     for (let i = 0; i < COUNT; i++) {
//       const y = 1 - (i / (COUNT - 1)) * 2;
//       const radius = Math.sqrt(1 - y * y);
//       const theta = phi * i;
//       const x = Math.cos(theta) * radius;
//       const z = Math.sin(theta) * radius;
//       const vec = new Vector3(x, y, z);
//       pos.push(vec);
//     }

//     return pos;
//   }, []);

//   const lineSegments = useMemo(() => {
//     const segmentsList = [];
//     for (let i = 0; i < pos.length; i++) {
//       for (let j = i + 1; j < pos.length; j++) {
//         if (pos[i].distanceTo(pos[j]) < 0.25) {
//           segmentsList.push([pos[i], pos[j]]);
//         }
//       }
//     }
//     return segmentsList;
//   }, [pos]);

//   return (
//     <Instances limit={lineSegments.length}>
//       <sphereGeometry args={[5, 64, 64]} />
//       <meshStandardMaterial color="#f0f0f0" />
//       <Instance>
//         {lineSegments.map((segment, index) => (
//           <Line
//             key={index}
//             points={segment}
//             color="white"
//             lineWidth={1.5}
//             // segments={true}
//           />
//         ))}
//       </Instance>
//     </Instances>
//   );
// };
