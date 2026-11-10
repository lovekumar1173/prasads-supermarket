# Prasad's Supermarket - Royal Quality & Quick Grocery Web Application

A high-performance, professional grocery shopping web application built with **React**, **Vite**, **JavaScript (ES6+)**, and **Redux Toolkit**. Designed with a luxurious, trustworthy Royal Emerald & Warm Gold aesthetic with prestigious typography (**Outfit** & **Plus Jakarta Sans**).

---

## 🌟 Key Features

1. **Modern Light-Themed Grocery Interface**
   - Clean white background, subtle slate surfaces, crisp typography, and fresh emerald green accents (`#059669`).
   - High-contrast badges (discounts, units, star ratings), rounded corners, and elevation shadows.
   - 48 realistic grocery products across 8 categories with high-definition imagery and automatic image fallback handling.

2. **Add / Remove (+) and (-) Toggle Functionality**
   - State-synchronized cart toggle powered by **Redux Toolkit**.
   - Products initially show a **PLUS (+)** `Add` button.
   - When added, the button instantly updates to a **MINUS (-)** `Remove` button.
   - No duplicate entries; cart badge and totals update in real-time.
   - Removing an item from either the product card or cart drawer immediately synchronizes all related UI components.

3. **Bidirectional Category & Product List Scrolling Synchronization**
   - **Scenario 1 (Manual Scrolling):** Detects which category section is currently visible at the top and automatically highlights it in the category navigation panel. Handles rapid scrolling and bottom-of-page boundaries.
   - **Scenario 2 (Category Click):** Programmatically scrolls the product list smoothly to the targeted category section with proper navbar offset compensation. Prevents flickering or race conditions between programmatic and manual scroll listeners using an animation lock.

4. **Responsive Category Panel**
   - **Desktop View (`> 900px`):** Sticky category sidebar on the **LEFT** side, with product grid on the **RIGHT**.
   - **Mobile View (`≤ 900px`):** Sticky category chips bar at the **TOP**, horizontally scrollable with auto-centering on the active category.

5. **Instant Case-Insensitive Product Search**
   - Real-time product search across all categories.
   - Displays result counts, search keyword highlights, and an attractive empty search state with quick reset action.

6. **Interactive Cart Drawer & Bill Summary**
   - Sliding right-side drawer with backdrop overlay and `Escape` key listener.
   - Lists selected items with thumbnail, title, unit, price, and individual remove actions.
   - Dynamic bill breakdown: items subtotal, free delivery tiers, and grand total.
   - Friendly empty cart illustration and "Start Shopping" call to action.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Language:** JavaScript (ES6+ Modules)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Modular CSS3 (CSS Variables, Flexbox, CSS Grid, Responsive Breakpoints)
- **Code Quality:** ESLint

---

## 📁 Project Architecture

```
ShoppingCart-Vite/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar, search input, and cart button badge
│   │   ├── CategoryPanel.jsx   # Desktop left sticky sidebar & mobile top horizontal scroll
│   │   ├── ProductCard.jsx     # Product presentation & PLUS/MINUS cart toggle action
│   │   ├── ProductList.jsx     # Categorized product sections & search results grid
│   │   ├── CartDrawer.jsx      # Sliding drawer with backdrop, empty state, and item list
│   │   └── CartSummary.jsx     # Subtotal, delivery tiers, grand total, and checkout flow
│   ├── data/
│   │   ├── categories.js       # 8 grocery categories with icon metadata
│   │   └── products.js         # 48 grocery items with images, prices, units, and discounts
│   ├── hooks/
│   │   └── useCategoryScroll.js # Custom hook for bidirectional scrolling synchronization
│   ├── redux/
│   │   ├── store.js            # Central Redux store configuration
│   │   └── cartSlice.js        # Cart slice, reducers (addToCart, removeFromCart), selectors
│   ├── styles/
│   │   ├── global.css          # Design system tokens, typography, shadows, base layout
│   │   └── responsive.css      # Desktop vs Mobile media queries and layout transitions
│   ├── App.jsx                 # Application layout shell and state orchestration
│   ├── App.css                 # Application-level styles and announcement banner
│   ├── index.css               # CSS reset and base typography
│   └── main.jsx                # React root mount with Redux Provider
├── index.html                  # HTML5 entry with metadata
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Comprehensive technical documentation
```

---

## 🚀 Commands to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Run Lint Check
```bash
npm run lint
```

---

## 🎓 Technical Interview Guide: Important Files & Functions

When discussing this application in a technical interview, highlight the following architectural decisions:

### 1. Global State Management (`src/redux/cartSlice.js`)
- **`addToCart(state, action)`**: Ensures uniqueness by checking `state.items.some(item => item.id === product.id)`. Prevents accidental item duplication.
- **`removeFromCart(state, action)`**: Accommodates both direct string IDs and object payloads (`{ id }`), filtering out the targeted item cleanly.
- **Memoized Selectors**:
  - `selectCartItems`: Selects the array of active cart items.
  - `selectCartCount`: Derives `state.cart.items.length`.
  - `selectCartTotal`: Computes subtotal dynamically with `reduce((sum, item) => sum + item.price, 0)`.
  - `selectIsInCart(productId)`: Curried selector returning a boolean for high-efficiency component rendering.

### 2. Bidirectional Scrolling Synchronization (`src/hooks/useCategoryScroll.js`)
- **`isProgrammaticScrollRef`**: A mutable ref flag that locks scroll listener updates during programmatic smooth scrolling. This eliminates "scroll jitter" where the manual scroll listener fights against a category button click.
- **`window.requestAnimationFrame`**: Throttles the manual scroll listener so calculations only execute before repaints, guaranteeing 60fps scrolling performance.
- **Dynamic Header Offset**: Computes header height on the fly (`navbar.offsetHeight + mobilePanel.offsetHeight`) so category scroll offsets are pixel-perfect on both mobile and desktop.
- **Bottom-of-Page Detection**:
  ```javascript
  if (scrollY + windowHeight >= documentHeight - 60) {
    setActiveCategory(lastCategory.id);
  }
  ```
  Addresses the classic frontend challenge where the last section cannot reach the top trigger line because the page has ended.

### 3. Responsive Category Switching (`src/components/CategoryPanel.jsx` & `responsive.css`)
- **Desktop Layout:** Rendered as an `<aside>` sticky sidebar (`width: 260px`, `position: sticky; top: calc(var(--nav-height) + 24px)`).
- **Mobile Layout:** Rendered as a sticky top horizontal bar (`overflow-x: auto; scrollbar-width: none`).
- **Auto-Centering Pills:** Uses `useEffect` with `element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })` so that whichever category is active smoothly centers itself on mobile screens.

### 4. Synchronized PLUS / MINUS Toggle (`src/components/ProductCard.jsx`)
- Strictly adheres to the requirement: initially displays a **PLUS (+)** button; clicking it transitions to a **MINUS (-)** button.
- Avoids conflicting quantity inputs, maintaining clean parity with quick-basket operations.
- State is driven entirely by Redux, ensuring immediate two-way synchronization between product listings and the slide-over cart drawer.

---

## 📱 Platform & Mobile Notice

- This is a responsive React web application optimized for desktop, tablet, and mobile browsers.
- Native mobile builds (iOS/Android) require a separate framework wrapper such as Capacitor or React Native.
- It is not designed as an Expo Snack project due to native browser DOM and Vite dependency configurations.
