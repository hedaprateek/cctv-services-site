/* ============================================================================
   MOTION LAYER — behaviour

   Loaded from <head> so the .js flag is set before the body parses. That flag
   is what lets effects.css hide the reveal targets: with JS off, or if this
   file fails to load, nothing is ever hidden and the page reads normally.

   Every rAF loop here self-terminates once motion falls below a sub-pixel
   threshold, so nothing costs anything at rest.
   ========================================================================== */
(function () {
  "use strict";

  /* Set immediately, not on DOMContentLoaded: the hidden state has to be in
     effect before the first paint or revealed content flashes in and out. */
  document.documentElement.className += " js";

  function reduced() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function canHover() {
    return !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }
  function all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  var REVEAL = ".sec-head,.door,.card,.steps>li,.spec-row,.checks>li,.panel," +
              ".reach>a,.sheet,#calc,.note,.cover,.sale>div,.cta-band .inner";

  /* ---- 1. reveals ------------------------------------------------------ */
  function initReveals() {
    var els = all(REVEAL);

    if (reduced() || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);          /* one shot: never re-hides */
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    els.forEach(function (el) { io.observe(el); });

    /* Opening the page at an anchor (contact.html#calc) jumps past the
       observer, so force anything already on or above the screen. */
    function inView() {
      els.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }
    inView();
    window.addEventListener("load", function () { inView(); setTimeout(inView, 600); });
    window.addEventListener("hashchange", function () { setTimeout(inView, 600); });
  }

  /* ---- 2. painted headings --------------------------------------------- */
  /* The sweep itself is CSS. This only marks it finished, so the heading
     reverts to ordinary solid text once the paint has landed. */
  function initPaint() {
    var heads = all(".sec-head");
    var wait = reduced() ? 0 : 1700;
    if (!("IntersectionObserver" in window)) {
      heads.forEach(function (h) {
        var h2 = h.querySelector("h2");
        if (h2) h2.classList.add("painted");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var h2 = e.target.querySelector("h2");
        if (h2) setTimeout(function () { h2.classList.add("painted"); }, wait);
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ---- 3. spotlight edges ---------------------------------------------- */
  function initSpotlight() {
    if (!canHover()) return;
    all(".door,.panel,.sheet,.reach a").forEach(function (el) {
      el.classList.add("spot");
    });
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".spot");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
      el.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
    }, { passive: true });
  }

  /* ---- 4. magnetic call buttons ---------------------------------------- */
  /* The pull is instant; the spring in effects.css handles the snap back. */
  function initMagnets() {
    if (!canHover() || reduced()) return;
    all(".btn-orange").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (dx * 0.18).toFixed(1) + "px," +
                                           (dy * 0.28).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---- 5. stat counters ------------------------------------------------ */
  /* The figures come from config.js, so they are only numeric once the real
     details are filled in. Until then they stay as the placeholder text. */
  function initCounters() {
    var cells = all(".stats dt");
    if (!cells.length) return;

    function run(dt) {
      var span = dt.querySelector("[data-cfg]");
      if (!span) return;
      var end = parseInt(String(span.textContent).replace(/[^\d]/g, ""), 10);
      if (!end || end < 2) return;                 /* placeholder, or too small to bother */
      if (reduced()) { span.textContent = String(end); return; }

      var t0 = performance.now(), dur = 1300;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        span.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }

    if (!("IntersectionObserver" in window)) { cells.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    });
    cells.forEach(function (c) { io.observe(c); });
  }

  /* ---- boot ------------------------------------------------------------- */
  /* Each step is isolated: one failure must not stop the rest, and the page
     keeps its static markup either way. */
  function start() {
    [["reveals", initReveals], ["paint", initPaint], ["spotlight", initSpotlight],
     ["magnets", initMagnets], ["counters", initCounters]]
      .forEach(function (step) {
        try { step[1](); } catch (err) {
          if (window.console) console.warn("[effects] " + step[0] + " failed:", err);
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
