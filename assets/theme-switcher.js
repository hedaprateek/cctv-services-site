/* ============================================================================
   THEME SWITCHER  —  TEMPORARY

   Loaded from <head> so the stored palette is applied before the page paints:
   switching colours never flashes the default first.

   The control itself is built from script rather than living in page markup,
   so removing the whole feature means deleting this file, assets/themes.css,
   and the two tags they add to each page's <head>. No page markup to unpick.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "cctv-palette";
  var DEFAULT = "terracotta";

  var PALETTES = [
    { k: "terracotta", label: "Terracotta & Sand",   a: "#C2410C", b: "#F59E0B" },
    { k: "amber",      label: "Amber & Charcoal",    a: "#1C1917", b: "#F5A524" },
    { k: "marigold",   label: "Marigold & Deep Red", a: "#9F1239", b: "#F59E0B" },
    { k: "copper",     label: "Copper & Bronze",     a: "#B45309", b: "#FBBF24" },
    { k: "saffron",    label: "Saffron & Teak",      a: "#E8590C", b: "#D97706" },
    { k: "chilli",     label: "Chilli & Cream",      a: "#B91C1C", b: "#F59E0B" }
  ];

  function valid(k) {
    return PALETTES.some(function (p) { return p.k === k; });
  }

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return valid(v) ? v : DEFAULT;
    } catch (e) {
      return DEFAULT;   /* private mode, or site data blocked */
    }
  }

  /* ---- 1. apply immediately, before first paint ------------------------- */
  function paint(k) {
    /* Terracotta is the default and lives in :root, so it needs no attribute. */
    if (k === DEFAULT) document.documentElement.removeAttribute("data-palette");
    else document.documentElement.setAttribute("data-palette", k);
  }
  paint(stored());

  /* ---- 2. build the control once the body exists ------------------------ */
  function build() {
    if (document.querySelector(".tsw")) return;

    var root = document.createElement("div");
    root.className = "tsw";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tsw-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "tswPanel");
    btn.innerHTML = '<span class="bead"></span><span class="lbl">Theme</span>';

    var panel = document.createElement("div");
    panel.className = "tsw-panel";
    panel.id = "tswPanel";
    panel.hidden = true;

    var heading = document.createElement("h4");
    heading.textContent = "Colour theme";
    panel.appendChild(heading);

    function select(k) {
      paint(k);
      try { localStorage.setItem(KEY, k); } catch (e) { /* this visit only */ }
      panel.querySelectorAll(".tsw-opt").forEach(function (o) {
        o.setAttribute("aria-pressed", String(o.dataset.k === k));
      });
    }

    var active = stored();
    PALETTES.forEach(function (p) {
      var o = document.createElement("button");
      o.type = "button";
      o.className = "tsw-opt";
      o.dataset.k = p.k;
      o.setAttribute("aria-pressed", String(p.k === active));

      var sw = document.createElement("span");
      sw.className = "sw";
      sw.style.background = "linear-gradient(135deg," + p.a + " 0 50%," + p.b + " 50% 100%)";
      o.appendChild(sw);
      o.appendChild(document.createTextNode(p.label));

      o.addEventListener("click", function () { select(p.k); });
      panel.appendChild(o);
    });

    var note = document.createElement("p");
    note.className = "tsw-note";
    note.textContent = "Saved on this device only. Visitors still see the standard colours.";
    panel.appendChild(note);

    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", function () { setOpen(panel.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target) && !panel.hidden) setOpen(false);
    });

    root.appendChild(panel);
    root.appendChild(btn);
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
