'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const orbitVertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;
varying float vDistort;
uniform float uTime;
uniform float uSpeed;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uIntensity;

vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289v4(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float pnoise(vec3 P, vec3 rep) {
  vec3 Pi0 = mod(floor(P), rep);
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
  Pi0 = mod289v3(Pi0);
  Pi1 = mod289v3(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) {
  return rotation3dY(angle) * v;
}

vec3 sin3(vec3 val) { return sin(val.yzx) * cos(val.zxy); }

void main() {
  vUv = uv;
  vNormal = normal;
  float t = uTime * uSpeed;
  float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;
  vec3 pos = position + (normal * distortion);
  float angle = sin(uv.y * uFrequency) * uAmplitude;
  pos = rotateY(pos, angle);
  pos *= 1.0 + (sin3(pos * uIntensity + t) * 0.045);
  vDistort = distortion;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
}
`;

const orbitFragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;
varying float vDistort;
uniform float uTime;
uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLightColor;
uniform vec3 uColor;
uniform vec3 uLightPos;
uniform vec3 uColorTeal;

float pow2(float x) { return x * x; }

vec4 BlinnPhong(vec3 viewDir, vec3 normal) {
  vec3 lightDir = normalize(uLightPos);
  vec3 halfDir = normalize(lightDir + viewDir);
  float diff = max(dot(normal, lightDir), 0.0);
  float spec = pow(max(dot(normal, halfDir), 0.0), uShininess);
  return vec4(vec3(diff) + vec3(spec), 1.0);
}

vec2 rotateUV(vec2 uv, float rotation) {
  float cosa = cos(rotation);
  float sina = sin(rotation);
  mat2 rotmat = mat2(cosa, -sina, sina, cosa);
  return rotmat * (uv - 0.5) + 0.5;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  float distort = vDistort * 2.0;
  vec3 viewDir = normalize(vViewPosition);
  vec4 lighting = BlinnPhong(viewDir, normalize(vNormal));
  vec3 color = uColor;
  float dotProduct = dot(viewDir, vNormal);
  vec4 finalColor = vec4(mix(color, uLightColor, lighting.x) + (vec3(smoothstep(0.8, 1.0, pow2(dotProduct) * lighting.y)) * uDiffuseness), 1.0);
  finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * pow2(dotProduct), 0.3);
  vec3 grain = vec3(random(rotateUV(vUv * 50.0, 0.1) - uTime * 0.01)) * 0.15;
  finalColor.rgb += grain;
  gl_FragColor = finalColor;
}
`;

function getOrbitPosition(
  index: number,
  totalItems: number,
  time: number,
  radius: number,
  period = 16
) {
  const baseAngle = (index / totalItems) * Math.PI * 2;
  const orbitAngle = baseAngle + (time / period) * Math.PI * 2;
  const tiltAngle = Math.PI * 0.35;
  let x = Math.cos(orbitAngle) * radius;
  let y = Math.sin(orbitAngle) * radius * Math.cos(tiltAngle);
  const z = Math.sin(orbitAngle) * radius * Math.sin(tiltAngle);
  y -= x * Math.sin(tiltAngle) * 0.3;
  return { x, y, z };
}

interface OrbitLabel {
  text: string;
}

function OrganicShape({
  color,
  lightColor,
  uniforms,
}: {
  color: string;
  lightColor: string;
  uniforms: Record<string, unknown>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: orbitVertexShader,
        fragmentShader: orbitFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: (uniforms.speed as number) || 0.5 },
          uNoiseDensity: { value: 1.5 },
          uNoiseStrength: { value: 0.4 },
          uFrequency: { value: 3.0 },
          uAmplitude: { value: 0.5 },
          uIntensity: { value: 1.2 },
          uShininess: { value: 40.0 },
          uDiffuseness: { value: 1.5 },
          uLightColor: { value: new THREE.Color(lightColor) },
          uColor: { value: new THREE.Color(color) },
          uLightPos: { value: new THREE.Vector3(2, 2, 3) },
          uColorTeal: { value: new THREE.Color('#005f6b') },
          uBrightness: { value: 1.0 },
        },
      }),
    [color, lightColor, uniforms]
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1.2, 4]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}

function OrbitingLabels({
  items,
  radius,
  period,
}: {
  items: OrbitLabel[];
  radius: number;
  period: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <OrbitingLabel
          key={i}
          index={i}
          total={items.length}
          text={item.text}
          radius={radius}
          period={period}
        />
      ))}
    </group>
  );
}

function OrbitingLabel({
  index,
  total,
  text,
  radius,
  period,
}: {
  index: number;
  total: number;
  text: string;
  radius: number;
  period: number;
}) {
  const htmlRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!htmlRef.current) return;
    const pos = getOrbitPosition(index, total, state.clock.elapsedTime, radius, period);
    htmlRef.current.position.set(pos.x, pos.y, pos.z);
  });

  return (
    <group ref={htmlRef}>
      <Html center distanceFactor={4} zIndexRange={[0, 0]}>
        <span className="whitespace-nowrap font-sans text-xs font-medium tracking-tight text-vivavive-red/80">
          {text}
        </span>
      </Html>
    </group>
  );
}

interface DataOrbitProps {
  items: OrbitLabel[];
  color?: string;
  lightColor?: string;
  radius?: number;
  period?: number;
  speed?: number;
}

export default function DataOrbit({
  items,
  color = '#005f6b',
  lightColor = '#ff4d4d',
  radius = 1.8,
  period = 16,
  speed = 0.5,
}: DataOrbitProps) {
  return (
    <div className="h-[400px] w-full md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <OrganicShape
          color={color}
          lightColor={lightColor}
          uniforms={{ speed }}
        />
        <OrbitingLabels items={items} radius={radius} period={period} />
      </Canvas>
    </div>
  );
}
