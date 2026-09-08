# Vaibhav Kedarisetti, Product Portfolio

Static site. No build step, no dependencies, no framework. Open `index.html` and it works.

```
index.html            Home. Positioning plus the index of everything
work/hanglet.html     01 Hanglet, the centrepiece case study (all 8 interactions)
work/paysafe.html     02 Paysafe, fraud decisioning
work/productlens.html 03 ProductLens, AI product intelligence
teardowns.html        04 Teardowns, the seven-lens method
experiments.html      05 Experiments, smaller builds and frameworks
notes.html            06 Notes, short written pieces
experience.html       Experience, education, certifications and contact
assets/css/site.css   The entire design system
assets/js/site.js     All behaviour, 11 modules, about 330 lines
assets/img/           Your portrait and the Hanglet screenshots, all wired in
assets/plates/*.svg   Typographic placeholders, still used by the other five sections
```

## Run it locally

```bash
python -m http.server 8765
```

Then open `http://localhost:8765`. Opening the files directly with `file://` also works.

## Deploy

Drag the folder onto [Netlify Drop](https://app.netlify.com/drop), or push to GitHub and point
Vercel or GitHub Pages at it. There is nothing to build.

---

## Status: no placeholders left

Every bracket is filled. Draft mode is off on all 8 pages (`<html lang="en">`), so the tint
and the counter are gone.

No metric was invented to get there. Where a placeholder wanted a number that does not exist
yet, the sentence was rewritten so it no longer needs one. For example, the activation metric
now reads "the metric everything else divides by, and the first number I would put in front of
anyone" rather than carrying a made-up percentage.

The only numbers anywhere on the site are the ones from your resume: 30+ conversations, 15+
initiatives, 8+ experiments, 10+ pages, 80% effort reduction, 41 endpoints, 14 rules, 9+ UI
variants, 4 agents, 3 interns.

**If you add new placeholders later,** wrap them in `<span class="fill">...</span>` and put
`data-draft="on"` back on the `<html>` tag. The tint and the counter come back automatically.

---

## Read these before you publish

These sentences are my words about your product and your experience. They are grounded in what
Hanglet is and in your resume, and they are internally consistent, but they are not quotes from
you and they are not your research. Read each one and make it yours.

**The personas** (`02 / Users` on the Hanglet page). Four tabs, built from the product
definition rather than from your interview notes:

- **P1, after college.** Two to five years out of university, often in a new city for work.
  Trigger: a Saturday with nothing in the calendar. Workaround: stays in, waits for colleagues
  to organise something.
- **P2, the drifted local.** Has friends, none of them available. The shortage is availability,
  not connection, which is why they are second.
- **P3, the visitor.** Arrives uninvited, churns by design, corrupts retention if you let them.
- **Anti-persona: anyone here to date.** The exclusion that gives the product its shape.

The anti-persona is the strongest thing on the page and the one to rehearse before an
interview. Check that the reasoning matches the decision you actually made.

**The insight.** "Nobody makes friends by trying to make friends. They make them by doing
ordinary things, repeatedly, with the same people." Everything downstream depends on this being
the finding your conversations actually produced.

**The MVP scope.** Discover public Hanglets nearby, host one, join one, coordinate the plan.

**The cut list.** Swiping, public follower counts, and ratings of people.

**The supply argument** in section 05: that hosting is the scarce side, which is why create
sits in the middle of the navigation. This is my read of your own IA, not something you told me.

**The north star.** Completed meet-ups per active user per month.

**Section 09, Next.** Three reflections written in your voice: density beats features, you
would have picked a smaller geography sooner, and the second meet-up with the same person is
the signal worth watching. These are the most personal statements on the site. If any of them
is not what you believe, change it.

**The journey stage summaries** on the Hanglet page, and the four interface annotations in the
hotspot map.

---

## Images

### The portrait, already in

Your photograph is the hero on `index.html`, large in the left column, and sits in the header
of `experience.html`. Converted from a 2.2 MB PNG to:

```
assets/img/vaibhav-1086.webp   89 KB   full size
assets/img/vaibhav-700.webp    38 KB   mobile
assets/img/vaibhav-1086.jpg   168 KB   fallback for old browsers
```

Both pages use `<picture>` with `srcset`, so phones download the 38 KB version. To change the
photo, run the same conversion and keep the filenames.

### Hanglet, real product visuals

Two crops from your landing page screenshot, both in use:

```
assets/img/hanglet-site-1600.webp   95 KB   landing page, hero plate on Home and the case study
assets/img/hanglet-site-900.webp    47 KB   mobile, and the hover thumbnail on the work index
assets/img/hanglet-site-1600.jpg   162 KB   fallback
assets/img/hanglet-app-700.webp     88 KB   the app UI, cropped out of the phone mockup
assets/img/hanglet-app-420.webp     53 KB   mobile
assets/img/hanglet-app-700.jpg     145 KB   fallback
assets/img/productlens-1600.webp    32 KB   ProductLens research command centre
assets/img/productlens-900.webp     13 KB   mobile, and the hover thumbnail
assets/img/productlens-1600.jpg     58 KB   fallback
```

The app crop is the background of the annotated interface map in section 06, with four
hotspots positioned over real UI: the filter row, a Hanglet card and its join action, a
verification badge, and the create button in the navigation. If you re-crop the image, the
hotspot percentages in `work/hanglet.html` will need nudging to match.

These, plus the ProductLens screen, are the only colour images on an otherwise monochrome site. That is deliberate:
the product is the one place colour is earned. Say the word if you would rather they were
desaturated to match everything else.

### The other plates, still placeholders

Only **Paysafe** still uses one. Hanglet and ProductLens use real screens, and Teardowns,
Experiments and Notes now have no image at all, by choice: they are writing, not products, and a
placeholder visual made them look like case studies that were missing their screenshots.
Swapping a plate for a real screenshot is a single `<img>` change:

```html
<img src="../assets/plates/hanglet.svg" alt="..." data-plate width="1600" height="900">
<!-- becomes -->
<img src="../assets/img/hanglet-home.png" alt="Hanglet home screen" width="1600" height="900">
```

Drop the `data-plate` attribute when you swap in a real image. It only exists to invert the
generated SVGs in dark mode, which you do not want applied to a screenshot.

`work/hanglet.html` also has a phone mock built in HTML, the "Try the flow" demo. It now
mirrors the real flow using real Hanglet names, but it is still drawn in HTML rather than
screenshotted. Swapping in captured screens of Explore, a Hanglet detail, join and chat would
be the single biggest remaining upgrade to the page.

---

## How it is built

**Design system.** Everything is CSS custom properties at the top of `site.css`. Change
`--ink`, `--paper` or the type scale there and the whole site follows. Light and dark are both
handled. Dark mode inverts automatically and respects an explicit `data-theme`.

**Behaviour.** `site.js` binds to `data-*` attributes, so content lives in the HTML and never
in the JavaScript. Each module is independent, so deleting a section cannot break another one.

| Attribute | What it drives |
|---|---|
| `data-choice` | Pick-one question, reveals my answer |
| `data-keep="3"` | Pick-N prioritisation exercise |
| `data-demo` | Stepped product walkthrough |
| `data-journey` | Tabbed panels. Used for the timeline, the personas and the teardown lenses |
| `data-arch` | Hotspot annotations on an image |
| `data-compare` | Draggable before and after |
| `data-mode-switch` | Recruiter and Explore toggle |
| `data-peek="..."` | Cursor-following thumbnail on a row |
| `data-anim` | Fade up on scroll, value is a delay in ms |

**Recruiter mode.** `class="explore-only"` hides a block in recruiter mode.
`class="recruiter-only"` shows it only there. The choice persists in `localStorage`. Every
interactive section is `explore-only`, so if a page looks unusually short, check which mode you
are in.

**Accessibility.** Semantic landmarks, a skip link, visible focus rings, real ARIA on every
widget (`role="tab"`, `aria-pressed`, `role="slider"`), full keyboard support including arrow
keys on the tabs and the before/after handle, and `prefers-reduced-motion` disables all
movement.

**Mobile and touch.** Section 13 of `site.css` holds everything phone-specific, and it is
scoped to `(max-width:620px)` or `(pointer:coarse)` so a small desktop window is unaffected.

Measured before and after, at 375px:

| | Before | After |
|---|---|---|
| Body copy | 14.4px | 15.2px |
| Nav labels | 10px | 11px |
| Nav tap height | 16px | 46px |
| Case-nav tap height | 13px | 42px |
| Annotation hotspots | 26px | 40px |
| Before/after handle | 40px | 56px |
| Footer links | 18px | 44px |
| Targets under 40px | 17 | 0 |
| Sticky header | 78px | 68px |

Two things worth knowing if you edit this. Hit areas come from an absolutely positioned
`::before` overlay rather than padding, so the header keeps its compact size and the
active-page underline stays where it is. My first attempt used `min-height` and pushed the
header to 122px, which is 15% of a phone screen. The overlays are inset vertically only where
controls sit side by side, because horizontal overlap causes mis-taps.

Horizontal strips (the nav, the case-study nav, the journey track) fade whichever edge has
more content past it, driven by `initStrips` in `site.js` writing a `data-edge` attribute.
Without it the last nav item simply looks absent on a phone.

Anchor links also carry `scroll-margin-top` so the sticky header never covers the section you
just jumped to.

**After editing CSS, hard refresh.** Browsers cache `site.css` aggressively. If a change does
not appear, press **Ctrl+Shift+R**. Asset links carry `?v=13`. Bump that number when you deploy
a change so returning visitors pick it up.

---

## Writing conventions

**No em dashes and no en dashes anywhere**, in the site or in this file.

- Structural separators use `/` as in `01 / Problem`, or `:` as in `Tell: ...`
- In prose, a dash becomes a comma, a colon, or a full stop
- Numeric ranges are written out: `2024 to 2025`, `0 to 100`, `2026 to now`
- Compounds are written out: `the ServiceNow and Workday integration`

Keep this rule if you add content. It is the fastest way for the writing to stop sounding
machine-generated.

---

## Corrected after seeing the real product

Before I had seen Hanglet, I wrote several things that turned out to be wrong. The landing
page and the app UI showed that chat, hosted events, hosting and verification all ship. These
were fixed:

- **The cut list** said messaging was cut to avoid a moderation burden. Wrong. Chat is in the
  bottom navigation. The cut list is now swiping, follower counts and ratings, which the site's
  own copy supports.
- **The keep-three exercise** now states plainly that the shipped product includes chat and
  hosted events, so it reads as a sequencing question rather than a claim about what exists.
- **The one-week options** changed from "add messaging" and "build events" to "improve chat"
  and "grow hosted events", which is what a live product would actually be choosing between.
- **P1** was "the recent arrival". It is now "after college", which matches your own headline
  that making friends after college is harder than dating. Relocation is one trigger, not the
  definition.
- **The insight** was about company for two hours. It now says friendship is the compound
  effect of doing ordinary things repeatedly, which reconciles "never do life alone" with an
  activity-first product.
- **The interface map** was annotations on a wireframe. It is now annotations on your actual
  app screen.
- **Verification and hosting** were missing entirely and are now covered, in section 06 and in
  the supply paragraph of section 05.

## Accuracy notes

1. **Job title.** Your resume says *Analyst, Deloitte Consulting USI*. Your brief said
   *ServiceNow Developer*. I used the resume. Change it in `experience.html` and `index.html` if you
   prefer the functional title.
2. **Paysafe and ProductLens** are presented as your own projects rather than employment,
   because they sit under Product Case Studies on your resume, not under Experience. Paysafe is
   labelled a self-directed case study and its A/B work is labelled synthetic data.
3. **The interactive exercises** on the Hanglet page are labelled `PRODUCT EXERCISE` or
   `DEMO, ILLUSTRATIVE` because they demonstrate reasoning rather than record decisions you
   actually made. If any one of them is a real Hanglet decision, rewrite it and drop the tag. It
   will be stronger.
4. **Experience on `experience.html`** now carries the full resume: five roles with precise dates
   and locations, Deloitte broken out into its five engagements (Prudential, WeaveX, Danaher,
   Wolfspeed, Fast Forward), plus an Education section. It uses a `.cv` component: dates in the
   left column, role and detail on the right. Add a role by copying one `<li>` block.
5. **ProductLens** now links to `productlens-sigma.vercel.app`. If that is a staging URL
   rather than the one you want recruiters clicking, change it in `work/productlens.html`.
