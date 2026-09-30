/* ════════════════════════════════════════════════════════
   Shared pieces for the interview explainers (js/components/explainer-*.js).

   Every explainer follows the layout of Transformer Explainer: a guided tour
   across the top, then numbered columns read left to right, each headed by its
   shape signature, with colour meaning magnitude only. This file holds what
   they share, so each component keeps only its own model and its own maths.

   In the browser it defines window.XP, and a page loads it before any
   explainer through `extra_js`. Under Node it exports the same object, so the
   verification scripts can load a component's maths without a DOM.
   ════════════════════════════════════════════════════════ */
(function (root) {

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* Signed numbers with a real minus sign, and minus infinity spelled out. */
  function fmt(x, d) {
    if (x === -Infinity) return '−∞';
    return (x < 0 ? '−' : '') + Math.abs(x).toFixed(d === undefined ? 2 : d);
  }

  /* Tint by sign and size: --tf-up for positive, --tf-down for negative.
     `seq` forces the positive colour, for quantities that cannot be negative. */
  function tint(v, max, seq) {
    var a = Math.min(1, Math.abs(v) / (max || 1));
    var c = seq || v >= 0 ? 'var(--tf-up)' : 'var(--tf-down)';
    return 'background:color-mix(in srgb,' + c + ' ' + Math.round(a * 88) + '%,transparent)';
  }

  /* Mulberry32: small, fast and seeded, so a panel shows the same numbers on
     every visit and a verification script can reproduce them. */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* One standard normal draw by Box-Muller, consuming 2 uniforms. */
  function gauss(r) {
    var u = Math.max(r(), 1e-12), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function softmax(v) {
    var m = Math.max.apply(null, v);
    var e = v.map(function (x) { return x === -Infinity ? 0 : Math.exp(x - m); });
    var s = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (x) { return x / s; });
  }

  /* log Gamma (Lanczos) and the regularised incomplete beta function, by
     Lentz's continued fraction. Accurate to about 1e-10 over the ranges used. */
  function lgamma(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, t = x + 5.5, s = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (var j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, TINY = 1e-300;
    if (Math.abs(d) < TINY) d = TINY;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }

  /* The guided tour bar and its caption, identical on every explainer. */
  function tourBar(tour, step) {
    var t = tour[step];
    return '<div class="xp-tour" role="group" aria-label="Guided tour">' +
      '<button type="button" data-tour="-1" aria-label="Previous step"' + (step === 0 ? ' disabled' : '') + '>←</button>' +
      '<span class="xp-tour-n">' + (step + 1) + ' / ' + tour.length + '</span>' +
      '<button type="button" data-tour="1" aria-label="Next step"' + (step === tour.length - 1 ? ' disabled' : '') + '>→</button>' +
      '</div>';
  }
  function caption(tour, step) {
    var t = tour[step];
    return '<p class="xp-caption" aria-live="polite"><strong>' + esc(t.t) + '.</strong> ' + esc(t.say) + '</p>';
  }
  /* One numbered column. `lit` is the tour's current column. */
  function column(n, title, shape, body, lit, wide) {
    return '<section class="xp-col' + (wide ? ' is-wide' : '') + (lit ? ' is-lit' : '') + '" aria-label="' + esc(title) + '">' +
      '<h3 class="xp-col-t"><span>' + n + '</span>' + esc(title) + '</h3>' +
      (shape ? '<p class="xp-shape">' + shape + '</p>' : '') + body + '</section>';
  }

  /* Re-render, then put focus back on the control that caused it, so keyboard
     users keep their place when a panel redraws itself. */
  function keepFocus(host, selector, render) {
    render();
    if (!selector) return;
    var again = host.querySelector(selector);
    if (again && !again.disabled) again.focus();
  }
  function selectorFor(el) {
    var ds = el.dataset || {};
    for (var k in ds) {
      if (Object.prototype.hasOwnProperty.call(ds, k)) {
        return '[data-' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); }) + '="' + ds[k] + '"]';
      }
    }
    return null;
  }

  /* ── the canvas toolkit ──────────────────────────────────
     An explainer draws one wordless canvas and keeps prose out of it. Words
     live in three places only: a guide card that walks through the parts,
     a tooltip on hover, and a dialog behind each zoom button. */

  /* Dim every [data-part] that does not name one of `parts`. An element may
     carry several parts, space separated. An empty list clears the dimming. */
  function highlight(root, parts) {
    var want = parts || [];
    Array.prototype.forEach.call(root.querySelectorAll('[data-part]'), function (el) {
      var mine = el.getAttribute('data-part').split(' ');
      var on = !want.length || mine.some(function (p) { return want.indexOf(p) >= 0; });
      el.classList.toggle('is-dim', !on);
      el.classList.toggle('is-hl', want.length > 0 && on);
    });
  }

  /* A tooltip that follows the pointer inside `box`, never past its edges. */
  function tip(box) {
    var el = document.createElement('div');
    el.className = 'xp-tip';
    el.setAttribute('role', 'tooltip');
    el.hidden = true;
    box.appendChild(el);
    return {
      show: function (html, e) {
        el.innerHTML = html;
        el.hidden = false;
        var b = box.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
        var x = e.clientX - b.left + 14, y = e.clientY - b.top + 14;
        if (x + w > b.width - 4) x = e.clientX - b.left - w - 14;
        if (y + h > b.height - 4) y = e.clientY - b.top - h - 14;
        el.style.left = Math.max(4, x) + 'px';
        el.style.top = Math.max(4, y) + 'px';
      },
      hide: function () { el.hidden = true; }
    };
  }

  /* One native <dialog> per explainer for the zoomed-in views. It traps focus
     and closes on Escape by itself, and returns focus to the opener. */
  function dialog(box) {
    var d = document.createElement('dialog');
    d.className = 'xp-dialog';
    d.innerHTML = '<header><h3></h3><button type="button" class="xp-close" aria-label="Close">\u00d7</button></header><div class="xp-dialog-b"></div>';
    box.appendChild(d);
    var opener = null;
    d.querySelector('.xp-close').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () { if (opener) opener.focus(); });
    return {
      el: d,
      body: d.querySelector('.xp-dialog-b'),
      open: function (title, html, from) {
        if (!d.open) opener = from || document.activeElement;
        d.querySelector('h3').textContent = title;
        d.querySelector('.xp-dialog-b').innerHTML = html;
        if (d.open) return;
        if (d.showModal) d.showModal(); else d.setAttribute('open', '');
      },
      isOpen: function () { return d.open; }
    };
  }

  /* The guide card: numbered pages, each naming the parts it lights up.
     `onPage(page, index, isRedraw)` runs on every change, so a page can also switch
     the canvas into the state it describes. The card can be closed and
     reopened; closing it clears the highlight. */
  function guide(box, pages, onPage) {
    var i = 0;
    var card = document.createElement('aside');
    card.className = 'xp-guide';
    card.setAttribute('aria-label', 'Guide');
    var reopen = document.createElement('button');
    reopen.type = 'button';
    reopen.className = 'xp-guide-open';
    reopen.textContent = 'Guide';
    reopen.hidden = true;
    box.appendChild(card);
    box.appendChild(reopen);

    function draw() {
      var p = pages[i];
      card.innerHTML = '<header><b>' + esc(p.t) + '</b><button type="button" class="xp-close" data-guide="close" aria-label="Close the guide">\u00d7</button></header>' +
        '<div class="xp-guide-b" aria-live="polite">' + p.body + '</div>' +
        '<footer><button type="button" data-guide="-1" aria-label="Previous"' + (i === 0 ? ' disabled' : '') + '>\u2039</button>' +
        '<span class="xp-guide-bar"><i style="width:' + ((i + 1) / pages.length * 100) + '%"></i></span>' +
        '<span class="xp-guide-n">' + (i + 1) + ' / ' + pages.length + '</span>' +
        '<button type="button" data-guide="1" aria-label="Next"' + (i === pages.length - 1 ? ' disabled' : '') + '>\u203a</button></footer>';
      onPage(p, i);
    }
    card.addEventListener('click', function (e) {
      var b = e.target.closest('[data-guide]');
      if (!b) return;
      var v = b.dataset.guide;
      if (v === 'close') {
        card.hidden = true; reopen.hidden = false; onPage(null, -1); reopen.focus(); return;
      }
      i = Math.max(0, Math.min(pages.length - 1, i + parseInt(v, 10)));
      draw();
      var again = card.querySelector('[data-guide="' + v + '"]');
      if (again && !again.disabled) again.focus();
      else card.querySelector('[data-guide]:not([disabled])').focus();
    });
    reopen.addEventListener('click', function () {
      card.hidden = false; reopen.hidden = true; draw();
      card.querySelector('[data-guide="1"], [data-guide="-1"]').focus();
    });
    draw();
    return {
      page: function () { return card.hidden ? null : pages[i]; },
      /* Re-apply the current page's highlight after the panel redraws. The
         third argument tells the caller this is not a page change, so it
         must not switch tabs or reset state the reader chose. */
      redraw: function () { if (!card.hidden) onPage(pages[i], i, true); }
    };
  }

  /* SVG builders. Numbers are rounded to 1 decimal to keep the markup small. */
  function r1(v) { return Math.round(v * 10) / 10; }
  function svgEl(tag, attrs, inner) {
    var s = '<' + tag;
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] !== undefined && attrs[k] !== null) {
        s += ' ' + k + '="' + (typeof attrs[k] === 'number' ? r1(attrs[k]) : esc(attrs[k])) + '"';
      }
    }
    return inner === undefined ? s + '/>' : s + '>' + inner + '</' + tag + '>';
  }
  /* A ribbon: a band of constant thickness `w` from (x1, y1) to (x2, y2),
     curved horizontally, the connective tissue of every canvas. */
  function ribbon(x1, y1, x2, y2, w1, w2) {
    var h1 = (w1 || 2) / 2, h2 = (w2 === undefined ? w1 || 2 : w2) / 2, mx = (x1 + x2) / 2;
    return 'M' + r1(x1) + ' ' + r1(y1 - h1) + 'C' + r1(mx) + ' ' + r1(y1 - h1) + ' ' + r1(mx) + ' ' + r1(y2 - h2) + ' ' + r1(x2) + ' ' + r1(y2 - h2) +
      'L' + r1(x2) + ' ' + r1(y2 + h2) + 'C' + r1(mx) + ' ' + r1(y2 + h2) + ' ' + r1(mx) + ' ' + r1(y1 + h1) + ' ' + r1(x1) + ' ' + r1(y1 + h1) + 'Z';
  }
  /* A thin curved line between two points. */
  function curve(x1, y1, x2, y2) {
    var mx = (x1 + x2) / 2;
    return 'M' + r1(x1) + ' ' + r1(y1) + 'C' + r1(mx) + ' ' + r1(y1) + ' ' + r1(mx) + ' ' + r1(y2) + ' ' + r1(x2) + ' ' + r1(y2);
  }

  /* Widen every canvas explainer to the viewport, centred on the viewport
     rather than on the reading column, which need not be centred itself. */
  function fitCanvases() {
    var vw = document.documentElement.clientWidth;
    Array.prototype.forEach.call(document.querySelectorAll('.xp.is-canvas'), function (sec) {
      var w = Math.min(1400, vw - 40);
      sec.style.marginLeft = '0px';
      sec.style.width = w + 'px';
      var left = sec.parentElement.getBoundingClientRect().left;
      sec.style.marginLeft = Math.round((vw - w) / 2 - left) + 'px';
    });
  }
  if (typeof document !== 'undefined' && typeof module === 'undefined') {
    var fitting = null;
    window.addEventListener('resize', function () { clearTimeout(fitting); fitting = setTimeout(fitCanvases, 80); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fitCanvases);
    else fitCanvases();
  }

  var XP = {
    esc: esc, fmt: fmt, tint: tint, rng: rng, gauss: gauss, softmax: softmax,
    lgamma: lgamma, ibeta: ibeta, tourBar: tourBar, caption: caption, column: column,
    keepFocus: keepFocus, selectorFor: selectorFor,
    fitCanvases: fitCanvases, highlight: highlight, tip: tip, dialog: dialog, guide: guide, svgEl: svgEl, ribbon: ribbon, curve: curve,
    reduced: typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
  if (typeof module === 'object' && module.exports) module.exports = XP;
  else root.XP = XP;
})(this);
