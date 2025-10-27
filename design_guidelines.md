# Design Guidelines: AI-Powered Learning Community

## Design Approach

**Selected Approach:** Design System (Material Design-inspired) with education platform references

Drawing inspiration from LinkedIn Learning's professional clarity, Udemy's approachable interface, and Stack Overflow's content-first approach. The platform prioritizes functionality, trust-building, and efficient information discovery over pure visual impact.

**Core Principles:**
- **Clarity First**: Clear role differentiation and intuitive navigation
- **Trust & Credibility**: Professional appearance that builds confidence in the learning community
- **Scannable Content**: Easy-to-browse learning requests and tutor profiles
- **Purposeful Hierarchy**: Guide users to key actions (post requests, apply to teach)

---

## Typography

**Font Families:**
- Primary: Inter (via Google Fonts) - clean, modern, excellent readability
- Headings: Inter (600-700 weight)
- Body: Inter (400-500 weight)

**Scale:**
- Hero/Page Titles: text-4xl to text-5xl, font-semibold
- Section Headings: text-2xl to text-3xl, font-semibold
- Card Titles: text-xl, font-medium
- Body Text: text-base, font-normal
- Small Text/Meta: text-sm, font-normal
- Labels: text-sm, font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 8, 12, 16, 20** for consistency
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-8
- Form field spacing: space-y-4

**Container Strategy:**
- Max-width containers: max-w-7xl for main content areas
- Form containers: max-w-md for login/signup
- Dashboard: max-w-6xl for optimal readability
- Full-width sections for hero and major divisions

**Grid System:**
- Dashboard posts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Profile layout: Two-column split (sidebar + main content) on desktop
- Mobile-first: Always stack to single column on mobile

---

## Component Library

### Navigation
**Header:**
- Fixed top navigation with logo left, nav links center, auth buttons right
- Height: h-16
- Logo area with platform name and simple icon
- Navigation links: "Home", "Dashboard", "Profile" (authenticated users)
- Auth section: Login/Signup buttons or user menu dropdown
- Subtle bottom border for definition

### Hero Section (Home Page)
**Layout:**
- Split hero: 50/50 text and image on desktop
- Left: Headline + subheading + dual CTA buttons (Student/Tutor sign up)
- Right: Hero image showing diverse students collaborating or learning
- Height: min-h-[500px] on desktop, auto on mobile
- Padding: py-16 to py-20

**Image Specification:**
- Hero image: Modern, inclusive learning environment
- Warm, welcoming atmosphere with students using laptops/studying
- Professional photography style, not stock photo generic
- Position: Right side on desktop, above text on mobile

### Authentication Forms (Login/Signup)
- Centered card layout: max-w-md mx-auto
- Card with subtle shadow and rounded corners (rounded-lg)
- Padding: p-8
- Form spacing: space-y-6
- Input fields: Full width, h-12, rounded-md
- Role selector (Signup): Radio buttons or segmented control for Student/Tutor
- Primary CTA button: Full width, h-12
- Alternative action link below (e.g., "Don't have an account? Sign up")

### Dashboard
**Layout Structure:**
- Welcome section with user greeting and quick stats (posts created, applications)
- Filter/sort toolbar for browsing posts
- Card grid for learning requests
- Empty state for no posts

**Learning Request Cards:**
- Card structure: rounded-lg with subtle shadow
- Padding: p-6
- Header: Subject title (text-xl font-semibold)
- Meta info row: Student name, posted time (text-sm)
- Description snippet: 2-3 lines, truncated
- Tags/badges for subject area and level
- Footer: CTA button ("View Details" for tutors, "Edit/Delete" for students)
- Hover state: Slight elevation increase

**Stats Display:**
- Simple stat cards: 3-column grid on desktop
- Each card: rounded-lg, p-6
- Large number (text-3xl font-bold) + label (text-sm)

### Profile Page
**Layout:**
- Two-column: Sidebar (user info card) + Main content (editable form or details)
- Sidebar width: w-80 on desktop, full width on mobile
- User card: Avatar placeholder, name, role badge, join date
- Main section: Tabbed interface or single form for editing
- Form fields: Standard input styling matching auth forms
- Save/Cancel buttons at bottom

### Footer
- Simple, informative footer
- Three-column grid: About/Links, Quick Links, Contact
- Copyright and legal links at bottom
- Social media icon placeholders
- Height: auto with py-12 padding

### Common Components

**Buttons:**
- Primary: h-10 to h-12, px-6, rounded-md, font-medium
- Secondary: Same sizing, outlined or ghost variant
- Icon buttons: w-10 h-10, rounded-full
- Buttons on images: Backdrop blur effect (backdrop-blur-sm) with semi-transparent background

**Cards:**
- Base: rounded-lg with subtle shadow
- Padding: p-4 to p-6
- Consistent elevation system (shadow-sm, shadow-md)

**Badges/Tags:**
- Small rounded pills: px-3 py-1, text-xs, rounded-full
- Used for subjects, levels, status indicators

**Empty States:**
- Centered content with icon, heading, description, and CTA
- Padding: py-16

**Form Inputs:**
- Height: h-12
- Border radius: rounded-md
- Focus states with ring utility
- Labels above inputs: text-sm font-medium, mb-2

---

## Animations

**Minimal, Purposeful Animation:**
- Card hover: Subtle transform and shadow increase (transition-all duration-200)
- Button hover: Slight scale or opacity change
- Page transitions: Fade in effect for route changes
- NO scroll-triggered animations
- NO complex parallax or continuous animations

---

## Images

**Where Images Are Used:**
1. **Hero Section (Home):** Large feature image showing collaborative learning environment
   - Position: Right 50% of hero on desktop
   - Style: Modern, professional photography
   - Shows diversity and engagement

2. **User Avatars:** Profile pictures throughout the platform
   - Size: w-10 h-10 for list views, w-24 h-24 for profile pages
   - Rounded-full
   - Fallback: Initials in placeholder

3. **Empty State Illustrations:** Simple icons or illustrations for empty dashboards

**No stock photos for decorative purposes** - only purposeful imagery that communicates the platform's community and learning focus.

---

## Accessibility

- All form inputs with associated labels
- Proper heading hierarchy (h1, h2, h3)
- Focus states visible on all interactive elements
- ARIA labels for icon-only buttons
- Sufficient contrast ratios throughout
- Keyboard navigation support

---

## Page-Specific Layouts

**Home:** Hero + Features (3-column grid) + How It Works (alternating content) + CTA section + Footer

**Dashboard:** Header + Stats row + Filters + Post grid + Pagination

**Profile:** Header + Two-column (sidebar + main content) + Footer

**Login/Signup:** Centered card with minimal header/footer

This design creates a professional, trustworthy learning community platform that prioritizes usability and clear communication over visual flourish, while still maintaining a modern, polished appearance.