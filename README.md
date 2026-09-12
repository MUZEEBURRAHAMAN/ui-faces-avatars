# Avatarly — Avatar Collections

**1,098 hand-curated avatars, robots, and logo marks for designers and developers.**

4K resolution (4096x4096) · PNG / JPG / WebP · sRGB color space · No attribution required · Fully self-hosted, zero third-party APIs

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE.md)
[![Collections](https://img.shields.io/badge/Collections-11-blue.svg)](#collections)
[![Total Avatars](https://img.shields.io/badge/Avatars-1098-green.svg)](#collections)
[![Resolution](https://img.shields.io/badge/Resolution-4K-orange.svg)](#image-specifications)

---

This is the image data store that powers the [Avatarly](https://github.com/MUZEEBURRAHAMAN/ui-faces-avatars) Figma plugin — an infinite avatar & quick-fill studio for mockups, dashboards, and prototypes.

## Collections

| Collection | Count | Style |
|-----------|-------|-------|
| **[Office Avatars](collections/office-avatars/)** | 100 | Photorealistic — SaaS & workplace |
| **[Everyday Avatars](collections/everyday-avatars/)** | 100 | Photorealistic — authentic people |
| **[Sculpted Avatars](collections/sculpted-avatars/)** | 100 | 3D-rendered busts & clay |
| **[Sketch B&W](collections/illustrated-avatars/)** | 100 | Editorial line-art illustration |
| **[Cartoon Avatars](collections/cartoon-avatars/)** | 100 | Friendly cartoon characters |
| **[Comic Color](collections/doodle-avatars/)** | 100 | Hand-drawn, colorful doodles |
| **[Abstract Avatars](collections/abstract-avatars/)** | 100 | Bold geometric art |
| **[Quiet Avatars](collections/quiet-avatars/)** | 100 | Minimal line-art on pastel backgrounds |
| **[Company Logos](collections/company-avatars/)** | 100 | Abstract logo-style marks |
| **[Memoji Avatars](collections/memoji-avatars/)** | 98 | Expressive 3D cartoon characters |
| **[Cyber Avatars](collections/cyber-avatars/)** | 100 | Sci-fi robots & bots |

---

## Quick Start

### Download via Git

```bash
git clone https://github.com/MUZEEBURRAHAMAN/ui-faces-avatars.git
```

### Use via CDN (jsDelivr)

```
https://cdn.jsdelivr.net/gh/MUZEEBURRAHAMAN/ui-faces-avatars@main/collections/office-avatars/preview/office-avatars-001.jpg
```

---

## Image Specifications

| Property | Value |
|----------|-------|
| Resolution | 4096 x 4096 px |
| Formats | PNG (lossless), JPG (95% quality), WebP (80% quality) |
| Color Space | sRGB |
| Background | Neutral pastel (avatars), transparent-friendly (logos) |

### Sizes Included

| Size | Dimensions | Format | Use Case |
|------|-----------|--------|----------|
| 4K (Original) | 4096x4096 | PNG | Print, large displays |
| Preview | 800x800 | JPG | Web mockups, presentations |
| Thumbnail | 200x200 | WebP | Grids, lists, dashboards |

---

## Folder Structure

```
ui-faces-avatars/
├── collections/
│   ├── office-avatars/
│   │   ├── 4k/                    # 4096x4096 PNG originals
│   │   │   ├── office-avatars-001.png
│   │   │   └── ...
│   │   ├── preview/               # 800x800 JPG
│   │   │   ├── office-avatars-001.jpg
│   │   │   └── ...
│   │   ├── thumbnails/            # 200x200 WebP
│   │   │   ├── office-avatars-001.webp
│   │   │   └── ...
│   │   └── README.md
│   ├── everyday-avatars/
│   └── ...
├── metadata/
│   ├── index.json                 # Master collection index
│   ├── office-avatars.json        # Per-collection metadata
│   └── ...
├── scripts/
│   ├── process-images.mjs         # Batch resize/convert/compress
│   ├── generate-metadata.mjs      # Auto-generate JSON metadata
│   └── generate-vectors.mjs       # Procedural SVG generators
├── LICENSE.md                      # CC BY 4.0
├── COMMERCIAL_LICENSE.md           # Commercial terms
├── CONTRIBUTING.md
└── README.md
```

---

## File Naming Convention

```
{collection-slug}-{number}.{ext}

Examples:
  office-avatars-001.png
  cyber-avatars-042.jpg
  memoji-avatars-015.webp
```

- Zero-padded 3-digit numbers (001-100)
- Lowercase kebab-case collection slug
- Consistent across all sizes (same base name, different directories)

---

## Metadata

Each collection includes structured JSON metadata. See [`metadata/`](metadata/) for full files.

### Collection-level (`metadata/office-avatars.json`)

```json
{
  "collection": {
    "id": "office-avatars",
    "name": "Office Avatars",
    "count": 100,
    "resolution": "4096x4096",
    "formats": ["png", "jpg", "webp"],
    "tags": ["professional", "corporate", "headshot"]
  },
  "avatars": [
    {
      "id": "office-001",
      "tags": ["professional", "smile", "glasses"],
      "dominant_colors": ["#4A4A4A"]
    }
  ]
}
```

### Master index (`metadata/index.json`)

Lists all 11 collections with counts, descriptions, and tags.

---

## License

### Free Use (CC BY 4.0)

All avatars in this repository are available under [Creative Commons Attribution 4.0](LICENSE.md):

- Use in personal and commercial projects
- Use in mockups, prototypes, presentations
- Modify, resize, crop as needed
- Attribution appreciated but not required for UI mockups

See [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md) for extended commercial terms.

---

## Usage

### Avatarly Figma Plugin

Install **Avatarly** in Figma to browse and fill any shape with these avatars in one click, with style presets, status badges, persona sync, and component-set generation.

### CSS Placeholder

```css
.avatar {
  background-image: url('https://cdn.jsdelivr.net/gh/MUZEEBURRAHAMAN/ui-faces-avatars@main/collections/office-avatars/thumbnails/office-avatars-001.webp');
  background-size: cover;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. We accept:
- Bug reports (broken images, metadata errors)
- Metadata improvements (better tags, color data)
- Script improvements

We do not accept avatar submissions at this time.

---

Made with care by [Avatarly](https://github.com/MUZEEBURRAHAMAN/ui-faces-avatars)
