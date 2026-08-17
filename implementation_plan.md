# Ajay Sonawane — Premium Portfolio Implementation Plan

## Overview

Build a production-quality personal portfolio for Ajay Sonawane (Python Developer | Backend Developer | AI/ML Enthusiast) using **React + TypeScript + Tailwind CSS + Framer Motion**. The design follows a futuristic, minimal, dark-first aesthetic targeting recruiters for Python/Backend/AI-ML roles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| 3D | React Three Fiber / Three.js (hero only) |
| Icons | Lucide React |
| Fonts | Google Fonts — Inter + JetBrains Mono |
| Build | Vite |

---

## Project Structure

```
MY_PORTFOLIO/
├── public/
│   ├── favicon.ico
│   └── resume.pdf          ← placeholder
├── src/
│   ├── assets/
│   │   └── ajay-photo.jpg  ← profile photo
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   ├── MagneticButton.tsx
│   │   │   └── ScrollProgress.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── TechStack.tsx
│   │       ├── Projects.tsx
│   │       ├── Internship.tsx
│   │       ├── Education.tsx
│   │       ├── Certification.tsx
│   │       ├── Terminal.tsx
│   │       ├── CareerRoadmap.tsx
│   │       └── Contact.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts
│   │   └── useScrollProgress.ts
│   ├── data/
│   │   └── portfolio.ts    ← all content data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## Sections & Key Implementations

### 1. Custom Cursor (`CustomCursor.tsx`)
- Small glowing dot that follows mouse
- Expands on hover of interactive elements
- Blends with background using `mix-blend-difference`
- Disabled on mobile via media query

### 2. Navbar
- Fixed, glassmorphism pill
- Logo: `<AS />`
- Links: About · Skills · Projects · Experience · Contact
- Active section highlight via IntersectionObserver
- Mobile: hamburger drawer

### 3. Hero Section
- Full-screen dark canvas
- Animated background: CSS grid + floating particles (canvas-based)
- Profile image: hexagonal frame with rotating gradient border + glow
- Mouse-follow 3D tilt effect on image card
- Text reveal: character-by-character name animation (Framer Motion)
- "OPEN TO WORK" badge with pulse animation
- CTA buttons: magnetic effect on hover
- Social links: GitHub, LinkedIn, Email
- Entrance sequence: staggered timeline

### 4. About Section
- Split layout: text left, visual right
- Visual: animated skill bars (without fake percentages — using relative fill widths)
- Scroll-triggered reveal animations

### 5. Tech Stack — "Technology Universe"
- Category tabs: Programming / Backend / Database / Libraries / AI-ML / Tools
- Floating icon cards with glassmorphism
- Hover: lift + glow + tooltip description
- Grid layout animates on scroll

### 6. Projects Section
- Full-width cards with project visual
- Hover: card expand, tech tags appear, CTA slides up
- Click: full-screen modal case study
- Modal includes: overview, problem, solution, architecture, technologies, features, challenges, learnings

### 7. Internship Timeline
- Vertical timeline with animated connecting line
- Tech tags animate in with stagger
- Connection lines between related technologies

### 8. Education Timeline
- Minimal card-based timeline
- Subtle entrance animations

### 9. Certification
- Premium certificate-style card
- Shimmer effect on hover

### 10. Terminal Section ("Currently Building")
- Dark terminal UI with typing animation
- Blinking cursor
- Command sequence loops

### 11. Career Roadmap ("Where I'm Heading")
- Vertical flow diagram
- Each stage animates when entering viewport
- Glowing active stage

### 12. Contact Section
- Dramatic full-width CTA
- Contact form with validation
- Social link cards
- Submission state animations

### 13. Footer
- Minimal, dynamic year
- Social links

---

## Animation Philosophy

- **Entrance**: Elements slide + fade in from bottom on scroll (IntersectionObserver + Framer Motion)
- **Hero**: Staggered timeline (0–2s) for full cinematic load
- **Hover**: Scale, glow, rotate — GPU transforms only
- **Cursor**: Smooth spring physics
- **Performance**: `will-change: transform` on animated elements, `prefers-reduced-motion` respected
- **Mobile**: Particle count reduced, 3D disabled, cursor disabled

---

## Proposed Changes

### [NEW] React + Vite project scaffold
Initialize via `npx create-vite@latest ./ --template react-ts`

### [NEW] Core files
All components, hooks, data, and styling files listed above.

---

## Verification Plan

### Automated
- `npm run build` — ensure no TypeScript errors
- Check all sections render on localhost

### Manual
- Verify hero animation sequence
- Test project modal open/close
- Test contact form validation
- Verify mobile responsiveness
- Test keyboard navigation
- Verify `prefers-reduced-motion` reduces animations
