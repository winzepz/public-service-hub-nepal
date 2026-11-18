"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { pick, toLocaleDigits } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { CENTRAL_OFFICES, KATHMANDU, LOCAL_SERVICES, PROVINCES } from "@/data/provinces";
import geo from "@/data/nepal-provinces.json";
import { ResetIcon } from "./Icons";

type Ring = [number, number][];
type GeoProvince = { id: number; rings: Ring[] };

const CENTER: [number, number] = [84.12, 28.39];
const KX = Math.cos((28.4 * Math.PI) / 180);
const project = ([lng, lat]: [number, number]): [number, number] => [(lng - CENTER[0]) * KX, lat - CENTER[1]];

const BASE_DEPTH = 0.16;
const LIFT = 0.32;

const COLORS = {
  cap: 0xffffff,
  side: 0xd6d6cf,
  hoverCap: 0xe2e8f5,
  activeCap: 0x003893,
  activeSide: 0x00256b,
  edge: 0x15171c,
  edgeActive: 0xffffff,
  red: 0xc41230,
  ink: 0x15171c,
};

const ringCentroid = (ring: Ring): [number, number] => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    const f = x1 * y2 - x2 * y1;
    a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f;
  }
  a *= 0.5;
  return a === 0 ? ring[0] : [cx / (6 * a), cy / (6 * a)];
};

const largestRing = (rings: Ring[]) =>
  rings.reduce((best, r) => (r.length > best.length ? r : best), rings[0]);

type Props = { locale: Locale; dict: Dictionary; serviceTitles: Record<string, string> };

export const MapExplorer = ({ locale, dict, serviceTitles }: Props) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ktmLabelRef = useRef<HTMLSpanElement>(null);
  const selectedRef = useRef<number | null>(3);
  const resetRef = useRef<() => void>(() => {});
  const [selected, setSelected] = useState<number | null>(3);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const select = useCallback((id: number) => {
    selectedRef.current = id;
    setSelected(id);
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      } catch {
        setStatus("error");
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0xf6f6f3, 1);
      stage.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-hidden", "true");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      scene.add(new THREE.AmbientLight(0xffffff, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 1.4);
      sun.position.set(-3, 8, 5);
      scene.add(sun);

      const map = new THREE.Group();
      map.rotation.x = -Math.PI / 2;
      scene.add(map);

      type Entry = {
        id: number;
        group: import("three").Group;
        mesh: import("three").Mesh;
        cap: import("three").MeshLambertMaterial;
        side: import("three").MeshLambertMaterial;
        edge: import("three").LineBasicMaterial;
        anchor: import("three").Vector3;
      };
      const entries: Entry[] = [];
      const disposables: { dispose: () => void }[] = [];

      (geo as GeoProvince[]).forEach((p) => {
        const group = new THREE.Group();
        const cap = new THREE.MeshLambertMaterial({ color: COLORS.cap });
        const side = new THREE.MeshLambertMaterial({ color: COLORS.side });
        const edge = new THREE.LineBasicMaterial({ color: COLORS.edge });
        disposables.push(cap, side, edge);

        const shapes = p.rings.map((ring) => {
          const pts = ring.map((pt) => new THREE.Vector2(...project(pt)));
          return new THREE.Shape(pts);
        });
        const geom = new THREE.ExtrudeGeometry(shapes, { depth: BASE_DEPTH, bevelEnabled: false });
        disposables.push(geom);
        const mesh = new THREE.Mesh(geom, [cap, side]);
        mesh.userData.provinceId = p.id;
        group.add(mesh);

        p.rings.forEach((ring) => {
          const pts = ring.map((pt) => {
            const [x, y] = project(pt);
            return new THREE.Vector3(x, y, BASE_DEPTH + 0.002);
          });
          const lg = new THREE.BufferGeometry().setFromPoints(pts);
          disposables.push(lg);
          group.add(new THREE.LineLoop(lg, edge));
        });

        const [cx, cy] = project(ringCentroid(largestRing(p.rings)));
        const anchor = new THREE.Vector3(cx, cy, BASE_DEPTH);

        const meta = PROVINCES.find((x) => x.id === p.id);
        if (meta) {
          const [px, py] = project(meta.capitalLngLat);
          const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8),
            new THREE.MeshLambertMaterial({ color: COLORS.ink })
          );
          stem.rotation.x = Math.PI / 2;
          stem.position.set(px, py, BASE_DEPTH + 0.13);
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshLambertMaterial({ color: COLORS.ink }));
          head.position.set(px, py, BASE_DEPTH + 0.27);
          group.add(stem, head);
          disposables.push(stem.geometry, head.geometry, stem.material as import("three").Material, head.material as import("three").Material);
        }

        map.add(group);
        entries.push({ id: p.id, group, mesh, cap, side, edge, anchor });
      });

      // Kathmandu: federal capital and central offices
      const [kx, ky] = project(KATHMANDU);
      const ktmGroup = entries.find((e) => e.id === 3)!.group;
      const ktmStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), new THREE.MeshLambertMaterial({ color: COLORS.red }));
      ktmStem.rotation.x = Math.PI / 2;
      ktmStem.position.set(kx, ky, BASE_DEPTH + 0.25);
      const ktmHead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), new THREE.MeshLambertMaterial({ color: COLORS.red }));
      ktmHead.position.set(kx, ky, BASE_DEPTH + 0.52);
      ktmGroup.add(ktmStem, ktmHead);
      disposables.push(ktmStem.geometry, ktmHead.geometry, ktmStem.material as import("three").Material, ktmHead.material as import("three").Material);
      const ktmAnchor = new THREE.Vector3(kx, ky, BASE_DEPTH + 0.6);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = !reduceMotion;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = 1.25;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 0.8;

      let defaultDistance = 9;
      const placeCamera = () => {
        const polar = 0.78;
        const azimuth = 0;
        camera.position.set(
          defaultDistance * Math.sin(polar) * Math.sin(azimuth),
          defaultDistance * Math.cos(polar),
          defaultDistance * Math.sin(polar) * Math.cos(azimuth)
        );
        controls.target.set(0, 0, 0.15);
        controls.update();
      };

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = stage;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const halfH = Math.tan((camera.fov * Math.PI) / 360);
        const fit = camera.aspect < 1.2 ? 4.6 : 3.75;
        defaultDistance = Math.max(5.2, fit / (halfH * camera.aspect));
        controls.minDistance = defaultDistance * 0.45;
        controls.maxDistance = defaultDistance * 1.6;
        camera.updateProjectionMatrix();
      };
      resize();
      placeCamera();
      resetRef.current = placeCamera;

      const ro = new ResizeObserver(() => resize());
      ro.observe(stage);

      // Picking
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let hovered: number | null = null;
      let downAt: { x: number; y: number } | null = null;
      const meshes = entries.map((e) => e.mesh);

      const pickAt = (clientX: number, clientY: number) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        return hit ? (hit.object.userData.provinceId as number) : null;
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        hovered = pickAt(e.clientX, e.clientY);
        renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
      };
      const onDown = (e: PointerEvent) => (downAt = { x: e.clientX, y: e.clientY });
      const onUp = (e: PointerEvent) => {
        if (!downAt) return;
        const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
        downAt = null;
        if (moved > 6) return;
        const id = pickAt(e.clientX, e.clientY);
        if (id) select(id);
      };
      const onLeave = () => (hovered = null);
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerup", onUp);
      renderer.domElement.addEventListener("pointerleave", onLeave);

      // Keyboard orbit on the focusable stage
      const onKey = (e: KeyboardEvent) => {
        const step = 0.12;
        const offset = camera.position.clone().sub(controls.target);
        const sph = new THREE.Spherical().setFromVector3(offset);
        if (e.key === "ArrowLeft") sph.theta -= step;
        else if (e.key === "ArrowRight") sph.theta += step;
        else if (e.key === "ArrowUp") sph.phi = Math.max(controls.minPolarAngle, sph.phi - step);
        else if (e.key === "ArrowDown") sph.phi = Math.min(controls.maxPolarAngle, sph.phi + step);
        else if (e.key === "+" || e.key === "=") sph.radius = Math.max(controls.minDistance, sph.radius * 0.9);
        else if (e.key === "-" || e.key === "_") sph.radius = Math.min(controls.maxDistance, sph.radius * 1.1);
        else return;
        e.preventDefault();
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));
        controls.update();
      };
      stage.addEventListener("keydown", onKey);

      // Render loop, paused while off-screen
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(stage);

      const tmp = new THREE.Vector3();
      const placeLabel = (el: HTMLElement | null, world: import("three").Vector3) => {
        if (!el) return;
        tmp.copy(world).project(camera);
        const x = (tmp.x * 0.5 + 0.5) * stage.clientWidth;
        const y = (-tmp.y * 0.5 + 0.5) * stage.clientHeight;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        el.style.visibility = tmp.z < 1 ? "visible" : "hidden";
      };

      let raf = 0;
      const world = new THREE.Vector3();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        controls.update();
        const sel = selectedRef.current;
        entries.forEach((e, i) => {
          const isSel = e.id === sel;
          const target = isSel ? LIFT : 0;
          e.group.position.z = reduceMotion ? target : e.group.position.z + (target - e.group.position.z) * 0.14;
          e.cap.color.setHex(isSel ? COLORS.activeCap : e.id === hovered ? COLORS.hoverCap : COLORS.cap);
          e.side.color.setHex(isSel ? COLORS.activeSide : COLORS.side);
          e.edge.color.setHex(isSel ? COLORS.edgeActive : COLORS.edge);
          world.copy(e.anchor);
          world.z += e.group.position.z;
          placeLabel(labelRefs.current[i], map.localToWorld(world.clone()));
        });
        const ktm = entries.find((e) => e.id === 3)!;
        world.copy(ktmAnchor);
        world.z += ktm.group.position.z;
        placeLabel(ktmLabelRef.current, map.localToWorld(world.clone()));
        renderer.render(scene, camera);
      };
      tick();
      setStatus("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        stage.removeEventListener("keydown", onKey);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("pointerleave", onLeave);
        controls.dispose();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => setStatus("error"));

    return () => {
      disposed = true;
      cleanup();
    };
  }, [select]);

  const province = PROVINCES.find((p) => p.id === selected) ?? null;
  const geoOrder = (geo as GeoProvince[]).map((g) => g.id);

  return (
    <div className="map-layout">
      <div>
        <div
          ref={stageRef}
          className="map-stage"
          tabIndex={0}
          role="group"
          aria-roledescription={locale === "ne" ? "३D नक्सा" : "3D map"}
          aria-label={dict.mapTitle}
          aria-describedby="map-hint"
        >
          {status !== "ready" && (
            <div className="map-status" role="status">
              {status === "loading" ? dict.mapLoading : dict.mapFallback}
            </div>
          )}
          <div className="map-labels" aria-hidden="true">
            {geoOrder.map((id, i) => {
              const p = PROVINCES.find((x) => x.id === id)!;
              return (
                <span
                  key={id}
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className={`map-label${selected === id ? " is-active" : ""}`}
                  style={{ visibility: "hidden" }}
                >
                  {pick(p.name, locale)}
                </span>
              );
            })}
            <span ref={ktmLabelRef} className="map-label is-pin" style={{ visibility: "hidden", marginTop: -14 }}>
              {locale === "ne" ? "काठमाडौं" : "Kathmandu"}
            </span>
          </div>
          {status === "ready" && (
            <div className="map-controls">
              <button type="button" className="tool-btn" onClick={() => resetRef.current()}>
                <ResetIcon />
                <span>{dict.resetView}</span>
              </button>
            </div>
          )}
          <div className="map-legend" aria-hidden="true">
            <span><i style={{ background: "var(--red)", borderRadius: "50%" }} />{dict.mapLegendOffice}</span>
            <span><i style={{ background: "var(--ink)", borderRadius: "50%" }} />{dict.capital}</span>
          </div>
        </div>
        <p id="map-hint" style={{ fontSize: "0.875rem", color: "var(--ink-3)", marginTop: 8 }}>
          {dict.keyboardMapHint}
        </p>
        <h2 style={{ fontSize: "1.125rem", marginTop: 20 }}>{dict.provinces}</h2>
        <ul className="province-list">
          {PROVINCES.map((p) => (
            <li key={p.id}>
              <button type="button" aria-pressed={selected === p.id} onClick={() => select(p.id)} aria-controls="province-detail">
                <span style={{ fontWeight: 600 }}>{pick(p.name, locale)}</span>
                <small>
                  {toLocaleDigits(p.districts.length, locale)} {dict.districts}
                </small>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <aside id="province-detail" className="panel province-detail" aria-live="polite">
        {province && (
          <>
            <h2>
              {locale === "ne" ? `${pick(province.name, locale)} प्रदेश` : `${pick(province.name, locale)} Province`}
            </h2>
            <p className="sub">
              {dict.capital}: <strong>{pick(province.capital, locale)}</strong> · {toLocaleDigits(province.districts.length, locale)} {dict.districts}
            </p>

            <h3>{dict.offices}</h3>
            {province.id === 3 ? (
              <ul className="office-list">
                {CENTRAL_OFFICES.map((o) => (
                  <li key={o.name.en}>
                    <strong>{pick(o.name, locale)}</strong>
                    <span>{pick(o.area, locale)}</span>
                    <div>
                      {o.serviceSlugs.slice(0, 2).map((s, i) => (
                        <span key={s}>
                          {i > 0 && " · "}
                          <Link href={`/${locale}/services/${s}/`}>{serviceTitles[s]}</Link>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)" }}>{dict.noOffices}</p>
            )}

            <h3>{locale === "ne" ? "प्रत्येक जिल्लामा" : "In every district"}</h3>
            <ul className="office-list">
              {LOCAL_SERVICES.map((o) => (
                <li key={o.office.en}>
                  <strong>{pick(o.office, locale)}</strong>
                  <div>
                    {o.serviceSlugs.map((s, i) => (
                      <span key={s}>
                        {i > 0 && " · "}
                        <Link href={`/${locale}/services/${s}/`}>{serviceTitles[s]}</Link>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <h3>{dict.districts}</h3>
            <ul className="district-list">
              {province.districts.map((d) => (
                <li key={d.en}>{pick(d, locale)}</li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
};
