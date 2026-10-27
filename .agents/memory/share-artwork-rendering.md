---
name: Share artwork rendering
description: Preserve the original rainbow emblem when exporting social artwork.
---

Use a browser-based SVG export when the artwork includes the linked rainbow emblem; do not rely on an SVG rasterizer's successful exit alone.

**Why:** The available ImageMagick renderer silently omitted linked PNG images, even though it produced a valid PNG. A successful browser render preserved the original emblem.

**How to apply:** Visually inspect exported artwork for the actual emblem, not just dimensions and text. Keep essential copy and branding within a centered square-safe area when adapting a wide card.
