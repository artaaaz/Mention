// Scene 3D hero: gugusan bentuk (bola, cincin, dan logo M) yang saling
// bertabrakan, tertarik ke tengah, dan terdorong oleh kursor.

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const COLORS = { yellow: 0xffee00, black: 0x0a0a0b, white: 0xf2f1ec };

const ATTRACT = 5.5; // tarikan ke tengah (y; x dilemahkan di layar lebar)
const ATTRACT_Z = 13; // lebih kuat di z supaya gugusan agak pipih
const DAMPING = 4;
const RESTITUTION = 0.25;
const MAX_SPEED = 22;
const POINTER_RADIUS = 1.6;
const STEP = 1 / 60;

/** Logo "M" Mention sebagai geometri extrude (dijiplak dari icon 512×512). */
function createMarkGeometry() {
  const f = (x, y) => [(x - 256) / 256, (256 - y) / 256];

  const outer = new THREE.Shape();
  const m = (x, y) => outer.moveTo(...f(x, y));
  const l = (x, y) => outer.lineTo(...f(x, y));
  const q = (cx, cy, x, y) => outer.quadraticCurveTo(...f(cx, cy), ...f(x, y));

  m(32, 95);
  l(481, 95);
  q(495, 95, 495, 109);
  l(495, 366);
  q(495, 380, 481, 380);
  l(409, 380);
  q(395, 380, 395, 366);
  l(395, 211);
  q(395, 197, 381, 197);
  l(132, 197);
  q(118, 197, 118, 211);
  l(118, 364);
  q(118, 376, 109, 383);
  l(44, 436);
  q(18, 454, 18, 424);
  l(18, 109);
  q(18, 95, 32, 95);

  const disc = new THREE.Shape();
  const [cx, cy] = f(255, 282);
  disc.moveTo(...f(198, 248));
  disc.lineTo(...f(312, 248));
  disc.quadraticCurveTo(...f(330, 248), ...f(330, 266));
  disc.lineTo(...f(330, 282));
  disc.absarc(cx, cy, 75 / 256, 0, Math.PI, true);
  disc.lineTo(...f(180, 266));
  disc.quadraticCurveTo(...f(180, 248), ...f(198, 248));

  const geometry = new THREE.ExtrudeGeometry([outer, disc], {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelOffset: -0.045,
    bevelSegments: 4,
    curveSegments: 20,
  });
  geometry.center();
  return geometry;
}

/** PRNG kecil supaya komposisi sama di tiap kunjungan. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createHeroScene(canvas, container, { reduceMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  // maks. 1.5: di layar rapat (HP, laptop 2x) jumlah piksel yang digambar hampir separuh dari 2x,
  // bedanya nyaris tak terlihat karena antialias tetap menyala
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 20);

  // Cahaya
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(6, 10, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -11;
  key.shadow.camera.right = 11;
  key.shadow.camera.top = 11;
  key.shadow.camera.bottom = -11;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 40;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.04;
  key.shadow.radius = 5;
  scene.add(key);

  const rim = new THREE.DirectionalLight(COLORS.yellow, 1.4);
  rim.position.set(-8, -6, -4);
  scene.add(rim);

  const glow = new THREE.PointLight(COLORS.yellow, 0, 16, 1.6);
  scene.add(glow);

  // Material & geometri
  const materials = {
    yellow: new THREE.MeshPhysicalMaterial({
      color: COLORS.yellow,
      roughness: 0.34,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
    }),
    black: new THREE.MeshPhysicalMaterial({
      color: COLORS.black,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    white: new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.62 }),
  };
  const geometries = {
    sphere: new THREE.SphereGeometry(1, 48, 32),
    ring: new THREE.TorusGeometry(0.68, 0.32, 28, 64),
    mark: createMarkGeometry(),
  };

  // Benda
  const small = Math.min(window.innerWidth, window.innerHeight) < 640;
  const rand = mulberry32(20261119);
  const palette = ["yellow", "black", "white", "black", "yellow", "white", "black"];
  /** @type {{type:'sphere'|'ring'|'mark', size:number, color:string}[]} */
  const specs = [
    { type: "mark", size: 1.55, color: "yellow" },
    { type: "mark", size: 1.1, color: "white" },
    { type: "mark", size: 0.9, color: "yellow" },
    { type: "ring", size: 1.05, color: "white" },
    { type: "ring", size: 0.8, color: "yellow" },
    { type: "ring", size: 0.7, color: "black" },
  ];
  const sphereCount = small ? 15 : 32;
  for (let i = 0; i < sphereCount; i++) {
    specs.push({ type: "sphere", size: 0.42 + rand() ** 1.6 * 0.82, color: palette[i % palette.length] });
  }

  const bodies = specs.map((spec, i) => {
    const mesh = new THREE.Mesh(geometries[spec.type], materials[spec.color]);
    mesh.scale.setScalar(spec.size);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.visible = false;
    scene.add(mesh);

    const angle = rand() * Math.PI * 2;
    const dist = 16 + rand() * 9;
    // radius tabrakan (bola pembungkus kira-kira)
    const r = spec.size * (spec.type === "sphere" ? 1 : spec.type === "ring" ? 0.96 : 0.82);
    return {
      mesh,
      type: spec.type,
      r,
      mass: r * r * r,
      p: new THREE.Vector3(Math.cos(angle) * dist, Math.sin(angle) * dist, (rand() - 0.5) * 6),
      v: new THREE.Vector3(),
      axis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      spin: 0.15 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      delay: i < 3 ? i * 0.08 : 0.15 + rand() * 0.55,
      active: false,
    };
  });
  for (const b of bodies) {
    b.mesh.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
  }

  // Pointer
  const pointer = {
    ndc: new THREE.Vector2(0, 0),
    inside: false,
    target: new THREE.Vector3(30, 0, 0),
    pos: new THREE.Vector3(30, 0, 0),
  };
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    pointer.ndc.set(x * 2 - 1, -(y * 2 - 1));
  }
  function onPointerGone() {
    pointer.inside = false;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  const onPointerUp = (e) => e.pointerType !== "mouse" && onPointerGone();
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerGone, { passive: true });
  document.addEventListener("pointerleave", onPointerGone);

  // Fisika
  const n = new THREE.Vector3();
  let time = 0;
  let started = false;
  let startTime = 0;
  let attractX = ATTRACT;

  function step(dt) {
    const damp = Math.exp(-DAMPING * dt);
    for (const b of bodies) {
      if (!b.active) continue;
      b.v.x -= b.p.x * attractX * dt;
      b.v.y -= b.p.y * ATTRACT * dt;
      b.v.z -= b.p.z * ATTRACT_Z * dt;
      b.v.multiplyScalar(damp);
      const speed = b.v.length();
      if (speed > MAX_SPEED) b.v.multiplyScalar(MAX_SPEED / speed);
      b.p.addScaledVector(b.v, dt);

      // dorongan kursor
      n.subVectors(b.p, pointer.pos);
      const min = b.r + POINTER_RADIUS;
      const d2 = n.lengthSq();
      if (d2 < min * min) {
        const d = Math.sqrt(d2) || 1e-4;
        n.multiplyScalar(1 / d);
        const overlap = min - d;
        b.p.addScaledVector(n, overlap * 0.6);
        const push = Math.min(overlap * 26, 15);
        const vn = b.v.dot(n);
        if (vn < push) b.v.addScaledVector(n, push - vn);
      }
    }

    // tabrakan antar benda
    for (let iter = 0; iter < 2; iter++) {
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i];
        if (!a.active) continue;
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j];
          if (!b.active) continue;
          n.subVectors(b.p, a.p);
          const min = a.r + b.r;
          const d2 = n.lengthSq();
          if (d2 >= min * min) continue;
          const d = Math.sqrt(d2) || 1e-4;
          n.multiplyScalar(1 / d);
          const overlap = min - d;
          const wa = b.mass / (a.mass + b.mass);
          const wb = 1 - wa;
          a.p.addScaledVector(n, -overlap * wa);
          b.p.addScaledVector(n, overlap * wb);
          const rel = (b.v.x - a.v.x) * n.x + (b.v.y - a.v.y) * n.y + (b.v.z - a.v.z) * n.z;
          if (rel < 0) {
            const impulse = -(1 + RESTITUTION) * rel;
            a.v.addScaledVector(n, -impulse * wa);
            b.v.addScaledVector(n, impulse * wb);
          }
        }
      }
    }
  }

  function updatePointer(dt) {
    if (pointer.inside) {
      raycaster.setFromCamera(pointer.ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) pointer.target.copy(hit);
    } else if (reduceMotion) {
      pointer.target.set(30, 0, 0);
    } else {
      // tanpa kursor (mis. di HP): "kursor hantu" mengaduk gugusan pelan-pelan
      pointer.target.set(Math.cos(time * 0.45) * 4.4, Math.sin(time * 0.75) * 2.3, 0);
    }
    pointer.pos.lerp(pointer.target, 1 - Math.exp(-10 * dt));
    glow.position.set(pointer.pos.x, pointer.pos.y, 3.2);
    const wanted = pointer.inside ? 46 : 16;
    glow.intensity += (wanted - glow.intensity) * (1 - Math.exp(-4 * dt));
  }

  function syncMeshes(dt) {
    for (const b of bodies) {
      if (!b.active) continue;
      b.mesh.position.copy(b.p);
      const speed = b.v.length();
      if (b.type === "mark") {
        // logo tetap menghadap kamera, cuma bergoyang
        b.mesh.rotation.set(
          Math.sin(time * 0.6 + b.phase) * 0.2 - b.v.y * 0.03,
          Math.sin(time * 0.45 + b.phase * 2) * 0.32 + b.v.x * 0.03,
          Math.sin(time * 0.35 + b.phase) * 0.12,
        );
      } else {
        b.mesh.rotateOnWorldAxis(b.axis, (b.spin + speed * 0.3) * dt);
      }
    }
  }

  // Ukuran
  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    // layar lebar → gugusan ikut melebar; kamera menjaga semuanya tetap muat
    const stretch = THREE.MathUtils.clamp(aspect / 1.5, 1, 1.8);
    attractX = ATTRACT / (stretch * stretch);
    const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.userData.baseZ = 4.3 / (halfTan * Math.min(1, aspect / 1.15));
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // Loop
  let running = false;
  let last = 0;
  let accumulator = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000 || 0, 1 / 20);
    last = now;
    time += dt;

    if (started) {
      const elapsed = time - startTime;
      for (const b of bodies) {
        if (!b.active && elapsed >= b.delay) {
          b.active = true;
          b.mesh.visible = true;
        }
      }
      updatePointer(dt);
      accumulator += dt;
      let steps = 0;
      while (accumulator >= STEP && steps < 4) {
        step(STEP);
        accumulator -= STEP;
        steps++;
      }
      if (steps === 4) accumulator = 0;
      syncMeshes(dt);
    }

    // kamera sedikit mengikuti kursor
    const camX = pointer.inside ? pointer.ndc.x * 0.9 : 0;
    const camY = pointer.inside ? pointer.ndc.y * 0.5 : 0;
    const k = 1 - Math.exp(-3 * dt);
    camera.position.x += (camX - camera.position.x) * k;
    camera.position.y += (camY - camera.position.y) * k;
    camera.position.z = camera.userData.baseZ;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function setActive(active) {
    if (active === running) return;
    running = active;
    if (active) {
      last = performance.now();
      renderer.setAnimationLoop(frame);
    } else {
      renderer.setAnimationLoop(null);
    }
  }

  /** Mulai animasi masuk: benda beterbangan dari luar lalu berkumpul di tengah. */
  function intro() {
    if (started) return;
    started = true;
    startTime = time;
    if (reduceMotion) {
      // langsung ke posisi akhir tanpa animasi terbang
      for (const b of bodies) {
        b.active = true;
        b.mesh.visible = true;
      }
      for (let i = 0; i < 360; i++) step(STEP);
      syncMeshes(0);
    }
  }

  function dispose() {
    setActive(false);
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerGone);
    document.removeEventListener("pointerleave", onPointerGone);
    Object.values(geometries).forEach((g) => g.dispose());
    Object.values(materials).forEach((mat) => mat.dispose());
    envTarget.dispose();
    renderer.dispose();
    renderer.forceContextLoss(); // lepas konteks WebGL saat pindah halaman
  }

  // compile shader lebih dulu supaya tidak tersendat saat splash selesai
  for (const b of bodies) {
    b.mesh.position.copy(b.p);
    b.mesh.visible = true;
  }
  renderer.compile(scene, camera);
  for (const b of bodies) b.mesh.visible = false;
  renderer.render(scene, camera);

  return { intro, setActive, dispose };
}
