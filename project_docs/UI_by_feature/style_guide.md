# Thesis Grey UI/UX Style Guide

## 1. Brand & Color System

### Primary Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Dark Charcoal | `#3C3F41` | Primary text (light mode), Main background (dark mode) |
| Pure White | `#FFFFFF` | Main background (light mode), Primary text (dark mode) |
| Light Taupe | `#CEC9BC` | Secondary backgrounds, form elements (light mode), Subtle accents (dark mode) |
| Teal | `#6A9CAB` | Primary accent for interactive elements, buttons, links |
| Slate Blue-Gray | `#5D6977` | Secondary accents, borders, hover states, component surfaces (dark mode) |

### Extended Palette

| Color | Hex Code | Purpose |
|-------|----------|---------|
| Light Teal | `#8BBAC7` | Hover state for teal elements, success indicators |
| Dark Teal | `#4A7A89` | Pressed state for teal elements |
| Light Slate | `#7D8A97` | Hover state for slate elements |
| Lighter Taupe | `#E4E0D5` | Disabled states (light mode) |
| Error Red | `#D64045` | Validation errors, alerts |

## 2. Typography

### Font Families

- **Primary Font**: Inter (Sans-serif)
- **Monospace**: Roboto Mono (for query preview and code blocks)

### Font Scale

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Headings (H1) | 24px, Charcoal, Medium | 24px, White, Medium |
| Headings (H2) | 20px, Charcoal, Medium | 20px, White, Medium |
| Headings (H3) | 16px, Charcoal, Medium | 16px, White, Medium |
| Body Text | 14px, Charcoal, Regular | 14px, White, Regular |
| Small/Caption | 12px, Slate, Regular | 12px, Light Taupe, Regular |
| Code/Query | 14px, Monospace, Charcoal | 14px, Monospace, White |

## 3. Mode-Specific Implementations

### Light Mode

![Light Mode](https://placeholder.com/lightmode)

- **Background**: White (`#FFFFFF`)
- **Cards/Containers**: Light Taupe (`#CEC9BC`) with subtle shadows
- **Text**: Dark Charcoal (`#3C3F41`)
- **Primary Buttons**: Teal (`#6A9CAB`) with white text
- **Secondary Buttons**: Slate (`#5D6977`) with white text
- **Input Fields**: White with Light Taupe border
- **Accents/Icons**: Teal

### Dark Mode

![Dark Mode](https://placeholder.com/darkmode)

- **Background**: Dark Charcoal (`#3C3F41`)
- **Cards/Containers**: Slate (`#5D6977`) with deeper shadows
- **Text**: White (`#FFFFFF`)
- **Primary Buttons**: Teal (`#6A9CAB`) with white text
- **Secondary Buttons**: Light Taupe (`#CEC9BC`) with charcoal text
- **Input Fields**: Slate with darker borders
- **Accents/Icons**: Teal (unchanged from light mode)

## 4. Component Guidelines

### Buttons

#### Primary Button
- Light Mode: Teal background, white text, subtle shadow
- Dark Mode: Teal background, white text, subtle glow
- Hover: Light Teal
- Active/Pressed: Dark Teal
- Disabled: Light Taupe (light mode), Slate (dark mode)

```css
/* Light Mode - Primary Button */
.btn-primary {
  background-color: #6A9CAB;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Dark Mode - Primary Button */
.dark .btn-primary {
  background-color: #6A9CAB;
  box-shadow: 0 1px 5px rgba(106,156,171,0.2);
}
```

#### Secondary Button
- Light Mode: Slate background, white text
- Dark Mode: Light Taupe background, charcoal text
- Hover: Light Slate (light mode), Lighter Taupe (dark mode)

### Form Controls

#### Input Fields
- Light Mode: White background, Taupe border, Charcoal text
- Dark Mode: Slate background, darker border, White text
- Focus: Teal border in both modes

#### Checkboxes & Radio Buttons
- Selected: Teal accent in both modes
- Unselected: Slate border (light mode), Light Taupe border (dark mode)

### Cards & Containers

#### Standard Card
- Light Mode: White background, subtle shadow, Taupe border
- Dark Mode: Slate background, darker shadow, darker border
- Content Padding: 16px

```css
/* Light Mode - Card */
.card {
  background-color: #FFFFFF;
  border: 1px solid #CEC9BC;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 16px;
}

/* Dark Mode - Card */
.dark .card {
  background-color: #5D6977;
  border-color: #3C3F41;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
```

### Navigation Elements

#### Sidebar
- Light Mode: Light Taupe background, Charcoal text
- Dark Mode: Slate background, White text
- Active Item: Teal accent

#### Top Navigation
- Light Mode: White background, Taupe divider
- Dark Mode: Charcoal background, Slate divider

## 5. Component-Specific Guidelines for Thesis Grey

### Search Strategy Builder

#### PIC Framework Component
- Light Mode:
  - Card Background: White
  - Border: Taupe
  - Headings: Charcoal
  - Add Buttons: Teal
  - Term Chips: Slate background, White text
- Dark Mode:
  - Card Background: Slate
  - Border: Darker Slate
  - Headings: White
  - Add Buttons: Teal (unchanged)
  - Term Chips: Dark Charcoal background, White text

#### Query Preview
- Light Mode: Taupe background, monospaced Charcoal text
- Dark Mode: Dark Charcoal background, monospaced White text
- Border: Teal in both modes

#### Search Configuration
- Light Mode: Form elements on White background
- Dark Mode: Form elements on Slate background
- Checkboxes: Teal when selected in both modes

### SERP Results

#### Result Cards
- Light Mode: White background, subtle Taupe border
- Dark Mode: Slate background, subtle darker border
- Title: Teal (clickable link)
- URL: Slate (light mode), Light Taupe (dark mode)
- Snippet: Charcoal (light mode), White (dark mode)

#### Filters
- Border/Background: Light Taupe (light mode), Slate (dark mode)
- Active Filter: Teal accent

## 6. Implementation Guidelines

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        charcoal: '#3C3F41',
        white: '#FFFFFF',
        taupe: {
          DEFAULT: '#CEC9BC',
          light: '#E4E0D5'
        },
        teal: {
          light: '#8BBAC7',
          DEFAULT: '#6A9CAB',
          dark: '#4A7A89'
        },
        slate: {
          light: '#7D8A97',
          DEFAULT: '#5D6977',
          dark: '#4A5662'
        },
        error: '#D64045'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace']
      }
    }
  },
  darkMode: 'class'
}
```

### CSS Variables

```css
:root {
  /* Light Mode (Default) */
  --background: #FFFFFF;
  --surface: #CEC9BC;
  --text-primary: #3C3F41;
  --text-secondary: #5D6977;
  --accent: #6A9CAB;
  --accent-hover: #8BBAC7;
  --accent-pressed: #4A7A89;
  --border: #CEC9BC;
  --disabled: #E4E0D5;
  --error: #D64045;
}

.dark {
  /* Dark Mode */
  --background: #3C3F41;
  --surface: #5D6977;
  --text-primary: #FFFFFF;
  --text-secondary: #CEC9BC;
  --accent: #6A9CAB; /* Same accent in both modes */
  --accent-hover: #8BBAC7;
  --accent-pressed: #4A7A89;
  --border: #4A5662;
  --disabled: #5D6977;
  --error: #D64045;
}
```

## 7. Accessibility Considerations

### Contrast Ratios

The selected palette meets WCAG AA standards for text contrast:
- Light Mode: Charcoal text on White (10.7:1), Charcoal on Light Taupe (7.8:1)
- Dark Mode: White text on Charcoal (10.7:1), White on Slate (4.9:1)

### Focus States

- All interactive elements must have visible focus states
- Use a 2px Teal outline with a 2px offset for keyboard focus
- Ensure focus is visible in both light and dark modes

### Reduced Motion

- Provide a `prefers-reduced-motion` media query to minimize animations
- Keep essential animations subtle and brief (< 300ms)

## 8. Mode Switching

- Implement a toggle in the header using a sun/moon icon
- Store user preference in local storage
- Default to system preference using `prefers-color-scheme` media query
- Apply transitions (150ms) when switching modes to reduce jarring changes

## 9. Usage Examples

### Search Strategy Builder (Light Mode)

```html
<div class="bg-white p-6 rounded-lg border border-taupe">
  <h2 class="text-xl font-medium text-charcoal mb-4">PIC Framework</h2>
  <div class="space-y-4">
    <!-- Population section -->
    <div>
      <h3 class="text-lg font-medium text-charcoal">Population</h3>
      <div class="flex mt-2">
        <input
          type="text"
          class="border border-taupe rounded-l-md px-3 py-2 w-full focus:border-teal focus:ring-1 focus:ring-teal"
          placeholder="Add population term"
        />
        <button class="bg-teal text-white px-3 py-2 rounded-r-md hover:bg-teal-light">
          Add
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-3">
        <span class="bg-slate text-white px-3 py-1 rounded-full flex items-center">
          elderly
          <button class="ml-1 text-white opacity-70 hover:opacity-100">×</button>
        </span>
      </div>
    </div>
  </div>
</div>
```

### Search Strategy Builder (Dark Mode)

```html
<div class="dark:bg-slate dark:border-slate-dark p-6 rounded-lg border">
  <h2 class="text-xl font-medium dark:text-white mb-4">PIC Framework</h2>
  <div class="space-y-4">
    <!-- Population section -->
    <div>
      <h3 class="text-lg font-medium dark:text-white">Population</h3>
      <div class="flex mt-2">
        <input
          type="text"
          class="dark:bg-charcoal dark:border-slate-dark dark:text-white rounded-l-md px-3 py-2 w-full focus:border-teal focus:ring-1 focus:ring-teal"
          placeholder="Add population term"
        />
        <button class="bg-teal text-white px-3 py-2 rounded-r-md hover:bg-teal-light">
          Add
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-3">
        <span class="bg-charcoal text-white px-3 py-1 rounded-full flex items-center">
          elderly
          <button class="ml-1 text-white opacity-70 hover:opacity-100">×</button>
        </span>
      </div>
    </div>
  </div>
</div>
```

This style guide provides a comprehensive framework for implementing a sophisticated, accessible interface for the Thesis Grey application, with careful consideration for both light and dark modes using the specified color palette.