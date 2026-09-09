/* ============================================================================
   Shared behaviour for every page. You should not need to edit this file —
   the business details all live in assets/config.js.
   ========================================================================== */
(function () {
  "use strict";

  var C = (typeof CONFIG === "object" && CONFIG) ? CONFIG : {};
  var waDigits = String(C.whatsapp || "").replace(/\D/g, "");

  /* ---- 1. drop the business details into the page --------------------- */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = C[el.dataset.cfg];
    if (v) { el.textContent = v; el.classList.remove("ph"); }
  });

  document.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    var k = el.dataset.cfgHref;
    if (k === "tel" && C.phone) el.href = "tel:" + String(C.phone).replace(/[^\d+]/g, "");
    if (k === "wa" && waDigits) el.href = "https://wa.me/" + waDigits;
    if (k === "mail" && C.email) el.href = "mailto:" + C.email;
  });

  if (C.name) {
    var base = document.title;
    document.title = C.name + " - " + base + (C.city ? ", " + C.city : "");
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- 2. the setup strip (removes itself once config.js is filled) ---- */
  var strip = document.getElementById("setup");
  if (strip) {
    var missing = 0;
    strip.querySelectorAll("[data-k]").forEach(function (li) {
      if (C[li.dataset.k]) li.remove(); else missing++;
    });
    if (!missing) {
      strip.remove();
    } else {
      var hide = strip.querySelector("button");
      if (hide) hide.addEventListener("click", function () { strip.remove(); });
    }
  }

  /* ---- 3. camera grid clock (home page only) -------------------------- */
  var clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var d = new Date();
      var t = pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "  " +
              pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      clocks.forEach(function (c) { c.textContent = t; });
    };
    tick();
    if (!still) setInterval(tick, 1000);
  }

  /* ---- 4. toast + copy helper ----------------------------------------- */
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  function copy(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? "Copied" : "Could not copy — select the summary to copy it");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied"); }, fallback);
    } else {
      fallback();
    }
  }

  /* ---- 5. requirement builder (contact page only) ---------------------- */
  var form = document.getElementById("calc");
  if (!form) return;

  /* Rough trade figures: GB per camera per day, H.265, continuous recording.
     Adjust these if his real-world numbers differ. */
  var GB_PER_DAY = { "2": 10, "5": 22, "8": 38 };
  /* Average cable run per camera, in metres, by type of site. */
  var RUN = { "Home": 20, "Shop": 16, "Office": 24, "Godown or factory": 38 };
  var CHANNELS = [4, 8, 16, 32];
  var DISKS = [1, 2, 4, 6, 8, 10];
  var TARGET_DAYS = 30;

  var camsIn = document.getElementById("cams");
  var camsOut = document.getElementById("camsOut");
  var out = {
    rec: document.getElementById("oRec"),
    hdd: document.getElementById("oHdd"),
    days: document.getElementById("oDays"),
    cable: document.getElementById("oCable"),
    power: document.getElementById("oPower")
  };
  var waBtn = document.getElementById("sendWa");
  var copyBtn = document.getElementById("copyReq");
  var summary = "";

  function picked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  function compute() {
    var cams = parseInt(camsIn.value, 10);
    var res = picked("res");
    var mode = picked("mode");
    var site = picked("site");

    var perDay = GB_PER_DAY[res] * (mode === "motion" ? 0.4 : 1);
    var chan = CHANNELS.find(function (c) { return c >= cams; }) || 32;

    var needTB = (cams * perDay * TARGET_DAYS) / 1000;
    var disk = DISKS.find(function (t) { return t >= needTB; }) || DISKS[DISKS.length - 1];
    var days = Math.round((disk * 1000) / (cams * perDay));
    var metres = Math.round((cams * RUN[site]) / 10) * 10;

    camsOut.textContent = cams;
    out.rec.textContent = chan + "-channel " + (res === "2" ? "DVR or NVR" : "NVR");
    out.hdd.textContent = disk + " TB surveillance grade";
    out.days.innerHTML = "<b>about " + days + " days</b> before overwrite";
    out.cable.textContent = "about " + metres + " m";
    out.power.textContent = chan + "-way supply, 1 point at recorder";

    summary =
      "CCTV enquiry\n" +
      "Site: " + site + "\n" +
      "Cameras: " + cams + " (" + res + " MP)\n" +
      "Recording: " + (mode === "motion" ? "motion only" : "24x7 continuous") + "\n" +
      "Recorder: " + chan + "-channel\n" +
      "Storage: " + disk + " TB (about " + days + " days)\n" +
      "Cable: about " + metres + " m\n" +
      "Location: \n\n" +
      "Please share a quote or arrange a site visit.";

    if (waDigits) {
      waBtn.href = "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(summary);
    }
  }

  if (!waDigits) {
    waBtn.textContent = "Copy this enquiry";
    waBtn.removeAttribute("target");
    waBtn.setAttribute("href", "#calc");
    waBtn.addEventListener("click", function (e) { e.preventDefault(); copy(summary); });
  }
  if (copyBtn) copyBtn.addEventListener("click", function () { copy(summary); });

  form.addEventListener("input", compute);
  form.addEventListener("change", compute);
  compute();
})();
