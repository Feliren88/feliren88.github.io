#!/usr/bin/env python3
"""Generate consulting-grade pipeline diagrams (PNG) for /usecases/ card banners.

Each use case gets a 440x200 (logical) architecture flowchart rendered on the
site's dark canvas with the site's own fonts (Manrope + Space Grotesk), then
rasterised at 3x via Playwright/Chromium to assets/img/usecases/<id>.png
(1320x600).

Faithfulness rule: every node, metric, and edge below is sourced from the
corresponding entry in _data/usecases.yml — no invented numbers.

Usage:
    python3 scripts/generate_uc_banners.py [--only id1,id2] [--keep-svg]

Requires: playwright (pip) + a Chromium build (path via $UC_BANNER_CHROMIUM,
default /opt/pw-browsers/chromium), Pillow optional for PNG optimisation.
"""

import argparse
import html
import os
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO, "assets", "img", "usecases")
CHROMIUM = os.environ.get("UC_BANNER_CHROMIUM", "/opt/pw-browsers/chromium")

# ---------------------------------------------------------------- canvas ----
W, H = 440, 200              # logical units; PNG is 3x -> 1320x600
SCALE = 3
MARGIN = 14.0
COL_GAP = 18.0
BODY_TOP, BODY_BOT = 46.0, 178.0
CHIP_ROW_Y = 182.0           # KPI chips band (bottom-left)

INK = "#dbe4f2"              # node titles
MUTED = "#8b9db5"            # subs / secondary
FAINT = "#5d7691"            # eyebrow
LANE = "#54687f"             # lane labels
ACCENT = "#7792af"
ARROW = "#5a7190"
ARROW_HEAD = "#6c86a6"
BG = "#0b121c"
NODE_FILL = "#111c2c"
INPUT_FILL = "#0d1725"
NODE_STROKE = "rgba(119,146,175,0.30)"
INPUT_STROKE = "rgba(139,157,181,0.32)"
RULE = "rgba(114,130,152,0.18)"

TITLE_FS, TITLE_LH = 9.3, 11.2   # Space Grotesk 600
SUB_FS, SUB_LH = 7.8, 9.4        # Manrope 500
PAD_X = 6.5

# Approximate per-glyph advance widths (em) for width estimation. Values are
# tuned against rendered output; the overflow check keeps them honest.
_W_NARROW = set("ijl.,·:;'|!()[] ")
_W_THIN = set("ftr-/")
_W_WIDE = set("mwMW@")
_W_CAPS = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
_W_DIGIT = set("0123456789")


def text_w(s, fs, title=False):
    total = 0.0
    for ch in s:
        if ch in _W_NARROW:
            w = 0.30
        elif ch in _W_THIN:
            w = 0.40
        elif ch in _W_WIDE:
            w = 0.88
        elif ch in _W_CAPS:
            w = 0.68
        elif ch in _W_DIGIT:
            w = 0.60
        else:
            w = 0.56
        total += w
    if title:
        total *= 1.06  # Space Grotesk runs wider than Manrope
    return total * fs

# ----------------------------------------------------------------- specs ----
# node: (title, sub_or_None, kind)   kind: in | proc | out
# edges: ((col,row), (col,row)[, bow_px_down])
# metrics: [(value, label)] -> KPI chips bottom-left
# loop: dict(frm=(c,r), to=(c,r), label=...) dashed feedback arc
SPECS = [
  dict(
    id="procaenet-flood-segmentation",
    eyebrow="FLOOD SEGMENTATION — MULTISPECTRAL EO PIPELINE",
    chip="IEEE GRSL",
    lanes=["SATELLITE INPUT", "DUAL ENCODERS", "FUSION", "OUTPUT"],
    cols=[
      [("Sentinel-2 RGB", "visible bands", "in"),
       ("Sentinel-2 NIR", "water-sensitive", "in")],
      [("Dual encoders", "self-attention per branch", "proc")],
      [("Cross-attention", "fused at every skip scale", "proc")],
      [("Flood extent masks", "zero-shot sensor transfer", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((0, 1), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("State of the art", "benchmark flood segmentation")],
  ),
  dict(
    id="mining-footprint-segmentation",
    eyebrow="MINING FOOTPRINTS — MULTI-MODAL EO FUSION",
    chip="REMOTE SENSING OF ENV",
    lanes=["INPUT STREAMS", "ENCODERS", "FUSION", "OUTPUT"],
    cols=[
      [("Sentinel-2 optical", None, "in"),
       ("Sentinel-1 SAR", None, "in"),
       ("DEM terrain", None, "in")],
      [("Stream encoders", "Prithvi FM (NASA/IBM)", "proc")],
      [("Cross-modal fusion", "multi-year change stack", "proc")],
      [("Footprint maps", "active vs rehabilitated", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((0, 1), (1, 0)), ((0, 2), (1, 0)),
           ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Continental scale", "Earth Engine corpus")],
  ),
  dict(
    id="aquaculture-pond-detection",
    eyebrow="AQUACULTURE EXPANSION — CHANGE DETECTION",
    chip="PATENT FILED",
    lanes=["INPUT", "SPECTRAL SCREEN", "SHAPE FILTER", "OUTPUT"],
    cols=[
      [("Sentinel-2 stack", "multi-temporal revisits", "in")],
      [("Spectral indices", "NDWI · MNDWI · AWEI", "proc")],
      [("Geometry filters", "man-made pond shapes", "proc")],
      [("Expansion alerts", "Indonesia + Vietnam coasts", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Cross-regional", "coastline validation")],
  ),
  dict(
    id="flood-urban-resilience",
    eyebrow="FLOOD POLICY EVALUATION — EO × MIXED METHODS",
    chip="AQUA JOURNAL",
    lanes=["EVIDENCE STREAMS", "TRIANGULATION", "OUTPUT"],
    cols=[
      [("ProCANet flood masks", None, "in"),
       ("NDWI flood extent", None, "in"),
       ("Policy documents", None, "in")],
      [("Mixed-methods analysis", "satellite + policy evidence", "proc")],
      [("Retention-pond KPIs", "evidence for city planners", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((0, 1), (1, 0)), ((0, 2), (1, 0)), ((1, 0), (2, 0))],
    metrics=[("S. Bandung", "catchment case study")],
  ),
  dict(
    id="multilingual-vlm-crossmodal-conflict",
    eyebrow="VLM SAFETY — CONFLICT, PROBING & STEERING",
    chip="APART RESEARCH",
    lanes=["BENCHMARK", "EVALUATION", "MECHANISTIC", "INTERVENTION"],
    cols=[
      [("Conflict benchmark", "EN · HI · TE · multi-domain", "in")],
      [("Open VLM cohort", "multilingual evaluation", "proc")],
      [("Linear probes", "residual-stream readout", "proc")],
      [("Cross-lingual steering", "text-override eliminated", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Transferable", "EN-fit steering direction")],
  ),
  dict(
    id="sea-vl-benchmark",
    eyebrow="SEA-VL — MULTICULTURAL BENCHMARK PIPELINE",
    chip="ACL · MAIN CONFERENCE",
    lanes=["CROWDSOURCING", "QUALITY PIPELINE", "DATASET", "AUDIT"],
    cols=[
      [("Community annotators", "across SEA countries", "in")],
      [("Dedup + HITL review", "pHash · CLIP · SigLIP", "proc")],
      [("SEA-VL dataset", "culturally grounded VQA", "proc")],
      [("Frontier audit", "GPT-4V · Gemini · Claude", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Community-built", "culturally grounded corpus")],
  ),
  dict(
    id="gg-ez-regional-adaptation",
    eyebrow="REGIONAL ADAPTATION — MERGE WITHOUT FORGETTING",
    chip="UNDER REVIEW · ARXIV",
    lanes=["INPUTS", "ADAPTATION", "MERGE", "OUTPUT"],
    cols=[
      [("SEA visual corpus", "curated regional", "in"),
       ("SDXL base weights", "general-purpose", "in")],
      [("Diffusion fine-tune", "cultural adaptation arm", "proc")],
      [("Linear weight merge", "regional ↔ global blend", "proc")],
      [("Adapted model", "cultural fidelity improved", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((0, 1), (2, 0), 28), ((2, 0), (3, 0))],
    metrics=[("Quality retained", "global benchmarks intact")],
  ),
  dict(
    id="commonlid-language-identification",
    eyebrow="LANGUAGE ID — STRESS TEST ON REAL WEB DATA",
    chip="ACL CONFERENCE",
    lanes=["INPUT", "SYSTEMS", "RE-BENCHMARK", "OUTPUT"],
    cols=[
      [("CommonCrawl text", "code-switched · romanized", "in")],
      [("Production LID stack", "fastText · GlotLID · OpenLID", "proc")],
      [("Stratified eval", "noise regimes isolated", "proc")],
      [("Failure map", "guidance for LLM corpora", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Low-resource focus", "SEA web text")],
  ),
  dict(
    id="share-of-voice-forecasting",
    eyebrow="SOV FORECASTING — CALIBRATED UNCERTAINTY",
    chip="ARTEFACT",
    lanes=["DATA", "MODEL", "UNCERTAINTY", "DELIVERY"],
    cols=[
      [("SimilarWeb + Traackr", "competitive intel", "in"),
       ("Client media data", "BigQuery · dbt", "in")],
      [("XGBoost", "SHAP-validated forecasts", "proc")],
      [("Split conformal", "distribution-free intervals", "proc")],
      [("Planning dashboards", "Streamlit · APAC markets", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((0, 1), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Calibrated", "coverage-guaranteed intervals"), ("Faster", "stakeholder reporting")],
  ),
  dict(
    id="biometric-authentication-credit-scoring",
    eyebrow="BIOMETRIC AUTH & ALT-CREDIT — PRODUCTION ML",
    chip="GDP LABS",
    lanes=["TRAFFIC", "INFERENCE", "SERVICE", "CREDIT"],
    cols=[
      [("Login surge traffic", "major bank clients", "in")],
      [("MobileNet · OpenVINO", "CPU-optimised runtime", "proc")],
      [("Verification API", "sync + async load-tested", "proc")],
      [("Credit scorecard", "points-based · explainable", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Bank-grade", "uptime under surge"), ("Explainable", "regulator-ready scoring")],
  ),
  dict(
    id="fraud-detection-pipeline",
    eyebrow="FRAUD DETECTION — STREAMING MULTI-STAGE",
    chip="GDP LABS",
    lanes=["INGESTION", "PRE-FILTER", "DETECTION", "DECISIONS"],
    cols=[
      [("Kafka stream", "Redis online features", "in")],
      [("Rule pre-filters", "velocity · geo · device", "proc")],
      [("XGBoost + graph", "layered anomaly detectors", "proc")],
      [("Case routing", "drift-monitored scores", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    loop=dict(frm=(3, 0), to=(2, 0), label="HITL labels · continuous retraining"),
    metrics=[("Multi-vector", "attack-type coverage")],
  ),
  dict(
    id="municipal-waste-forecasting",
    eyebrow="WASTE LOGISTICS — FORECAST × POLICY IMPACT",
    chip="JAKARTA SMART CITY",
    lanes=["CITIZEN DATA", "FORECASTING", "CAUSAL CHECK", "OPERATIONS"],
    cols=[
      [("JAKI · Qlue reports", "citywide citizen data", "in")],
      [("Prophet ensemble", "vs ARIMA · SARIMA", "proc")],
      [("DiD analysis", "plastic-bag ban rollout", "proc")],
      [("Route planning", "Tableau · per district", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Leaner routing", "operational efficiency gains")],
  ),
  dict(
    id="demand-forecasting-consulting",
    eyebrow="DEMAND FORECASTING — CONSULTING CADENCE",
    chip="ARTEFACT",
    lanes=["TRIAGE", "MODELLING", "VALIDATION", "HANDOFF"],
    cols=[
      [("Data triage", "quality audit · BigQuery", "in")],
      [("XGBoost · Prophet", "fit per problem", "proc")],
      [("Client validation", "sign-off vs intuition", "proc")],
      [("Documented handoff", "model card · retraining", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Sprint cadence", "triage to client demo")],
  ),
  dict(
    id="hakktaxi-ride-share",
    eyebrow="RIDE-SHARE DEMAND — HACKATHON SPRINT",
    chip="AZURE APAC CHAMPION",
    lanes=["INPUT SIGNALS", "FEATURES", "MODEL", "OUTPUT"],
    cols=[
      [("Trip logs", None, "in"),
       ("Weather feed", None, "in"),
       ("POI density", None, "in")],
      [("H3 hex features", "temporal + spatial", "proc")],
      [("XGBoost surge", "per-cell demand", "proc")],
      [("Demand heatmap", "driver positioning", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((0, 1), (1, 0)), ((0, 2), (1, 0)),
           ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Seconds-level", "ETA margin of error")],
  ),
  dict(
    id="telehealthmonitor-edge-ai",
    eyebrow="EDGE VITALS MONITORING — PRIVACY BY DESIGN",
    chip="CAMBRIDGE · CAMVSCOVID",
    lanes=["SENSOR", "ON-DEVICE CV", "OPTIMISATION", "UPLINK"],
    cols=[
      [("Camera feed", "chest-region video", "in")],
      [("Pose + optical flow", "respiratory-rate estimate", "proc")],
      [("On-device INT8", "ARM CPU · FP32→INT8", "proc")],
      [("2G vitals uplink", "vital signs only · no video", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Privacy-preserving", "no raw video leaves device")],
  ),
  dict(
    id="community-ivr-voice-ai",
    eyebrow="VOICE AI — OFFLINE-FIRST IVR",
    chip="CAL HACKS · UC BERKELEY",
    lanes=["CALL", "SPEECH", "REASONING", "RESPONSE"],
    cols=[
      [("Feature-phone call", "PSTN · 2G · offline", "in")],
      [("Indonesian ASR", "dialect variants", "proc")],
      [("Intent + KG", "curated health & aid info", "proc")],
      [("TTS response", "DTMF-familiar UX", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Smartphone-free", "offline community reach")],
  ),
  dict(
    id="plastic-bag-ban-causal-analysis",
    eyebrow="PLASTIC-BAG BAN — CAUSAL POLICY ANALYSIS",
    chip="IEEE ICISS",
    lanes=["CITIZEN DATA", "NLP", "CAUSAL INFERENCE", "FINDING"],
    cols=[
      [("Citizen complaints", "JAKI · Qlue platforms", "in")],
      [("Text classification", "waste-type taxonomy", "proc")],
      [("DiD estimation", "mobility + season controls", "proc")],
      [("Causal verdict", "fewer plastic complaints", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Significant", "post-ban complaint decline")],
  ),
  dict(
    id="aicity-qwen-vl",
    eyebrow="VLM FINE-TUNING — CONSTRAINED GPU MEMORY",
    chip="AI CITY CHALLENGE",
    lanes=["DATASET", "MEMORY FIT", "PEFT", "TRAINING"],
    cols=[
      [("Traffic video QA", "challenge corpus", "in")],
      [("Dataset re-pack", "per-step memory cut", "proc")],
      [("LoRA adapters", "Qwen2.5-VL-3B", "proc")],
      [("ZeRO-2 training", "on a commodity V100", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Memory-bounded", "commodity-GPU training")],
  ),
  dict(
    id="llm-d-inference-scheduler",
    eyebrow="LLM INFERENCE — KUBERNETES SCHEDULING",
    chip="OPEN SOURCE · llm-d",
    lanes=["INGRESS", "SCHEDULER", "ROUTING", "BACKENDS"],
    cols=[
      [("Inference requests", "Gateway API ingress", "in")],
      [("Envoy ext-proc", "request interception", "proc")],
      [("KV-cache routing", "P/D disaggregation", "proc")],
      [("vLLM backends", "Kubernetes-native", "out")],
    ],
    edges=[((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (3, 0))],
    metrics=[("Production-scale", "LLM request routing")],
  ),
]

# ------------------------------------------------------------- rendering ----


def tokens(text):
    """Split into wrap units.

    Standalone separators (·) attach to the FOLLOWING word so wrapped lines
    never end in a dangling separator; long hyphenated words may break after
    a hyphen.
    """
    out = []
    for word in text.split():
        while "-" in word[1:-1] and len(word) > 13:
            i = word.index("-", 1) + 1
            out.append(word[:i])
            word = word[i:]
        if word == "·" and out is not None:
            continue  # handled by prefixing below
        out.append(word)
    # re-scan original to prefix separators
    out = []
    pending = ""
    for word in text.split():
        if word in {"·", "→", "+", "×"} :
            pending = word
            continue
        if pending:
            word = pending + " " + word
            pending = ""
        while "-" in word[1:-1] and len(word) > 13:
            i = word.index("-", 1) + 1
            out.append(word[:i])
            word = word[i:]
        out.append(word)
    if pending:
        out.append(pending)
    return out


def wrap(text, fs, title, max_w, what):
    """Greedy wrap; raises if the text cannot fit two lines (no silent loss).

    An explicit \n in the text forces a break.
    """
    if "\n" in text:
        lines = []
        for seg in text.split("\n"):
            lines += wrap(seg, fs, title, max_w, what)
        if len(lines) > 2:
            raise SystemExit(f"OVERFLOW [{what}]: needs {len(lines)} lines: {lines}")
        return lines
    lines, cur = [], ""
    for tk in tokens(text):
        joint = "" if (not cur or cur.endswith("-")) else " "
        cand = cur + joint + tk
        if text_w(cand, fs, title) <= max_w or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = tk
    if cur:
        lines.append(cur)
    for ln in lines:
        if text_w(ln, fs, title) > max_w + 3:
            raise SystemExit(f"OVERFLOW [{what}]: line '{ln}' exceeds {max_w:.0f}px")
    if len(lines) > 2:
        raise SystemExit(f"OVERFLOW [{what}]: needs {len(lines)} lines: {lines}")
    return lines


def node_size(title, sub, col_w, what):
    max_w = col_w - 2 * PAD_X
    t_lines = wrap(title, TITLE_FS, True, max_w, what)
    s_lines = wrap(sub, SUB_FS, False, max_w, what) if sub else []
    h = 8 + len(t_lines) * TITLE_LH + (2.5 + len(s_lines) * SUB_LH if s_lines else 0) + 7
    return t_lines, s_lines, h


def esc(s):
    return html.escape(s, quote=True)


def render_svg(spec):
    n = len(spec["cols"])
    col_w = (W - 2 * MARGIN - (n - 1) * COL_GAP) / n
    col_x = [MARGIN + i * (col_w + COL_GAP) for i in range(n)]

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" font-family="Manrope">'
    ]
    parts.append(f"""<defs>
<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
  <circle cx="1" cy="1" r="0.55" fill="rgba(95,113,136,0.10)"/>
</pattern>
<linearGradient id="gout" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="rgba(119,146,175,0.20)"/>
  <stop offset="1" stop-color="rgba(119,146,175,0.05)"/>
</linearGradient>
<marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
  <path d="M0 0L6 3L0 6z" fill="{ARROW_HEAD}"/>
</marker>
<marker id="ahd" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
  <path d="M0 0L6 3L0 6z" fill="rgba(119,146,175,0.75)"/>
</marker>
</defs>""")
    parts.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#dots)"/>')

    # header
    parts.append(
        f'<text x="{MARGIN}" y="19" font-size="7" font-weight="700" '
        f'letter-spacing="0.9" fill="{FAINT}">{esc(spec["eyebrow"])}</text>'
    )
    chip = spec["chip"]
    chip_w = text_w(chip, 6.3) + 0.5 * len(chip) + 14  # + letter-spacing
    parts.append(
        f'<rect x="{W - MARGIN - chip_w:.1f}" y="9.5" width="{chip_w:.1f}" height="13" rx="6.5" '
        f'fill="rgba(119,146,175,0.08)" stroke="rgba(119,146,175,0.35)" stroke-width="0.8"/>'
    )
    parts.append(
        f'<text x="{W - MARGIN - chip_w / 2:.1f}" y="18.4" text-anchor="middle" font-size="6.3" '
        f'font-weight="700" letter-spacing="0.5" fill="{MUTED}">{esc(chip)}</text>'
    )
    parts.append(f'<line x1="{MARGIN}" y1="27" x2="{W - MARGIN}" y2="27" stroke="{RULE}"/>')

    # lane labels
    for i, lane in enumerate(spec["lanes"]):
        parts.append(
            f'<text x="{col_x[i] + col_w / 2:.1f}" y="39.5" text-anchor="middle" font-size="6.3" '
            f'font-weight="700" letter-spacing="1.1" fill="{LANE}">{esc(lane)}</text>'
        )

    # layout + draw nodes
    geo = {}
    for ci, col in enumerate(spec["cols"]):
        sizes = [node_size(t, s, col_w, f"{spec['id']}[{ci}]") for (t, s, _k) in col]
        gap = 9.0 if len(col) < 3 else 7.0
        total = sum(h for (_t, _s, h) in sizes) + gap * (len(col) - 1)
        if total > BODY_BOT - BODY_TOP:
            raise SystemExit(f"OVERFLOW [{spec['id']}] column {ci} height {total:.0f}")
        y = BODY_TOP + (BODY_BOT - BODY_TOP - total) / 2
        for ri, ((title, sub, kind), (t_lines, s_lines, h)) in enumerate(zip(col, sizes)):
            x = col_x[ci]
            geo[(ci, ri)] = (x, y, col_w, h)
            if kind == "in":
                style = (f'fill="{INPUT_FILL}" stroke="{INPUT_STROKE}" '
                         f'stroke-width="1" stroke-dasharray="3.2 2.6"')
            elif kind == "out":
                style = f'fill="url(#gout)" stroke="{ACCENT}" stroke-width="1.3"'
            else:
                style = f'fill="{NODE_FILL}" stroke="{NODE_STROKE}" stroke-width="1"'
            parts.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{col_w:.1f}" height="{h:.1f}" rx="6" {style}/>'
            )
            ty = y + 8 + TITLE_FS * 0.82
            for ln in t_lines:
                parts.append(
                    f'<text x="{x + PAD_X}" y="{ty:.1f}" font-family="Space Grotesk" '
                    f'font-size="{TITLE_FS}" font-weight="600" fill="{INK}">{esc(ln)}</text>'
                )
                ty += TITLE_LH
            ty += 1.0
            for ln in s_lines:
                parts.append(
                    f'<text x="{x + PAD_X}" y="{ty:.1f}" font-size="{SUB_FS}" '
                    f'font-weight="500" fill="{MUTED}">{esc(ln)}</text>'
                )
                ty += SUB_LH
            y += h + gap

    # edges
    for edge in spec["edges"]:
        (c1, r1), (c2, r2) = edge[0], edge[1]
        bow = edge[2] if len(edge) > 2 else 0
        x1, y1, w1, h1 = geo[(c1, r1)]
        x2, y2, _w2, h2 = geo[(c2, r2)]
        sx, sy = x1 + w1 + 1.2, y1 + h1 / 2
        ex, ey = x2 - 1.6, y2 + h2 / 2
        if abs(sy - ey) < 1 and not bow:
            d = f"M{sx:.1f} {sy:.1f}L{ex:.1f} {ey:.1f}"
        else:
            dx = (ex - sx) * 0.45
            d = (f"M{sx:.1f} {sy:.1f}C{sx + dx:.1f} {sy + bow:.1f} "
                 f"{ex - dx:.1f} {ey + bow:.1f} {ex:.1f} {ey:.1f}")
        parts.append(
            f'<path d="{d}" fill="none" stroke="{ARROW}" stroke-width="1.15" marker-end="url(#ah)"/>'
        )

    # dashed feedback loop
    if spec.get("loop"):
        lp = spec["loop"]
        fx, fy, fw, fh = geo[lp["frm"]]
        tx, ty_, tw, th = geo[lp["to"]]
        sx, sy = fx + fw / 2, fy + fh + 1.5
        ex, ey = tx + tw / 2, ty_ + th + 1.5
        yy = max(sy, ey) + 14
        r = 5.0
        d = (f"M{sx:.1f} {sy:.1f}L{sx:.1f} {yy - r:.1f}"
             f"Q{sx:.1f} {yy:.1f} {sx - r:.1f} {yy:.1f}"
             f"L{ex + r:.1f} {yy:.1f}"
             f"Q{ex:.1f} {yy:.1f} {ex:.1f} {yy - r:.1f}"
             f"L{ex:.1f} {ey + 1.5:.1f}")
        parts.append(
            f'<path d="{d}" fill="none" stroke="rgba(119,146,175,0.55)" '
            f'stroke-dasharray="3 3" marker-end="url(#ahd)"/>'
        )
        parts.append(
            f'<text x="{(sx + ex) / 2:.1f}" y="{yy + 8.4:.1f}" text-anchor="middle" font-size="6.4" '
            f'font-weight="600" fill="rgba(139,157,181,0.9)">{esc(lp["label"])}</text>'
        )

    # KPI chips (bottom-left)
    cx = MARGIN
    for value, label in spec.get("metrics", []):
        vw = text_w(value, 9, title=True)
        lw = text_w(label, 6.4)
        cw_ = 10 + vw + 6 + lw + 10
        parts.append(
            f'<rect x="{cx:.1f}" y="{CHIP_ROW_Y}" width="{cw_:.1f}" height="14" rx="7" '
            f'fill="rgba(119,146,175,0.10)" stroke="rgba(119,146,175,0.45)" stroke-width="0.9"/>'
        )
        parts.append(
            f'<text x="{cx + 10:.1f}" y="{CHIP_ROW_Y + 10}" font-family="Space Grotesk" '
            f'font-size="9" font-weight="700" fill="{INK}">{esc(value)}</text>'
        )
        parts.append(
            f'<text x="{cx + 10 + vw + 6:.1f}" y="{CHIP_ROW_Y + 9.6}" font-size="6.4" '
            f'font-weight="600" fill="{MUTED}">{esc(label)}</text>'
        )
        cx += cw_ + 8

    parts.append(
        f'<text x="{W - MARGIN}" y="{CHIP_ROW_Y + 9.8}" text-anchor="end" font-size="5.8" '
        f'font-weight="600" letter-spacing="0.4" fill="rgba(93,118,145,0.55)">vickyfeliren.com</text>'
    )
    parts.append("</svg>")
    return "".join(parts)


HTML_TMPL = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family:'Manrope'; font-style:normal; font-weight:400 800;
  src:url('{fonts}/manrope-latin.woff2') format('woff2'); }}
@font-face {{ font-family:'Space Grotesk'; font-style:normal; font-weight:500 700;
  src:url('{fonts}/spacegrotesk-latin.woff2') format('woff2'); }}
html,body {{ margin:0; padding:0; background:{bg}; }}
svg {{ display:block; }}
</style></head><body>{svg}</body></html>"""


def build_alt(spec):
    """Digit-consistent alt text derived from the diagram spec itself."""
    stages = []
    for col in spec["cols"]:
        names = []
        for title, sub, _k in col:
            names.append(f"{title} ({sub})" if sub else title)
        stages.append(" + ".join(names))
    return "End-to-end pipeline diagram: " + " \u2192 ".join(stages)


def write_alt_data(specs):
    """Regenerate _data/uc_banners.yml (consumed by _pages/usecases.md)."""
    import json
    path = os.path.join(REPO, "_data", "uc_banners.yml")
    lines = ["# AUTO-GENERATED by scripts/generate_uc_banners.py — do not edit by hand.\n"]
    for spec in specs:
        lines.append(f"{spec['id']}:\n  alt: {json.dumps(build_alt(spec), ensure_ascii=False)}\n")
    with open(path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("wrote", os.path.relpath(path, REPO))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated subset of ids")
    ap.add_argument("--keep-svg", action="store_true", help="also copy SVGs next to PNGs")
    args = ap.parse_args()
    only = set(args.only.split(",")) if args.only else None
    todo = [s for s in SPECS if not only or s["id"] in only]

    os.makedirs(OUT_DIR, exist_ok=True)
    fonts = os.path.join(REPO, "assets", "fonts")

    from playwright.sync_api import sync_playwright

    with tempfile.TemporaryDirectory(prefix="ucb-") as tmp, sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROMIUM, args=["--no-sandbox", "--disable-gpu"]
        )
        page = browser.new_page(
            viewport={"width": W, "height": H}, device_scale_factor=SCALE
        )
        for spec in todo:
            svg = render_svg(spec)
            hpath = os.path.join(tmp, spec["id"] + ".html")
            with open(hpath, "w", encoding="utf-8") as f:
                f.write(HTML_TMPL.format(fonts=fonts, bg=BG, svg=svg))
            page.goto("file://" + hpath)
            page.evaluate("() => document.fonts.ready")
            png = os.path.join(OUT_DIR, spec["id"] + ".png")
            page.screenshot(path=png, clip={"x": 0, "y": 0, "width": W, "height": H})
            if args.keep_svg:
                with open(os.path.join(OUT_DIR, spec["id"] + ".svg"), "w", encoding="utf-8") as f:
                    f.write(svg)
            try:  # optional size optimisation
                from PIL import Image
                im = Image.open(png).convert("RGB")
                im.save(png, optimize=True)
            except ImportError:
                pass
            print("rendered", os.path.relpath(png, REPO), f"{os.path.getsize(png) // 1024} KB")
        browser.close()
    write_alt_data(SPECS)


if __name__ == "__main__":
    main()
