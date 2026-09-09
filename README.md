# CCTV & Computer Services — website

A single-page website for a CCTV installation, electrical/fitting and computer service
business. One file, no build step, no dependencies.

**Live:** https://hedaprateek.github.io/cctv-services-site/

---

## Filling in the business details

Everything editable lives in one place. Open `index.html`, scroll to the bottom, and find
the `CONFIG` block inside the `<script>` tag:

```js
const CONFIG = {
  name:     "",   // e.g. "Sharma Security Systems"
  city:     "",   // e.g. "Indore"
  area:     "",   // e.g. "Indore, Dewas and Ujjain"
  phone:    "",   // e.g. "+91 98765 43210"
  whatsapp: "",   // digits only, with country code: "919876543210"
  email:    "",   // e.g. "info@example.com"
  sites:    "",   // number of sites completed, e.g. "180"
  years:    "",   // years in the trade, e.g. "9"
  hours:    "",   // e.g. "Mon–Sat, 10 am – 8 pm"
};
```

Fill in the values between the quotes. That single change:

- replaces every highlighted placeholder on the page,
- wires up the Call, WhatsApp and email buttons,
- makes the requirement builder send a pre-written WhatsApp enquiry,
- removes the amber "Template" strip at the top of the page automatically.

Any value left as `""` keeps showing a highlighted placeholder, so nothing silently
goes blank.

### The `whatsapp` value

Digits only — country code, no `+`, no spaces, no dashes. An Indian number
`+91 98765 43210` becomes `919876543210`.

---

## Before it goes to real customers

Two bits of content are assumptions, not facts. Both are marked with an HTML comment in
the source — edit or delete anything that isn't accurate:

1. **The hero trust strip** claims a *free site survey* and *brand warranty on all
   equipment*.
2. **The process section** mentions *annual maintenance contracts* and same-day
   completion on most residential and shop jobs.

There is deliberately **no pricing anywhere on the page** — every quote is described as
following a site survey.

### Search visibility

Once the business name and city are known, update these three things for local search:

- the `<title>` on line 14 — put the business name and city in it
- the `<meta name="description">` on line 6
- the `og:title` / `og:description` tags — these are what show as the preview card when
  the link is shared on WhatsApp

---

## Publishing changes

The site is served by GitHub Pages from the `main` branch. Any push republishes it,
usually within a minute:

```bash
git add index.html
git commit -m "Add business details"
git push
```

## Using a custom domain later

Buy the domain, then add a file named `CNAME` at the root of this repo containing just
the domain (e.g. `example.com`), point the domain's DNS at GitHub Pages, and set the
custom domain under **Settings → Pages** in this repository.

---

## What's in the page

| Section | Notes |
| --- | --- |
| Hero | Monitor wall drawn entirely in CSS — no images, no stock photos, nothing that claims to be real footage |
| CCTV | Analog, IP/PoE, outdoor, PTZ, storage, remote viewing, repair of existing systems |
| Electrical & fitting | The differentiator — conduit, power points, earthing, UPS backup, brackets |
| How a job runs | Survey → quote → install → handover |
| Requirement builder | Interactive: works out recorder channels, disk size, retention days and cable length, then drafts a WhatsApp enquiry |
| Computers | Repairs, formatting, upgrades, printers |
| Sales | New and second-hand, listed separately |
| Contact | Call / WhatsApp / email, and what a customer should send |

The requirement builder's storage maths uses H.265 continuous recording at roughly
10 GB, 22 GB and 38 GB per camera per day for 2 MP, 5 MP and 8 MP respectively;
motion-only recording is estimated at 40% of that. Adjust the `GB_PER_DAY` and `RUN`
tables in the script if his real-world figures differ.

The page supports light and dark automatically, following the visitor's phone or
computer setting.
