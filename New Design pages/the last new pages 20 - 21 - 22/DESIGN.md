---
name: Academic Heritage
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#3f4945'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#707975'
  outline-variant: '#bfc9c4'
  surface-tint: '#29695b'
  primary: '#00342b'
  on-primary: '#ffffff'
  primary-container: '#004d40'
  on-primary-container: '#7ebdac'
  inverse-primary: '#94d3c1'
  secondary: '#a14009'
  on-secondary: '#ffffff'
  secondary-container: '#fd844c'
  on-secondary-container: '#6a2500'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afefdd'
  primary-fixed-dim: '#94d3c1'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#065043'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7d2d00'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  sidebar-width: 280px
---

## Brand & Style
The design system is rooted in the "Academic Heritage" aesthetic, tailored specifically for Algerian students preparing for the BAC examinations. It prioritizes a calm, scholarly atmosphere that encourages deep focus and minimizes cognitive load.

The style is **Modern Academic**, blending traditional scholarly sensibilities with contemporary digital utility. It utilizes a flat-surface philosophy with minimal shadows to ensure the interface feels grounded and trustworthy rather than distracting. The emotional response is one of authority and reliability—positioning the platform as a serious companion for high-stakes educational milestones. 

The visual identity leverages the heritage of the region through a palette inspired by Mediterranean landscapes and traditional architecture, localized through a full **Right-to-Left (RTL)** layout.

## Colors
The palette is dominated by a warm, paper-like background to reduce eye strain during long study sessions.

- **Primary (#004D40):** Deep Forest Teal. Used for primary navigation, headings, and high-impact actions. It represents growth and academic stability.
- **Secondary (#C05621):** Terracotta. An accent color used sparingly for progress indicators, highlight states, or call-outs that require attention without being alarming.
- **Tertiary (#D4AF37):** Muted Gold. Reserved for achievement markers, premium features, or "Official" stamps of content verification.
- **Neutral (#FBF9F5):** Cream. The foundational surface color.
- **Text:** The primary text color is a very dark version of the teal (#002620) to maintain high contrast while remaining softer than pure black.

## Typography
The typography system balances the literary authority of serifs with the clarity of modern sans-serifs for the Arabic script. 

**Source Serif 4** is used for all headlines to evoke the feeling of an official textbook or a prestigious institution. It provides the "Heritage" aspect of the design system.

**IBM Plex Sans Arabic** (or a compatible system sans-serif) is utilized for body text and UI labels. It ensures that complex Arabic characters remain legible even at smaller sizes or on lower-resolution mobile screens. 

Line heights are intentionally generous to accommodate the diacritics in Arabic script and provide a breathable reading experience. All text alignment defaults to the right.

## Layout & Spacing
This design system employs a **Fluid Grid** with specific RTL structural requirements.

- **Desktop Layout:** Features a fixed-width persistent right-side sidebar (280px) for navigation, with a flexible content area on the left.
- **Mobile Layout:** The sidebar collapses into a bottom navigation bar. Subject categories are presented as horizontal scrolling chips at the top of the content area.
- **Rhythm:** An 8px-based spacing system (incremented by 4px for fine-tuning) ensures vertical consistency. 
- **Margins:** 16px on mobile, increasing to 24px-48px on desktop to allow for a centered "focus mode" for long-form articles and exam papers.

## Elevation & Depth
This design system avoids heavy shadows and floating layers in favor of **Tonal Layering** and **Ghost Borders**.

- **Level 0 (Base):** Neutral Cream (#FBF9F5).
- **Level 1 (Cards/Containers):** Pure white (#FFFFFF) with a very thin, 1px border in a muted version of the primary color (opacity 10%). This creates a subtle "inset" or "raised" feeling without the weight of a shadow.
- **Focus States:** When an element is focused, a 2px solid primary-color border is used.
- **Shadows:** Only used for temporary overlays like modals or dropdowns. These shadows are "Ambient"—highly diffused, using a teal-tinted dark color instead of black, with an opacity of 5-8%.

## Shapes
The shape language is **Rounded**, intended to soften the "strictness" of the academic content and make the platform feel approachable.

- Standard UI components (Inputs, Small Buttons) use a **0.5rem (8px)** radius.
- Larger containers and Card components use a **1rem (16px)** radius.
- Decorative elements or specific status tags may use "Pill" shapes for distinct visual contrast.

## Components

- **Buttons:** 
  - *Primary:* Solid Deep Forest Teal with White text. 0.5rem roundedness. 
  - *Secondary:* Ghost style—Primary color border (1px) and Primary color text.
- **Navigation (Desktop):** The right-side sidebar uses active state indicators consisting of a 4px vertical bar on the right edge of the active menu item and a subtle 5% Primary color background tint.
- **Navigation (Mobile):** A fixed bottom bar with 4-5 key icons. Active states use the Secondary Terracotta color for the icon.
- **Chips (Subject Selectors):** Rounded-full (pill-shaped) with a light teal background. When active, they transition to the Primary color with white text.
- **Input Fields:** Background is Pure White, border is 1px light teal. Labels are always right-aligned above the field in Label-MD typography.
- **Study Cards:** White background, 1px border, 1rem roundedness. They should include a subtle "Chapter" tag in the top-left (the opposite of the reading start direction) to balance the visual weight.
- **Progress Bars:** Use a thick (8px) track. The background is a 10% opacity version of the Primary color, and the progress fill is the Secondary Terracotta.