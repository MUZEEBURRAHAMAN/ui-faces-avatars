# UI Faces — Avatar Collections

**518 hand-curated, high-resolution avatars for designers and developers.**

4K resolution (4096x4096) · PNG / JPG / WebP · sRGB color space · No attribution required

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE.md)
[![Collections](https://img.shields.io/badge/Collections-11-blue.svg)](#collections)
[![Total Avatars](https://img.shields.io/badge/Avatars-518-green.svg)](#collections)
[![Resolution](https://img.shields.io/badge/Resolution-4K-orange.svg)](#image-specifications)

---

## Collections

| Preview | Collection | Count | Style | Price |
|---------|-----------|-------|-------|-------|
| ![](assets/showcase/office-preview.jpg) | **[Office Avatars](collections/office-avatars/)** | 72 | Photorealistic | $12 |
| ![](assets/showcase/everyday-preview.jpg) | **[Everyday Avatars](collections/everyday-avatars/)** | 45 | Photorealistic | $12 |
| ![](assets/showcase/human-preview.jpg) | **[Human Avatars](collections/human-avatars/)** | 30 | Photorealistic | $12 |
| ![](assets/showcase/company-preview.jpg) | **[Company Avatars](collections/company-avatars/)** | 42 | Vector/Logo | $12 |
| ![](assets/showcase/abstract-preview.jpg) | **[Abstract Avatars](collections/abstract-avatars/)** | 30 | Geometric | $12 |
| ![](assets/showcase/sculpted-preview.jpg) | **[Sculpted Avatars](collections/sculpted-avatars/)** | 30 | 3D Rendered | $12 |
| ![](assets/showcase/doodle-preview.jpg) | **[Doodle Avatars](collections/doodle-avatars/)** | 32 | Hand-drawn | $24 |
| ![](assets/showcase/illustrated-preview.jpg) | **[Illustrated Avatars](collections/illustrated-avatars/)** | 30 | Editorial | $6 |
| ![](assets/showcase/cartoon-preview.jpg) | **[Cartoon Avatars](collections/cartoon-avatars/)** | 30 | Cartoon | $6 |
| ![](assets/showcase/quiet-preview.jpg) | **[Quiet Avatars](collections/quiet-avatars/)** | 30 | Minimal | $6 |
| ![](assets/showcase/people-preview.jpg) | **[People Bundle](collections/people-bundle/)** | 147 | Mixed Realistic | $24 |

> Each collection is limited to **100 licenses**. Once sold out, it's gone.

---

## Quick Start

### Download via Git

```bash
git clone https://github.com/YOUR_USERNAME/ui-faces-avatars.git
```

### Download a Single Collection

```bash
# Using GitHub CLI
gh release download v1.0.0 --pattern "office-avatars-*.zip"
```

### Use via CDN (jsDelivr)

```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ui-faces-avatars/collections/office-avatars/preview/office-avatars-001.jpg
```

### Use via npm (coming soon)

```bash
npm install @uifaces/avatars
```

---

## Image Specifications

| Property | Value |
|----------|-------|
| Resolution | 4096 x 4096 px |
| Formats | PNG (lossless), JPG (95% quality), WebP (80% quality) |
| Color Space | sRGB |
| Max File Size | 5 MB per image |
| Background | Neutral gray (photos), Transparent (illustrations) |

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
│   └── generate-preview-grid.mjs  # Create showcase grid images
├── assets/
│   ├── showcase/                  # Preview images for README
│   ├── social-previews/           # Open Graph images
│   └── badges/                    # Custom badges
├── .github/
│   └── workflows/
│       └── optimize-images.yml    # Auto-process on push
├── LICENSE.md                     # CC BY 4.0
├── COMMERCIAL_LICENSE.md          # Commercial terms
├── CONTRIBUTING.md
├── CHANGELOG.md
└── README.md
```

---

## File Naming Convention

```
{collection-slug}-{number}.{ext}

Examples:
  office-avatars-001.png
  office-avatars-042.jpg
  everyday-avatars-015.webp
  cartoon-avatars-030.png
```

- Zero-padded 3-digit numbers (001-999)
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
    "count": 72,
    "resolution": "4096x4096",
    "formats": ["png", "jpg", "webp"],
    "tags": ["professional", "corporate", "headshot"],
    "price": 12
  },
  "avatars": [
    {
      "id": "office-001",
      "gender": "female",
      "age_range": "25-35",
      "tags": ["professional", "smile", "glasses"],
      "dominant_colors": ["#4A4A4A", "#D4A574"]
    }
  ]
}
```

### Master index (`metadata/index.json`)

Lists all 11 collections with counts, descriptions, pricing, and license availability.

---

## License

### Free Use (CC BY 4.0)

All avatars in this repository are available under [Creative Commons Attribution 4.0](LICENSE.md):

- Use in personal and commercial projects
- Use in mockups, prototypes, presentations
- Modify, resize, crop as needed
- Attribution appreciated but not required for UI mockups

### Commercial License

For premium access with priority support and extended rights, purchase individual collections at [uifaces.co](https://uifaces.co).

Each collection is limited to **100 licenses**. See [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md) for full terms.

---

## Usage Examples

### Figma Plugin

Install the [UI Faces Figma Plugin](https://www.figma.com/community/plugin/...) to browse and insert avatars directly into your designs.

### React

```jsx
import officeAvatars from '@uifaces/avatars/metadata/office-avatars.json';

function AvatarGrid() {
  return (
    <div className="grid">
      {officeAvatars.avatars.map(a => (
        <img
          key={a.id}
          src={`/avatars/${a.files.preview}`}
          alt={`${a.gender} professional avatar`}
          width={80}
          height={80}
        />
      ))}
    </div>
  );
}
```

### CSS Placeholder

```css
.avatar {
  background-image: url('https://cdn.jsdelivr.net/gh/.../office-avatars/thumbnails/office-avatars-001.webp');
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

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with care by [UI Faces](https://uifaces.co)
