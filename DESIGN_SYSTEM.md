# Marge SaaS – Design System

Premium, modern SaaS UI. React + Tailwind CSS (primary). Material UI **icons only** (no MUI components). No Framer Motion or animation frameworks.

---

## Design Goals

- Extremely clean, fast loading, professional SaaS look
- Minimal yet powerful, zero visual clutter
- Designed for real productivity

---

## Global Style System

| Token | Value |
|-------|--------|
| **Palette** | Neutral (gray/zinc/slate). One accent only (actions). |
| **Radius** | 12–16px (`rounded-saas`, `rounded-saas-lg`) |
| **Borders** | Soft borders instead of heavy shadows |
| **Hover** | Very subtle (opacity / color only) |
| **Transitions** | No complex transitions |

**Tailwind:** `tailwind.config.js` extends `colors.neutral`, `colors.accent`, `borderRadius.saas`, `maxWidth.content` (1280px). 8px spacing grid.

**CSS:** `src/index.css` – `@tailwind base/components/utilities`. Minimal custom: focus ring (accent), `.input-saas`, `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, tooltip via `[data-tooltip]`.

---

## Typography

- **Font:** Inter / Geist / System UI (`font-sans`)
- **Page title:** `text-2xl font-semibold`
- **Section title:** `text-lg font-medium`
- **Body:** `text-sm`; proper line-height and spacing
- No decorative fonts

---

## Layout Structure

- **Sidebar:** Fixed, collapsible via width only (64px collapsed, 224px expanded). Icon + label; expand on toggle. No sliding animation.
- **Top bar:** Page context; role indicator (text only).
- **Content:** `max-w-content` (1280px) container; grid-based spacing (8px system).

---

## Sidebar Design

- Icon + label layout
- Compact by default (optional; currently expanded by default)
- Expand/collapse = width change only
- Active state: `border-l-2 border-accent bg-accent-muted/50 text-accent`
- Mobile: sidebar becomes overlay/dropdown; essential actions only

---

## Button Design

| Type | Usage |
|------|--------|
| **Primary** | `.btn-primary` – solid accent, hover = shade change |
| **Secondary** | `.btn-secondary` – border + text |
| **Tertiary** | `.btn-tertiary` – text only |
| **Focus** | Ring (accessibility): `focus:ring-2 focus:ring-accent focus:ring-offset-2` |

---

## Icons (MUI Icons only)

- Icons only where meaningful; no decoration-only icons
- Icons on hover or on selection; tooltips via `data-tooltip` or `title`

---

## Forms & Inputs

- `.input-saas` – clean input, subtle border, focus ring only
- Inline helper text; error state below input
- Voice mic icon inside input (e.g. Resume Builder summary)

---

## Resume / Portfolio Builder UI

- **Layout:** Split (controls \| preview)
- **Controls:** Vertical panels (Tailwind grid/flex)
- **Preview:** Real document spacing; edit icons on hover
- No drag animation; re-order logic only

---

## Admin UX

- Same UI for all roles; features gated by permission
- Admin actions hidden unless allowed
- Role indicator in top bar (text only)

---

## Responsive Strategy

- Desktop-first; tablet optimized
- Mobile: sidebar = dropdown/overlay; essential actions only

---

## Performance Rules

- No animation libraries
- No heavy shadows (use soft borders)
- No unnecessary DOM
- Prefer Tailwind utilities over custom CSS

---

## File Reference

| Area | Files |
|------|--------|
| **Config** | `tailwind.config.js`, `src/index.css` |
| **Layout** | `src/components/layout/Sidebar.jsx`, `Topbar.jsx`, `src/pages/dashboard/DashboardLayout.jsx` |
| **Auth** | `src/pages/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `RequestAdmin.jsx` |
| **Dashboard** | `src/pages/dashboard/user/UserDashboard.jsx`, `JobApplications.jsx`, `ResumeBuilder.jsx` |
| **Admin** | `src/pages/dashboard/admin/JobAdminDashboard.jsx`, etc. |
