# CCTV, Electrical & Computer Services — website

A six-page website for a CCTV installation, electrical/fitting and computer service
business. Plain HTML and CSS, no build step, no dependencies, no framework.

**Live:** https://hedaprateek.github.io/cctv-services-site/

---

## Filling in the business details

Open **`assets/config.js`**. That is the only file you need to touch — every page reads
from it.

```js
const CONFIG = {
  name:     "",   // "Sharma Security Systems"
  city:     "",   // "Indore"
  area:     "",   // "Indore, Dewas and Ujjain"
  phone:    "",   // "+91 98765 43210"
  whatsapp: "",   // "919876543210"  (digits only, country code first)
  email:    "",   // "info@example.com"
  address:  "",   // "12 MG Road, Indore"
  sites:    "",   // "180"
  years:    "",   // "9"
  hours:    "",   // "Mon to Sat, 10 am to 8 pm"
};
```

Fill in the values between the quotes and save. That single change:

- replaces every orange placeholder across all six pages,
- wires up the Call, WhatsApp and email buttons,
- makes the requirement builder send a pre-written WhatsApp enquiry,
- puts the business name into the browser tab title,
- removes the orange "Template" strip at the top of the site.

Any value left as `""` keeps showing a highlighted placeholder, so nothing silently goes
blank.

### The `whatsapp` value

Digits only — country code first, no `+`, no spaces, no dashes.
`+91 98765 43210` becomes `"919876543210"`.

---

## The pages

| File | Page |
| --- | --- |
| `index.html` | Home — hero, the three service doors, why it matters, coverage |
| `cctv.html` | CCTV installation, camera types, storage, and how a job runs |
| `electrical.html` | Conduit, points, earthing, backup, brackets, standalone electrical work |
| `computers.html` | Repairs, formatting, upgrades, printers, office AMC |
| `sales.html` | New and second-hand equipment, supply-only and exchange |
| `contact.html` | Contact details, what to tell us, and the requirement builder |

Shared files:

| File | What it is |
| --- | --- |
| `assets/config.js` | **The one file to edit.** Business details. |
| `assets/site.css` | All the styling — colours, type, layout, light and dark. |
| `assets/site.js` | Shared behaviour. You shouldn't need to change this. |
| `assets/effects.css` | The motion layer — reveals, painted headings, the CCTV scene. |
| `assets/effects.js` | What drives that motion. Each part fails independently. |
| `assets/themes.css` | **Temporary.** The five alternative palettes and the switcher's own styling. |
| `assets/theme-switcher.js` | **Temporary.** Applies the saved palette and builds the switcher. |

To change the look site-wide, edit the colour values at the top of `assets/site.css`.
Everything else is built from those tokens.

---

## Choosing a colour theme

There is a **Theme** button in the bottom-right corner of every page. It offers six
warm palettes, and your choice is saved in your own browser — it is not saved to the
site, so visitors always see whatever palette is set as the default in
`assets/site.css`. Terracotta & Sand is currently that default.

`themes.html` still shows all six side by side, which is useful for comparing them at
a glance rather than one at a time.

### Making a choice permanent, and removing the switcher

Once a palette is settled on:

1. If it is **not** Terracotta, open `assets/themes.css`, find that palette's block
   (e.g. `:root[data-palette="copper"]`), and copy its values over the matching token
   names in the `:root` block at the top of `assets/site.css`. Do the same for its dark
   variant.
2. Delete `assets/themes.css` and `assets/theme-switcher.js`.
3. In each of the six pages, delete the two lines that load them from `<head>`:
   ```html
   <link rel="stylesheet" href="assets/themes.css">
   <script src="assets/theme-switcher.js"></script>
   ```
4. Optionally delete `themes.html` too.

Nothing else references either file, and the switcher builds its own markup from
script, so there is no leftover HTML to hunt down.

---

## Before it goes to real customers

Two bits of content are assumptions, not facts. Both are marked with an HTML comment in
the source — edit or delete anything that isn't accurate:

1. **The home page stats strip** claims a *free site survey* and *brand warranty on all
   equipment*.
2. **`cctv.html`** mentions *annual maintenance contracts* and same-day completion on most
   home and shop jobs.

There is deliberately **no pricing anywhere on the site** — every quote is described as
following a site survey.

### Search visibility

Once the business name and city are known, update the `<title>` and
`<meta name="description">` near the top of each page to include them — local search
depends heavily on that. Each page already has its own title and description, so each
service can rank on its own.

The `og:title` and `og:description` tags are what show as the preview card when the link
is shared on WhatsApp.

---

## Publishing changes

GitHub Pages serves the site from the `main` branch. Any push republishes it, usually
within a minute:

```bash
git add -A
git commit -m "Add business details"
git push
```

## Using a custom domain later

Buy the domain, add a file named `CNAME` at the root of this repo containing just the
domain (e.g. `example.com`), point the domain's DNS at GitHub Pages, then set the custom
domain under **Settings → Pages**.

---

## Notes on the build

- The camera grid on the home page is drawn entirely in CSS. There are no images anywhere
  on the site, and nothing on it claims to be real footage.
- **The CCTV animations** are three, and each one shows something a real system does:
  the camera wall cycles through its channels one at a time; a motion-detection box locks
  onto movement, tracks it across the frame, then lets go; and the camera on `cctv.html`
  sweeps its coverage arc with detection rings pulsing outward. All three stop dead under
  `prefers-reduced-motion`, so nothing moves for a visitor who has asked for that.
- **Colour tokens are named for their role, not their hue** — `--clay` (brand),
  `--honey` (the call-to-action accent) and `--ok` (status only). Swapping the palette
  means changing those values, not hunting for hard-coded colours further down the file.
- **Green is deliberate.** The healthy-disk status dot stays green in every palette,
  because it means "fine" — that is the one place a warm colour would read wrong.
- The requirement builder's storage maths uses H.265 continuous recording at roughly
  10 GB, 22 GB and 38 GB per camera per day for 2 MP, 5 MP and 8 MP. Motion-only is
  estimated at 40% of that. Adjust the `GB_PER_DAY` and `RUN` tables in `assets/site.js`
  if his real-world figures differ.
- Light and dark themes both follow the visitor's phone or computer setting.
- Fonts are Bricolage Grotesque, Figtree and IBM Plex Mono, loaded from Google Fonts.
