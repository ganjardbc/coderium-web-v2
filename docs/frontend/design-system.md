# Coderium V2 - Design System

## Overview

Dokumen ini mendefinisikan standar visual Coderium V2.

---

# Design Principles

## Developer-Focused

UI yang bersih, minimalis, dan tidak mengalihkan perhatian dari konten.

## Content First

Konten adalah yang utama. Layout harus mendukung readability.

## Dark Mode First

Mayoritas developer lebih nyaman dengan dark mode.

## Mobile Responsive

Visitor membaca konten dari berbagai device.

---

# Color Palette

## Brand Primary

```txt
#6366F1  # Indigo — primary brand color
```

Digunakan untuk:

* Primary button
* Active nav
* Link
* Highlight

## Brand Secondary

```txt
#8B5CF6  # Violet — secondary accent
```

---

## Neutral (Light Mode)

```txt
#FFFFFF  # White — background
#F9FAFB  # Gray 50 — surface
#F3F4F6  # Gray 100 — subtle background
#E5E7EB  # Gray 200 — border
#9CA3AF  # Gray 400 — muted text
#6B7280  # Gray 500 — secondary text
#374151  # Gray 700 — body text
#111827  # Gray 900 — heading text
```

---

## Neutral (Dark Mode)

```txt
#0F172A  # Slate 900 — dark background
#1E293B  # Slate 800 — dark surface
#334155  # Slate 700 — dark border
#64748B  # Slate 500 — dark muted text
#94A3B8  # Slate 400 — dark secondary text
#CBD5E1  # Slate 300 — dark body text
#F1F5F9  # Slate 100 — dark heading text
```

---

## Status Colors

```txt
#10B981  # Emerald 500 — success
#F59E0B  # Amber 500 — warning
#EF4444  # Red 500 — danger
#3B82F6  # Blue 500 — info
```

---

# Post Type Colors / Badges

```txt
article       → Indigo badge
carousel      → Violet badge
video         → Red badge
stack_gallery → Emerald badge
```

---

# Typography

## Font Family

```txt
Inter (UI, body text)
JetBrains Mono (code blocks)
```

Fallback:

```txt
sans-serif
monospace (code)
```

---

# Font Size Scale

```txt
12px  (xs — caption)
14px  (sm — meta, label)
16px  (base — body)
18px  (lg — lead text)
20px  (xl — small heading)
24px  (2xl — heading)
30px  (3xl — large heading)
36px  (4xl — hero)
```

---

# Border Radius

```txt
sm = 6px
md = 10px
lg = 14px
xl = 20px
full = 9999px
```

---

# Spacing Scale

```txt
4px
8px
12px
16px
24px
32px
48px
64px
96px
```

---

# Shadow

## Card

```txt
shadow-sm
```

## Modal / Sheet

```txt
shadow-xl
```

---

# Responsive Breakpoints

```txt
sm  = 640px
md  = 768px
lg  = 1024px
xl  = 1280px
2xl = 1536px
```

---

# Post Card Design

Setiap post card menampilkan:

```txt
Cover image (16:9 atau 4:3)
Post type badge
Title
Subtitle (truncated)
Tags
Views count
Likes count
Published date
```

---

# Playlist Card Design

```txt
Cover image
Title
Description (truncated)
Post count
```

---

# Loading States

Gunakan:

```txt
Skeleton Loader
```

---

# Empty States

Setiap halaman harus memiliki empty state:

```txt
Icon / Illustration
Title
Description
Primary Action (jika ada)
```

---

# Notification Types

```txt
Success — Emerald
Info    — Blue
Warning — Amber
Error   — Red
```

---

# Admin Sidebar

Struktur sidebar admin:

```txt
Dashboard
Posts
Playlists
Media
Analytics
Settings (profile, password, appearance, 2FA)
```

---

# Code Block Styling

Gunakan syntax highlighting.

Background:

```txt
Dark mode: #0F172A
Light mode: #F8FAFC
```

Font: JetBrains Mono.

---

# Accessibility

Minimum contrast: WCAG AA.

Keyboard navigation required di admin.
