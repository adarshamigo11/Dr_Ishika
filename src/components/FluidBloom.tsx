'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vNormal;
uniform float time;

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

void main() {
  vUv = uv;
  vNormal = normal;
  float t = time * 0.15;
  float distortion = pnoise((normal + t) * 1.8, vec3(10.0)) * 0.5;
  vec3 pos = position + (normal * distortion);
  float angle = sin(uv.y * 3.14159) * 0.45;
  pos = rotateY(pos, angle);
  vLayer0 = pos;
  pos = rotateY(pos, 1.047197551);
  vLayer1 = pos;
  pos = rotateY(pos, 1.047197551);
  vLayer2 = pos;
  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vNormal;
uniform float time;
uniform vec3 colorTeal;
uniform vec3 colorRed;
uniform sampler2D envMap;

mat2 rotation2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float gradient(vec3 pos, float t, float scale, float width, float speed) {
  vec2 p = (pos.xy + t * speed) * scale;
  vec2 a = cos(p);
  vec2 b = cos(scale * p.yx + t * speed + vec2(1.0, 0.0) + scale * p);
  return width * (a.x + a.y + b.x + b.y) * 0.25;
}

float sdRhombus(vec2 p, vec2 b) {
  vec2 q = abs(p);
  float h = clamp((-2.0 * dot(q,b) + dot(b,b)) / dot(b,b), -1.0, 1.0);
  float d = length(q - 0.5 * b * vec2(1.0-h, 1.0+h));
  return d * sign(q.x * b.y + q.y * b.x - b.x * b.y);
}

float sdHexagon(vec2 p, float r) {
  vec2 q = abs(p);
  return max(dot(q, normalize(vec2(1.0,1.7320508))), q.x) - r;
}

float sdStar(vec2 p, float r, int n, float m) {
  float an = 3.141593/float(n);
  float en = 3.141593/m;
  vec2 acs = vec2(cos(an),sin(an));
  vec2 ecs = vec2(cos(en),sin(en));
  float bn = mod(atan(p.x,p.y),2.0*an) - an;
  p = length(p)*vec2(cos(bn),abs(sin(bn)));
  p -= r*acs;
  p += ecs*clamp(-dot(p,ecs),0.0,r*acs.y/ecs.y);
  return length(p)*sign(p.x);
}

float map(vec3 p, float width, float t) {
  float s1 = sdRhombus(rotation2d(t * 0.12) * p.xy, vec2(1.0));
  float s2 = sdHexagon(p.xy, 0.8);
  float s3 = sdStar(p.xy, 0.9, 5, 2.0);
  float mix1 = (sin(t * 0.14) * 0.5 + 0.5);
  float mix2 = (sin(t * 0.18 + 2.0) * 0.5 + 0.5);
  float w1 = mix1 * mix2;
  float w2 = (1.0 - mix1) * mix2;
  float w3 = mix1 * (1.0 - mix2);
  float w4 = (1.0 - mix1) * (1.0 - mix2);
  float finalS = s1 * w1 + s2 * w2 + s3 * w3 + s1 * w4;
  return finalS * width;
}

void main() {
  float t = time * 0.15;
  float width = length(fwidth(vLayer0.xy)) * 0.35;
  float lines0 = map(vLayer0, width, t);
  float lines1 = map(vLayer1, width, t * 1.15);
  float lines2 = map(vLayer2, width, t * 0.85);
  float pattern = clamp(min(lines2, min(lines0, lines1)), 0.0, 1.0);
  float alpha = smoothstep(0.0, 0.08, pattern);
  vec3 baseColor = colorTeal;
  vec3 lineColor = colorRed;
  vec3 finalColor = mix(lineColor, baseColor, alpha);
  float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
  finalColor += baseColor * fresnel * 0.8;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function FluidBloom() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv).texture;
    roomEnv.dispose();

    const uniforms = {
      time: { value: 0 },
      colorTeal: { value: new THREE.Color('#005f6b') },
      colorRed: { value: new THREE.Color('#ff4d4d') },
      envMap: { value: envTexture },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.IcosahedronGeometry(1.8, 60);
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.6;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      shaderMaterial.uniforms.time.value = elapsed;
      mesh.rotation.y = elapsed * 0.15;
      mesh.rotation.x = Math.sin(elapsed * 0.05) * 0.1;
      composer.render();
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      shaderMaterial.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-fluid-canvas-container" />;
}
