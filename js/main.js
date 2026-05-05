/* --- Year in footer --- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* --- Scroll-reveal --- */
const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("in-view"));
}

/* --- Active nav on scroll --- */
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sectionRefs = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return null;
    const section = document.querySelector(id);
    return section ? { link, section } : null;
  })
  .filter(Boolean);

function setActiveNav() {
  const scrollY = window.scrollY;
  let activeId = "#home";
  for (const item of sectionRefs) {
    if (item.section.offsetTop - 120 <= scrollY) {
      activeId = `#${item.section.id}`;
    }
  }
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeId);
  });
}

setActiveNav();
window.addEventListener("scroll", setActiveNav, { passive: true });

/* --- Publication filters --- */
const filterButtons = Array.from(document.querySelectorAll(".filter"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectCount = document.getElementById("project-count");

function applyFilter(kind) {
  let visible = 0;
  for (const card of projectCards) {
    const kinds = (card.getAttribute("data-kind") || "").split(/\s+/);
    const isMatch = kind === "all" || kinds.includes(kind);
    card.classList.toggle("is-hidden", !isMatch);
    if (isMatch) visible += 1;
  }
  if (projectCount) {
    projectCount.textContent = String(visible);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilter(button.getAttribute("data-filter") || "all");
  });
});

applyFilter("all");

/* --- Card expand/collapse --- */
const toggleButtons = Array.from(document.querySelectorAll(".card-toggle"));

function collapseAllCards(exceptCard = null) {
  for (const card of projectCards) {
    if (card === exceptCard) continue;
    card.classList.remove("expanded");
    const button = card.querySelector(".card-toggle");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Abstract";
    }
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const card = button.closest(".project-card");
    if (!card) return;
    const willExpand = !card.classList.contains("expanded");
    collapseAllCards(willExpand ? card : null);
    card.classList.toggle("expanded", willExpand);
    button.setAttribute("aria-expanded", String(willExpand));
    button.textContent = willExpand ? "Collapse" : "Abstract";
  });
});

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target.closest("button")) return;
    const button = card.querySelector(".card-toggle");
    if (button) button.click();
  });
});

/* --- 3D tilt effect on cards --- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer:fine)").matches;

function attachTilt(selector, maxTilt = 4) {
  if (!finePointer || prefersReducedMotion) return;
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * maxTilt * 2;
      const rx = (0.5 - py) * maxTilt * 2;
      node.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      node.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    });
    node.addEventListener("pointerleave", () => {
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    });
  });
}

attachTilt(".project-card", 3.5);
attachTilt(".skill-card", 3);

/* --- Interactive point cloud background --- */
function initPointCloudLab() {
  const canvas = document.getElementById("pointcloud-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reducedMotion = prefersReducedMotion;

  const shapeButtons = Array.from(document.querySelectorAll(".shape-btn"));
  const pointCountEl = document.getElementById("point-count");
  const shapeLabelEl = document.getElementById("shape-label");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let centerX = 0;
  let centerY = 0;

  let rotX = 0.75;
  let rotY = 0.22;
  let targetRotX = rotX;
  let targetRotY = rotY;
  let zoom = 560;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pointerBiasX = 0;
  let pointerBiasY = 0;

  let activeShape = "knot";
  let points = [];
  let targets = [];
  let motionVectors = [];
  let pointCount = 2800;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function ensureMotionVectors(count) {
    if (motionVectors.length === count) return;
    motionVectors = Array.from({ length: count }, () => {
      const theta = rand(0, Math.PI * 2);
      const phi = Math.acos(rand(-1, 1));
      const vx = Math.sin(phi) * Math.cos(theta);
      const vy = Math.cos(phi);
      const vz = Math.sin(phi) * Math.sin(theta);
      return {
        vx, vy, vz,
        phase: rand(0, Math.PI * 2),
        speed: rand(0.55, 1.45),
        amp: rand(2.4, 8.5)
      };
    });
  }

  function generateShape(shape, count) {
    const out = [];

    if (shape === "knot") {
      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 2;
        const tube = rand(0.12, 0.34);
        const a = rand(0, Math.PI * 2);
        const cx = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
        const cy = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
        const cz = Math.sin(3 * t);
        out.push({
          x: (cx + tube * Math.cos(a) * Math.cos(t)) * 124,
          y: (cy + tube * Math.cos(a) * Math.sin(t)) * 124,
          z: (cz + tube * Math.sin(a)) * 196
        });
      }
      return out;
    }

    if (shape === "gyroid") {
      let tries = 0;
      while (out.length < count && tries < count * 40) {
        const x = rand(-Math.PI, Math.PI);
        const y = rand(-Math.PI, Math.PI);
        const z = rand(-Math.PI, Math.PI);
        const g =
          Math.sin(x) * Math.cos(y) +
          Math.sin(y) * Math.cos(z) +
          Math.sin(z) * Math.cos(x);
        if (Math.abs(g) < 0.22) {
          out.push({ x: x * 128, y: y * 102, z: z * 128 });
        }
        tries += 1;
      }
      while (out.length < count) {
        const theta = rand(0, Math.PI * 2);
        const phi = rand(0, Math.PI * 2);
        const r = 220 + 44 * Math.sin(3 * theta + phi);
        out.push({
          x: r * Math.cos(theta) * Math.cos(phi),
          y: (r * 0.52) * Math.sin(phi),
          z: r * Math.sin(theta) * Math.cos(phi)
        });
      }
      return out;
    }

    if (shape === "sphere") {
      for (let i = 0; i < count; i += 1) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 280 + rand(-24, 24);
        out.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi)
        });
      }
      return out;
    }

    if (shape === "helix") {
      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 16;
        const strand = i % 2 === 0 ? -1 : 1;
        const r = 170 + 72 * Math.cos(3 * t);
        out.push({
          x: (r + strand * 28) * Math.cos(t),
          y: (i / count - 0.5) * 540 + strand * 24 * Math.sin(1.4 * t),
          z: (r + strand * 28) * Math.sin(t)
        });
      }
      return out;
    }

    // default torus
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 10;
      const p = (i / count) * Math.PI * 2;
      const R = 260;
      const r = 96 + 18 * Math.sin(4 * t);
      out.push({
        x: (R + r * Math.cos(t)) * Math.cos(p),
        y: r * Math.sin(t) * 1.2,
        z: (R + r * Math.cos(t)) * Math.sin(p)
      });
    }
    return out;
  }

  function resetPoints(shape) {
    targets = generateShape(shape, pointCount);
    ensureMotionVectors(pointCount);
    if (!points.length) {
      points = targets.map((p) => ({ ...p }));
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const horizontalBias = width > 1100 ? 0.64 : width > 760 ? 0.6 : 0.56;
    centerX = width * horizontalBias;
    centerY = height * 0.48;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function projectPoint(point) {
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);
    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);
    const x1 = point.x * cy - point.z * sy;
    const z1 = point.x * sy + point.z * cy;
    const y2 = point.y * cx - z1 * sx;
    const z2 = point.y * sx + z1 * cx;
    const perspective = zoom / (zoom + z2 + 220);
    return {
      x: centerX + x1 * perspective,
      y: centerY + y2 * perspective,
      depth: z2,
      p: perspective
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const time = performance.now() * 0.001;

    const biasX = reducedMotion ? 0 : pointerBiasX * 0.26;
    const biasY = reducedMotion ? 0 : pointerBiasY * 0.2;
    const autoPitch = reducedMotion ? 0 : Math.sin(time * 0.42) * 0.14;

    rotX += (targetRotX + biasY + autoPitch - rotX) * 0.075;
    rotY += (targetRotY + biasX - rotY) * 0.075;
    if (!reducedMotion && !dragging) {
      targetRotY += 0.00155;
    }

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const t = targets[i];
      const lerp = reducedMotion ? 0.035 : 0.06;
      p.x += (t.x - p.x) * lerp;
      p.y += (t.y - p.y) * lerp;
      p.z += (t.z - p.z) * lerp;
    }

    const projected = points.map((point, index) => {
      const motion = motionVectors[index];
      const pulse = Math.sin(time * motion.speed + motion.phase) * motion.amp;
      const drift = Math.cos(time * 0.5 + motion.phase * 0.8) * (motion.amp * 0.45);
      return projectPoint({
        x: point.x + motion.vx * pulse + motion.vz * drift,
        y: point.y + motion.vy * pulse + motion.vx * drift * 0.6,
        z: point.z + motion.vz * pulse + motion.vy * drift
      });
    });
    projected.sort((a, b) => a.depth - b.depth);

    for (const p of projected) {
      const depthNorm = Math.max(0, Math.min(1, (p.depth + 240) / 480));
      const alpha = 0.12 + depthNorm * 0.33;
      const size = 0.85 + depthNorm * 2.3;
      const tone = 112 + depthNorm * 46;
      ctx.fillStyle = `rgba(${tone.toFixed(0)}, ${(tone + 22).toFixed(0)}, ${(tone + 36).toFixed(0)}, ${alpha.toFixed(3)})`;
      ctx.fillRect(p.x, p.y, size, size);
    }

    requestAnimationFrame(draw);
  }

  function isInteractiveTarget(target) {
    return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, label"));
  }

  window.addEventListener("pointerdown", (event) => {
    if (!finePointer) return;
    if (isInteractiveTarget(event.target)) return;
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  window.addEventListener("pointermove", (event) => {
    if (finePointer) {
      pointerBiasX = event.clientX / Math.max(1, width) - 0.5;
      pointerBiasY = event.clientY / Math.max(1, height) - 0.5;
    }
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    targetRotY += dx * 0.0033;
    targetRotX += dy * 0.0033;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  window.addEventListener("pointerup", () => { dragging = false; });
  window.addEventListener("pointercancel", () => { dragging = false; });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!event.altKey) return;
      event.preventDefault();
      zoom += event.deltaY * 0.12;
      zoom = Math.max(340, Math.min(820, zoom));
    },
    { passive: false }
  );

  shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const shape = button.getAttribute("data-shape");
      if (!shape || shape === activeShape) return;
      activeShape = shape;
      shapeButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      resetPoints(shape);
      if (shapeLabelEl) {
        shapeLabelEl.textContent = `Shape: ${shape.charAt(0).toUpperCase()}${shape.slice(1)}`;
      }
    });
  });

  if (pointCountEl) {
    pointCountEl.textContent = `Points: ${pointCount}`;
  }

  resetPoints(activeShape);
  resize();
  window.addEventListener("resize", resize);
  draw();
}

initPointCloudLab();
