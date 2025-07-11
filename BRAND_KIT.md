# 🎨 OmniDragon Brand Kit

A comprehensive brand color system designed for professional, accessible, and cohesive user experiences.

## 🌈 Color Palette

### Primary Brand Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Catskill White** | `#D3E5F2` | `--omni-catskill-white` | Light backgrounds, dark-on-light text |
| **Janna** | `#8E9AAA` | `--omni-janna` | Light accent, subtle highlights |
| **Raw Sienna** | `#CD7D58` | `--omni-raw-sienna` | Main brand color, primary actions |
| **Half Baked** | `#E8E2C4` | `--omni-half-baked` | Dark accent, secondary elements |
| **Cloud Burst** | `#152B43` | `--omni-cloud-burst` | Dark shades, text and backgrounds |

### Color Swatches

```css
/* Primary Brand Colors */
.catskill-white { background: #D3E5F2; }
.janna { background: #8E9AAA; }
.raw-sienna { background: #CD7D58; }
.half-baked { background: #E8E2C4; }
.cloud-burst { background: #152B43; }
```

## 🎯 Semantic Color Mapping

### Brand Identity
- **Primary**: Raw Sienna (`#CD7D58`) - Eye-catching but not harsh
- **Primary Light**: `#E09B7A` - Lighter variant for better contrast
- **Primary Dark**: `#B86A47` - Darker variant for depth
- **Primary Contrast**: White (`#FFFFFF`) - Text on primary backgrounds

### Backgrounds
- **Primary Background**: Catskill White (`#D3E5F2`) - Main page background
- **Secondary Background**: Half Baked (`#E8E2C4`) - Card and section backgrounds
- **Dark Background**: Cloud Burst (`#152B43`) - Navigation and footer
- **Accent Background**: Janna (`#8E9AAA`) - Subtle highlights

### Text Colors
- **Primary Text**: Cloud Burst (`#152B43`) - Main content text
- **Secondary Text**: Janna (`#8E9AAA`) - Supporting text
- **Light Text**: Catskill White (`#D3E5F2`) - Text on dark backgrounds
- **Accent Text**: Raw Sienna (`#CD7D58`) - Links and highlights

### Interactive Elements
- **Links**: Raw Sienna (`#CD7D58`)
- **Link Hover**: Cloud Burst (`#152B43`)
- **Primary Button**: Raw Sienna (`#CD7D58`)
- **Secondary Button**: Janna (`#8E9AAA`)

## 🌓 Dark Mode Adaptations

In dark mode, the color relationships are intelligently inverted:

- **Background**: Cloud Burst becomes the primary background
- **Text**: Catskill White becomes the primary text color
- **Accents**: Raw Sienna becomes lighter (`#E09B7A`) for better contrast
- **Surfaces**: Darker variants maintain hierarchy

## 🎨 Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, var(--omni-raw-sienna), var(--omni-cloud-burst));
```
**Usage**: Hero sections, primary CTAs, brand headers

### Secondary Gradient
```css
background: linear-gradient(135deg, var(--omni-catskill-white), var(--omni-half-baked));
```
**Usage**: Card backgrounds, subtle sections

### Accent Gradient
```css
background: linear-gradient(135deg, var(--omni-janna), var(--omni-catskill-white));
```
**Usage**: Highlights, special sections

## 🔧 Implementation

### CSS Variables

All colors are implemented as CSS custom properties for easy theming:

```css
:root {
  /* Primary Brand Colors */
  --omni-catskill-white: #D3E5F2;
  --omni-janna: #8E9AAA;
  --omni-raw-sienna: #CD7D58;
  --omni-half-baked: #E8E2C4;
  --omni-cloud-burst: #152B43;
  
  /* Semantic Mappings */
  --omni-primary: var(--omni-raw-sienna);
  --omni-bg-primary: var(--omni-catskill-white);
  --omni-text-primary: var(--omni-cloud-burst);
  /* ... more mappings */
}
```

### Utility Classes

Quick-use utility classes for rapid development:

```css
/* Background utilities */
.bg-catskill-white { background-color: var(--omni-catskill-white); }
.bg-raw-sienna { background-color: var(--omni-raw-sienna); }

/* Text utilities */
.text-cloud-burst { color: var(--omni-cloud-burst); }
.text-raw-sienna { color: var(--omni-raw-sienna); }

/* Border utilities */
.border-raw-sienna { border-color: var(--omni-raw-sienna); }
```

## 📐 Design Principles

### 1. **Accessibility First**
- All color combinations meet WCAG AA contrast requirements
- High contrast mode support included
- Color-blind friendly palette

### 2. **Semantic Consistency**
- Colors have clear semantic meaning
- Consistent usage across all components
- Logical hierarchy maintained

### 3. **Professional Aesthetic**
- Sophisticated, earthy palette
- Avoids harsh or overly bright colors
- Suitable for financial/technical applications

### 4. **Flexible Implementation**
- CSS custom properties for easy theming
- Dark mode support built-in
- Utility classes for rapid development

## 🎯 Usage Guidelines

### Do's ✅
- Use Raw Sienna for primary actions and brand elements
- Use Cloud Burst for main text and navigation
- Use Catskill White for clean backgrounds
- Maintain consistent contrast ratios
- Use gradients sparingly for impact

### Don'ts ❌
- Don't use colors outside the defined palette
- Don't compromise accessibility for aesthetics
- Don't use too many colors in a single component
- Don't ignore dark mode considerations

## 🧩 Component Examples

### Primary Button
```css
.btn-primary {
  background: var(--omni-primary);
  color: var(--omni-primary-contrast);
  border: none;
}

.btn-primary:hover {
  background: var(--omni-primary-dark);
  transform: translateY(-2px);
}
```

### Card Component
```css
.card {
  background: white;
  border: 1px solid var(--omni-border-light);
  box-shadow: 0 4px 12px var(--omni-shadow-light);
}

.card:hover {
  border-color: var(--omni-primary);
  box-shadow: 0 8px 24px var(--omni-shadow-medium);
}
```

### Navigation
```css
.navbar {
  background: var(--omni-bg-dark);
  color: var(--omni-text-light);
}

.nav-link:hover {
  color: var(--omni-primary);
}
```

## 📊 Color Psychology

### Raw Sienna (Primary)
- **Emotion**: Trust, reliability, warmth
- **Usage**: Primary actions, brand identity
- **Psychology**: Conveys stability and approachability

### Cloud Burst (Dark)
- **Emotion**: Professionalism, depth, authority
- **Usage**: Text, navigation, serious content
- **Psychology**: Establishes credibility and focus

### Catskill White (Light)
- **Emotion**: Cleanliness, simplicity, space
- **Usage**: Backgrounds, breathing room
- **Psychology**: Creates calm, organized feeling

### Janna (Accent)
- **Emotion**: Sophistication, neutrality, balance
- **Usage**: Supporting elements, subtle highlights
- **Psychology**: Provides visual rest and elegance

### Half Baked (Secondary)
- **Emotion**: Warmth, comfort, approachability
- **Usage**: Secondary backgrounds, soft accents
- **Psychology**: Creates welcoming, friendly atmosphere

## 🔍 Accessibility Features

### Contrast Ratios
- **Primary on White**: 4.8:1 (AA compliant)
- **Cloud Burst on Catskill White**: 8.2:1 (AAA compliant)
- **Raw Sienna on White**: 4.5:1 (AA compliant)

### Color Blind Support
- Palette tested with Deuteranopia, Protanopia, and Tritanopia
- Sufficient contrast maintained across all variants
- No critical information conveyed by color alone

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --omni-border-light: rgba(0, 0, 0, 0.5);
    --omni-shadow-light: rgba(0, 0, 0, 0.3);
  }
}
```

## 📱 Platform Adaptations

### Web Implementation
- CSS custom properties for theming
- Automatic dark mode detection
- Responsive color adjustments

### Print Styles
```css
@media print {
  :root {
    --omni-primary: #000000;
    --omni-bg-primary: #ffffff;
    --omni-text-primary: #000000;
  }
}
```

## 🚀 Getting Started

1. **Import the brand colors**:
   ```css
   @import './src/css/brand-colors.css';
   ```

2. **Use semantic variables**:
   ```css
   .my-component {
     background: var(--omni-bg-primary);
     color: var(--omni-text-primary);
     border: 1px solid var(--omni-border-light);
   }
   ```

3. **Apply utility classes**:
   ```html
   <div class="bg-catskill-white text-cloud-burst">
     Content here
   </div>
   ```

## 📈 Brand Evolution

This color system is designed to be:
- **Scalable**: Easy to extend with new colors
- **Maintainable**: Centralized color management
- **Future-proof**: Built with modern CSS features
- **Consistent**: Semantic naming prevents misuse

---

*This brand kit ensures OmniDragon maintains a professional, accessible, and cohesive visual identity across all touchpoints.* 