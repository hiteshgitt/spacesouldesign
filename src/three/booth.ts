import * as THREE from "three";

/**
 * Procedural exhibition-booth generator.
 *
 * One model, three readings:
 *   state 0 → BLUEPRINT  (hidden faces, luminous linework on cobalt)
 *   state 1 → CONCEPT    (white massing model, soft daylight)
 *   state 2 → REALITY    (materials, light, the dark exhibition hall)
 *
 * `setState(t)` interpolates continuously between them so GSAP can tween a
 * single number. Used by the hero, the blueprint showcase and the offline
 * render pipeline (`/dev/render` + `npm run renders`).
 */

export type Role =
  | "hall"
  | "base"
  | "mass"
  | "panel"
  | "wood"
  | "metal"
  | "accent"
  | "light"
  | "screen"
  | "glass"
  | "figure";

type Look = { color: string; rough: number; metal: number; emissive?: string; ei?: number; opacity?: number };

const REALITY: Record<Role, Look> = {
  hall: { color: "#07081c", rough: 0.55, metal: 0.2 },
  base: { color: "#d9d3c9", rough: 0.6, metal: 0 },
  mass: { color: "#2a2b33", rough: 0.42, metal: 0.2 },
  panel: { color: "#ece8e0", rough: 0.75, metal: 0 },
  wood: { color: "#9b7754", rough: 0.55, metal: 0 },
  metal: { color: "#9a9ca3", rough: 0.28, metal: 0.9 },
  accent: { color: "#2f3dff", rough: 0.35, metal: 0.1, emissive: "#2f3dff", ei: 0.35 },
  light: { color: "#fff6e8", rough: 0.4, metal: 0, emissive: "#ffe6c4", ei: 1.6 },
  screen: { color: "#0d1240", rough: 0.2, metal: 0, emissive: "#4a58ff", ei: 1.5 },
  glass: { color: "#cfe0ff", rough: 0.05, metal: 0, opacity: 0.16 },
  figure: { color: "#3a3b42", rough: 0.9, metal: 0 },
};

const CONCEPT: Record<Role, Look> = {
  hall: { color: "#d5d1ca", rough: 1, metal: 0 },
  base: { color: "#e6e3de", rough: 0.9, metal: 0 },
  mass: { color: "#efede9", rough: 0.9, metal: 0 },
  panel: { color: "#f4f2ee", rough: 0.9, metal: 0 },
  wood: { color: "#e3ddd3", rough: 0.9, metal: 0 },
  metal: { color: "#dcdcdc", rough: 0.8, metal: 0 },
  accent: { color: "#c9ccff", rough: 0.9, metal: 0 },
  light: { color: "#ffffff", rough: 0.9, metal: 0, emissive: "#ffffff", ei: 0.15 },
  screen: { color: "#d4d6e6", rough: 0.9, metal: 0 },
  glass: { color: "#ffffff", rough: 0.2, metal: 0, opacity: 0.25 },
  figure: { color: "#b9b6b0", rough: 1, metal: 0 },
};

export const BACKGROUND = {
  blueprint: new THREE.Color("#0c1a78"),
  concept: new THREE.Color("#e2dfd9"),
  reality: new THREE.Color("#04051a"),
};

export type Palette = Partial<Record<Role, string>>;

interface Part {
  mesh: THREE.Mesh;
  role: Role;
}

class Builder {
  group = new THREE.Group();
  parts: Part[] = [];

  add(geo: THREE.BufferGeometry, role: Role, x: number, y: number, z: number, ry = 0) {
    const mesh = new THREE.Mesh(geo);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    mesh.userData.role = role;
    mesh.castShadow = role !== "glass" && role !== "hall";
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.parts.push({ mesh, role });
    return mesh;
  }

  /** Box resting on `y` (bottom face). */
  box(role: Role, w: number, h: number, d: number, x: number, y: number, z: number, ry = 0) {
    return this.add(new THREE.BoxGeometry(w, h, d), role, x, y + h / 2, z, ry);
  }

  cyl(role: Role, r: number, h: number, x: number, y: number, z: number, seg = 40, rTop = r) {
    return this.add(new THREE.CylinderGeometry(rTop, r, h, seg), role, x, y + h / 2, z);
  }

  figure(x: number, z: number, ry = 0, s = 1) {
    const body = this.add(new THREE.CapsuleGeometry(0.2 * s, 0.95 * s, 4, 10), "figure", x, 0.68 * s, z, ry);
    const head = this.add(new THREE.SphereGeometry(0.12 * s, 14, 10), "figure", x, 1.6 * s, z);
    body.userData.noEdges = head.userData.noEdges = true;
  }
}

export interface BoothModel {
  group: THREE.Group;
  /** Booth extents, used to frame cameras. */
  size: THREE.Vector3;
  center: THREE.Vector3;
  /** 0 blueprint · 1 concept · 2 reality */
  setState: (t: number) => void;
  /** Animate assembly: 0 = parts lifted/scattered, 1 = assembled. */
  setAssembly: (p: number) => void;
  dispose: () => void;
}

export interface Preset {
  /** Azimuth (deg) of the hero three-quarter view. */
  az: number;
  palette?: Palette;
  /** Camera target height multiplier. */
  detail: { target: [number, number, number]; from: [number, number, number] };
  build: (b: Builder) => void;
}

/* ─────────────────────────── Presets ─────────────────────────── */

const monolith: Preset = {
  az: 34,
  detail: { target: [-1.6, 2.0, 1.4], from: [3.4, 1.7, 7.4] },
  build(b) {
    b.box("base", 12, 0.12, 9, 0, 0, 0);
    const y0 = 0.12;
    // The split monolith
    b.box("mass", 3.6, 4.4, 4.6, -2.4, y0, -0.9);
    b.box("mass", 3.6, 4.4, 4.6, 2.4, y0, -0.9);
    b.box("mass", 8.4, 0.5, 4.6, 0, y0 + 4.4, -0.9);
    // Light lining the cut
    b.box("light", 0.06, 4.3, 4.4, -0.58, y0, -0.9);
    b.box("light", 0.06, 4.3, 4.4, 0.58, y0, -0.9);
    b.box("light", 1.1, 0.03, 4.4, 0, y0, -0.9);
    // Display niches on the front face
    b.box("light", 1.2, 1.4, 0.04, -2.4, y0 + 1.1, 1.42);
    b.box("light", 1.2, 1.4, 0.04, 2.4, y0 + 1.1, 1.42);
    b.box("accent", 4.6, 0.32, 0.04, 0, y0 + 4.5, 1.42);
    // Demo counters
    for (const x of [-3.4, 3.4]) {
      b.box("wood", 2, 0.95, 0.75, x, y0, 3.1);
      b.box("screen", 0.7, 0.42, 0.04, x, y0 + 0.95, 3.1);
    }
    // Meeting zone
    b.box("glass", 7.6, 2.6, 0.04, 0, y0, -3.5);
    b.cyl("wood", 0.7, 0.74, 0, y0, -3.95);
    for (const a of [0, 1, 2, 3]) {
      const ang = (a / 4) * Math.PI * 2 + Math.PI / 4;
      b.box("panel", 0.45, 0.46, 0.45, Math.cos(ang) * 1.15, y0, -3.95 + Math.sin(ang) * 0.55);
    }
    // Pylon
    b.box("mass", 0.8, 6.2, 0.8, 5.3, y0, 3.8);
    b.box("accent", 0.82, 0.82, 0.82, 5.3, y0 + 5.2, 3.8);
    b.box("light", 0.04, 4.6, 0.04, 5.72, y0 + 0.2, 4.22);
    // People for scale
    b.figure(-1.2, 3.4, 0.4);
    b.figure(0.2, 2.2, -0.3);
    b.figure(3.4, 3.9, 2.6);
    b.figure(-4.6, 2.2, 1.1);
    b.figure(-0.9, -3.7, 0.2);
  },
};

const folded: Preset = {
  az: 28,
  palette: { base: "#cbbfae", panel: "#eee9e1" },
  detail: { target: [-0.4, 1.7, -2.2], from: [1.6, 1.8, 2.2] },
  build(b) {
    b.box("base", 6, 0.1, 6, 0, 0, 0);
    const y0 = 0.1;
    const fold = 0.22;
    for (let i = 0; i < 6; i++) {
      const role: Role = i === 1 || i === 4 ? "light" : "panel";
      b.box(role, 1.0, 3.4, 0.1, -2.5 + i, y0, -2.85, i % 2 ? fold : -fold);
      b.box(i === 2 ? "light" : "panel", 1.0, 3.4, 0.1, -2.85, y0, -2.5 + i, Math.PI / 2 + (i % 2 ? fold : -fold));
    }
    b.box("screen", 1.6, 0.9, 0.05, 0.5, y0 + 1.3, -2.66);
    b.box("accent", 6.2, 0.3, 0.3, 0, y0 + 3.4, -2.9);
    b.box("accent", 0.3, 0.3, 6.2, -2.9, y0 + 3.4, 0);
    // Counter
    b.box("panel", 2.0, 1.0, 0.65, 1.2, y0, 1.3);
    b.box("wood", 2.1, 0.05, 0.72, 1.2, y0 + 1.0, 1.3);
    for (const x of [0.6, 1.6]) b.cyl("metal", 0.18, 0.75, x, y0, 2.0, 24);
    // Lounge
    b.cyl("wood", 0.45, 0.42, -1.2, y0, 0.2);
    b.box("panel", 0.8, 0.42, 0.8, -1.4, y0, 1.25, 0.3);
    b.box("panel", 0.8, 0.42, 0.8, -0.2, y0, 0.9, -0.4);
    b.figure(0.9, 2.3, 3.0);
    b.figure(-0.6, 1.7, 2.4);
    b.figure(2.4, -0.4, -1.2);
  },
};

const orbit: Preset = {
  az: 22,
  palette: { base: "#e4ded4" },
  detail: { target: [0, 2.6, 0], from: [3.8, 1.6, 4.2] },
  build(b) {
    b.cyl("base", 5, 0.1, 0, 0, 0, 72);
    const y0 = 0.1;
    // Halo
    const halo = b.add(new THREE.TorusGeometry(3.6, 0.2, 18, 120), "metal", 0, 4.6, 0);
    halo.rotation.x = Math.PI / 2;
    const glow = b.add(new THREE.TorusGeometry(3.6, 0.08, 12, 120), "light", 0, 4.36, 0);
    glow.rotation.x = Math.PI / 2;
    halo.userData.noEdges = glow.userData.noEdges = true;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      b.cyl("metal", 0.015, 4, Math.cos(a) * 3.6, 4.6, Math.sin(a) * 3.6, 6);
    }
    // Backdrop arc
    const arc = b.add(
      new THREE.CylinderGeometry(4.85, 4.85, 3.4, 64, 1, true, Math.PI * 0.55, Math.PI * 0.9),
      "mass",
      0,
      y0 + 1.7,
      0,
    );
    (arc.userData as { doubleSide?: boolean }).doubleSide = true;
    // Centre plinth + product
    b.cyl("panel", 0.75, 1.0, 0, y0, 0, 48);
    b.add(new THREE.SphereGeometry(0.36, 32, 20), "accent", 0, y0 + 1.38, 0);
    // Orbiting plinths
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const h = [0.6, 0.9, 1.15][i % 3];
      b.cyl("panel", 0.32, h, Math.cos(a) * 2.5, y0, Math.sin(a) * 2.5, 32);
      b.box("metal", 0.22, 0.22, 0.22, Math.cos(a) * 2.5, y0 + h, Math.sin(a) * 2.5, a);
    }
    // Curved bench
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 0.62 + (i / 8) * Math.PI * 0.76;
      b.box("wood", 0.5, 0.44, 0.9, Math.cos(a) * 4.1, y0, Math.sin(a) * 4.1, -a);
    }
    b.figure(1.6, 3.2, 3.6);
    b.figure(-1.2, 2.6, 2.2);
    b.figure(3.2, 0.9, -1.4);
    b.figure(-3.0, -0.4, 1.0);
    b.figure(0.4, -2.9, 0.4);
    b.figure(2.1, -1.8, -0.8);
  },
};

const corridor: Preset = {
  az: 58,
  palette: { base: "#1c1d24", panel: "#ebe7df" },
  detail: { target: [3.4, 2.0, 0], from: [-3.4, 1.7, 0.8] },
  build(b) {
    b.box("base", 18, 0.1, 6, 0, 0, 0);
    const y0 = 0.1;
    const xs = [-8.2, -5.0, -2.4, -0.3, 1.4, 2.8, 3.95, 4.9];
    xs.forEach((x, i) => {
      const role: Role = i === xs.length - 1 ? "accent" : "panel";
      b.box(role, 0.5, 4.2, 0.35, x, y0, -2.4);
      b.box(role, 0.5, 4.2, 0.35, x, y0, 2.4);
      b.box(role, 0.5, 0.35, 5.15, x, y0 + 4.2, 0);
      if (i % 2 === 1) b.box("screen", 0.05, 1.0, 1.7, x + 0.3, y0 + 1.5, -1.9);
    });
    b.box("light", 17.6, 0.02, 0.06, 0, y0, -2.0);
    b.box("light", 17.6, 0.02, 0.06, 0, y0, 2.0);
    b.box("screen", 0.08, 3.4, 4.6, 8.8, y0, 0);
    b.box("mass", 0.3, 4.6, 6, 9.05, y0, 0);
    b.figure(-6.4, -0.6, Math.PI / 2);
    b.figure(-3.6, 0.7, Math.PI / 2);
    b.figure(0.6, -0.3, Math.PI / 2 + 0.2);
    b.figure(5.8, 0.4, Math.PI / 2);
  },
};

const assembly: Preset = {
  az: 18,
  palette: { panel: "#e9e5dd", base: "#16171d" },
  detail: { target: [3.2, 1.6, -0.6], from: [6.6, 1.5, 4.4] },
  build(b) {
    b.box("base", 14, 0.7, 6, 0, 0, -1);
    b.box("mass", 9, 0.3, 2.2, 0, 0.7, -2.7);
    for (let i = 0; i < 3; i++) b.box("mass", 2.4, 0.233 * (i + 1), 0.4, 0, 0, 2.4 - i * 0.4 + 0.6);
    const y0 = 0.7;
    // Stepped planes framing the screen
    for (const s of [-1, 1]) {
      b.box("panel", 2.6, 6.4, 0.3, s * 5.6, y0, -3.9);
      b.box("panel", 2.0, 5.4, 0.3, s * 4.4, y0, -3.4);
      b.box("panel", 1.4, 4.6, 0.3, s * 3.55, y0, -2.9);
    }
    b.box("screen", 6.4, 3.6, 0.1, 0, y0 + 1.0, -3.7);
    b.box("light", 12.4, 0.18, 0.3, 0, y0 + 6.6, -3.2);
    b.box("accent", 6.4, 0.08, 0.12, 0, y0 + 0.86, -3.66);
    b.box("wood", 0.7, 1.15, 0.5, 4.3, y0, 0.6, -0.3);
    for (const x of [-2.4, -1.2, 0, 1.2]) b.box("panel", 0.55, 0.5, 0.55, x, y0, -0.4);
    b.cyl("wood", 0.32, 0.45, -0.6, y0, 0.5, 24);
    // Audience
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 10; c++) {
        const chair = b.box("mass", 0.5, 0.48, 0.5, -5.4 + c * 1.2, 0, 4.6 + r * 1.3);
        chair.userData.noEdges = true;
      }
    b.figure(-1.2, -0.4, 0.3);
    b.figure(4.3, 0.15, -0.3);
    b.figure(-6.6, 3.6, 0.8);
  },
};

const gallery: Preset = {
  az: 30,
  palette: { base: "#ebe6dd", panel: "#f3f0ea", mass: "#1b1c22" },
  detail: { target: [1.6, 1.3, -0.3], from: [3.2, 1.7, 2.6] },
  build(b) {
    b.box("base", 8, 0.08, 5, 0, 0, 0);
    const y0 = 0.08;
    for (let i = 0; i < 26; i++) b.box("wood", 0.14, 3.4, 0.12, -3.9 + i * 0.312, y0, -2.42);
    b.box("metal", 7.6, 0.06, 0.12, 0, 3.6, -0.6);
    for (const x of [-2.6, -0.6, 1.4, 3.0]) b.cyl("metal", 0.07, 0.24, x, 3.36, -0.6, 16);
    const plinths: [number, number, number, number][] = [
      [-2.8, -1.1, 0.7, 1.15],
      [-1.7, 0.6, 0.6, 0.6],
      [-0.6, -0.9, 0.8, 0.9],
      [0.3, 1.3, 0.55, 0.45],
      [-2.5, 1.6, 0.5, 0.75],
      [2.9, 1.2, 0.6, 0.6],
    ];
    const objs = ["accent", "metal", "mass", "accent", "metal", "mass"] as const;
    plinths.forEach(([x, z, s, h], i) => {
      b.box("panel", s, h, s, x, y0, z);
      const obj = i % 2 ? new THREE.SphereGeometry(s * 0.26, 28, 18) : new THREE.ConeGeometry(s * 0.24, s * 0.6, 28);
      b.add(obj, objs[i], x, y0 + h + (i % 2 ? s * 0.26 : s * 0.3), z);
    });
    // Hero vitrine
    b.box("mass", 1.2, 0.95, 1.2, 1.6, y0, -0.3);
    b.box("glass", 1.2, 1.0, 1.2, 1.6, y0 + 0.95, -0.3);
    b.box("light", 1.1, 0.03, 1.1, 1.6, y0 + 1.92, -0.3);
    b.add(new THREE.TorusKnotGeometry(0.2, 0.06, 90, 12), "accent", 1.6, y0 + 1.42, -0.3).userData.noEdges = true;
    b.figure(-1.0, 2.0, 2.8);
    b.figure(2.6, 0.2, -1.8, 0.98);
  },
};

export const presets: Record<string, Preset> = {
  "monolith-pavilion": monolith,
  "folded-light": folded,
  "orbit-lounge": orbit,
  "tidal-corridor": corridor,
  "the-assembly": assembly,
  "gallery-of-objects": gallery,
};

/* ─────────────────────────── Model ─────────────────────────── */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function buildBooth(slug: string, opts: { hall?: boolean; edgesFor?: "all" | "none" } = {}): BoothModel {
  const preset = presets[slug] ?? monolith;
  const b = new Builder();
  preset.build(b);

  const box = new THREE.Box3().setFromObject(b.group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  if (opts.hall !== false) {
    const hall = b.add(new THREE.PlaneGeometry(400, 400), "hall", 0, -0.001, 0);
    hall.rotation.x = -Math.PI / 2;
    hall.userData.noEdges = true;
  }

  // One material per role (shared), each with a cached concept/reality look.
  const mats = new Map<Role, { mat: THREE.MeshStandardMaterial; c: Look; r: Look }>();
  const ensure = (role: Role) => {
    let m = mats.get(role);
    if (!m) {
      const r = { ...REALITY[role] };
      if (preset.palette?.[role]) r.color = preset.palette[role]!;
      const mat = new THREE.MeshStandardMaterial({ color: r.color, roughness: r.rough, metalness: r.metal });
      m = { mat, c: CONCEPT[role], r };
      mats.set(role, m);
    }
    return m.mat;
  };
  const doubleMat = new Map<Role, THREE.MeshStandardMaterial>();

  const lineMat = new THREE.LineBasicMaterial({ color: "#dfe4ff", transparent: true, depthWrite: false });
  const gridMat = new THREE.LineBasicMaterial({ color: "#7d8cff", transparent: true, depthWrite: false });
  const lines: THREE.LineSegments[] = [];

  for (const { mesh, role } of b.parts) {
    let mat = ensure(role);
    if (mesh.userData.doubleSide) {
      let d = doubleMat.get(role);
      if (!d) {
        d = mat.clone();
        d.side = THREE.DoubleSide;
        doubleMat.set(role, d);
      }
      mat = d;
    }
    mesh.material = mat;
    if (opts.edgesFor !== "none" && !mesh.userData.noEdges) {
      const seg = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), lineMat);
      seg.raycast = () => {};
      mesh.add(seg);
      lines.push(seg);
    }
  }

  // Blueprint grid on the hall floor
  const grid = new THREE.GridHelper(120, 120, "#7d8cff", "#7d8cff");
  grid.material = gridMat;
  grid.position.y = 0.002;
  b.group.add(grid);

  // Rest positions for assembly animation
  const rest = b.parts.map(({ mesh }) => ({
    mesh,
    pos: mesh.position.clone(),
    rotY: mesh.rotation.y,
    seed: Math.random(),
  }));

  const tmpA = new THREE.Color();
  const tmpB = new THREE.Color();

  function setState(t: number) {
    const toConcept = clamp01(t); // 0 → 1
    const toReal = clamp01(t - 1); // 1 → 2
    for (const [role, { mat, c, r }] of mats) {
      tmpA.set(c.color);
      tmpB.set(r.color);
      mat.color.copy(tmpA).lerp(tmpB, toReal);
      mat.roughness = lerp(c.rough, r.rough, toReal);
      mat.metalness = lerp(c.metal, r.metal, toReal);
      const ei = lerp(c.ei ?? 0, r.ei ?? 0, toReal);
      mat.emissive.set(toReal > 0.5 ? (r.emissive ?? "#000") : (c.emissive ?? r.emissive ?? "#000"));
      mat.emissiveIntensity = ei;
      const baseOpacity = lerp(c.opacity ?? 1, r.opacity ?? 1, toReal);
      const opacity = role === "hall" ? toConcept * baseOpacity : lerp(0, baseOpacity, toConcept);
      const transparent = opacity < 0.999;
      if (mat.transparent !== transparent) {
        mat.transparent = transparent;
        mat.needsUpdate = true;
      }
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.5;
      const d = doubleMat.get(role);
      if (d) {
        d.color.copy(mat.color);
        d.roughness = mat.roughness;
        d.metalness = mat.metalness;
        d.emissive.copy(mat.emissive);
        d.emissiveIntensity = mat.emissiveIntensity;
        if (d.transparent !== transparent) {
          d.transparent = transparent;
          d.needsUpdate = true;
        }
        d.opacity = opacity;
        d.depthWrite = mat.depthWrite;
      }
    }
    // Lines: bright on blueprint, faint on concept, gone in reality
    lineMat.opacity = t <= 1 ? lerp(0.95, 0.32, toConcept) : lerp(0.32, 0, toReal);
    lineMat.color.set(t <= 1 ? "#e4e8ff" : "#2a2d3a");
    if (t > 0.5) lineMat.color.set("#4b4f60");
    lines.forEach((l) => (l.visible = lineMat.opacity > 0.01));
    gridMat.opacity = lerp(0.35, 0, toConcept);
    grid.visible = gridMat.opacity > 0.01;
  }

  function setAssembly(p: number) {
    for (const r of rest) {
      const role = r.mesh.userData.role as Role;
      if (role === "hall" || role === "base") continue;
      // stagger: each part lands at its own moment
      const local = clamp01((p - r.seed * 0.55) / 0.45);
      const e = 1 - Math.pow(1 - local, 3);
      r.mesh.position.set(r.pos.x, r.pos.y + (1 - e) * (3 + r.seed * 5), r.pos.z);
      r.mesh.rotation.y = r.rotY + (1 - e) * (r.seed - 0.5) * 0.8;
      r.mesh.visible = local > 0;
    }
  }

  setState(2);

  return {
    group: b.group,
    size,
    center,
    setState,
    setAssembly,
    dispose() {
      b.group.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) o.geometry.dispose();
      });
      mats.forEach(({ mat }) => mat.dispose());
      doubleMat.forEach((m) => m.dispose());
      lineMat.dispose();
      gridMat.dispose();
    },
  };
}

/* ─────────────────────────── Lighting rig ─────────────────────────── */

export interface Rig {
  group: THREE.Group;
  setState: (t: number) => void;
  key: THREE.DirectionalLight;
}

/** Lights that cross-fade from daylight (concept) to dramatic hall light (reality). */
export function createRig(model: BoothModel, shadows = true): Rig {
  const g = new THREE.Group();
  const s = Math.max(model.size.x, model.size.z);

  const hemi = new THREE.HemisphereLight("#ffffff", "#bdb8b0", 1.4);
  g.add(hemi);

  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(s * 0.6, s * 1.2, s * 0.8);
  key.castShadow = shadows;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = sc.bottom = -s * 0.9;
  sc.right = sc.top = s * 0.9;
  sc.near = 0.5;
  sc.far = s * 4;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  g.add(key);

  // Warm overhead spots for the hall
  const spots: THREE.SpotLight[] = [];
  const spotPos: [number, number][] = [
    [-0.28, 0.25],
    [0.28, 0.25],
    [0, -0.2],
  ];
  for (const [fx, fz] of spotPos) {
    const sp = new THREE.SpotLight("#ffe7c7", 0, s * 3, Math.PI / 5, 0.65, 1.2);
    sp.position.set(fx * s, s * 0.95, fz * s + s * 0.15);
    sp.target.position.set(fx * s * 0.6, 0, fz * s * 0.6);
    g.add(sp, sp.target);
    spots.push(sp);
  }
  const rim = new THREE.DirectionalLight("#5a66ff", 0);
  rim.position.set(-s, s * 0.4, -s);
  g.add(rim);

  function setState(t: number) {
    const r = clamp01(t - 1);
    hemi.intensity = lerp(1.5, 0.3, r);
    hemi.color.set("#ffffff");
    hemi.groundColor.set(r > 0.5 ? "#05061a" : "#bdb8b0");
    key.intensity = lerp(2.3, 1.5, r);
    key.color.set(r > 0.5 ? "#ffe9cf" : "#ffffff");
    spots.forEach((sp) => (sp.intensity = lerp(0, 60, r) * (s / 10) ** 2 * 0.6));
    rim.intensity = lerp(0, 2.4, r);
  }
  setState(2);
  return { group: g, setState, key };
}

export function backgroundFor(t: number, out = new THREE.Color()) {
  if (t <= 1) return out.copy(BACKGROUND.blueprint).lerp(BACKGROUND.concept, clamp01(t));
  return out.copy(BACKGROUND.concept).lerp(BACKGROUND.reality, clamp01(t - 1));
}

/* ─────────────────────────── Cameras ─────────────────────────── */

export type Shot = "cover" | "portrait" | "wide" | "detail" | "plan" | "blueprint" | "concept" | "hero";

export const SHOT_SIZE: Record<Exclude<Shot, "hero">, [number, number]> = {
  cover: [2400, 1500],
  portrait: [1200, 1500],
  wide: [2400, 1350],
  detail: [1600, 1600],
  plan: [2000, 1500],
  blueprint: [2400, 1500],
  concept: [2400, 1500],
};

/** Positions a perspective camera for a named shot of a model. */
export function frameShot(cam: THREE.PerspectiveCamera, model: BoothModel, slug: string, shot: Shot) {
  const preset = presets[slug] ?? monolith;
  const R = Math.max(model.size.x, model.size.z) * 0.5;
  const H = model.size.y;
  const deg = THREE.MathUtils.degToRad;
  const target = new THREE.Vector3(model.center.x, H * 0.32, model.center.z);

  const orbit = (az: number, el: number, dist: number, fov: number, ty = target.y) => {
    cam.fov = fov;
    target.y = ty;
    cam.position.set(
      target.x + Math.sin(deg(az)) * Math.cos(deg(el)) * dist,
      target.y + Math.sin(deg(el)) * dist,
      target.z + Math.cos(deg(az)) * Math.cos(deg(el)) * dist,
    );
  };

  switch (shot) {
    case "portrait":
      orbit(preset.az - 28, 12, R * 3.4, 36, H * 0.42);
      break;
    case "wide":
      orbit(preset.az - 22, 5, R * 3.9, 30, 1.7);
      break;
    case "plan":
      orbit(preset.az * 0.3, 58, R * 4.3, 30, 0);
      break;
    case "detail": {
      const { target: t, from } = preset.detail;
      cam.fov = 34;
      target.set(...t);
      cam.position.set(...from);
      break;
    }
    case "hero":
      orbit(preset.az, 16, R * 2.55, 34, H * 0.36);
      break;
    default:
      orbit(preset.az, 20, R * 3.7, 30);
  }
  cam.near = 0.1;
  cam.far = 600;
  cam.lookAt(target);
  cam.updateProjectionMatrix();
  return target;
}
