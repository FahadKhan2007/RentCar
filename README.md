# 🚗 CARRENT - Premium Car Rental Platform

A modern, high-performance, and fully responsive Car Rental web application built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router v7**. 

Featuring a sleek dark and crimson red automotive theme, real-time rental price calculations, an automated 10% promotional discount system with `localStorage` persistence, interactive date and time validation, and full mobile responsiveness.

---

## 🌟 Key Features

- **⚡ Fast & Modern Architecture:** Built on Vite 8 and React 19 for instantaneous hot-module replacement and ultra-fast production builds.
- **📱 Fully Responsive Design:** Handcrafted for desktop, tablet, and mobile with a responsive navigation drawer, flexible grid layouts, and touch-friendly tap targets.
- **🏷️ Shared 10% Discount System:** 
  - Integrated via React Context and synchronized with browser `localStorage`.
  - Welcome coupon modal for first-time visitors with promo code (`Niazi804`).
  - Automatically updates vehicle pricing across the fleet, cards, and live booking summary.
  - Promo code input with instant validation and discount deduction.
- **🚘 "Rent Now" Smart Car Pre-Selection:**
  - Clicking "Rent Now" on any vehicle card automatically navigates to the booking portal with that exact car pre-selected.
- **📅 Dynamic Date Validation & Price Calculator:**
  - Date validation prevents past pickup dates and ensures return date/time is after pickup.
  - Automatically calculates total rental days, subtotal, 10% promo savings, and final estimated total in real time.
- **💾 Persistent Bookings & Contact System:**
  - Saves all booking submissions with unique reference IDs (`CR-XXXX-XXXX`) to `localStorage`.
  - Built-in "My Saved Bookings" manager allowing users to review and cancel their bookings.
  - Instant confirmation modal with full receipt breakdown.
  - Fully functional contact form with input validation, submission status, and storage.
- **🚀 Production-Ready & Vercel Optimized:**
  - Custom `vercel.json` rewrite configuration preventing 404 errors on direct React Router page visits and reloads.
  - Cleaned and audited codebase with **0 ESLint errors**.
  - Optimized image assets (over 80% file size reduction) for top Lighthouse and Core Web Vitals performance.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 (`react`, `react-dom`)
- **Routing:** React Router DOM v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** React Icons (`react-icons/fa`)
- **Build Tool:** Vite 8
- **Code Quality:** ESLint with React Hooks and React Refresh rules

---

## 📁 Project Structure

```
RentCar/
├── public/                 # Static assets (favicons, car photos)
│   ├── Audi.png
│   ├── BMW_5_series.png
│   ├── corolla.png
│   ├── Crown.png
│   ├── Fortuner.png
│   ├── honda.png
│   ├── land.png
│   └── mercedes.png
├── src/
│   ├── assets/             # Optimized brand imagery
│   │   ├── About.png
│   │   └── cars.png
│   ├── component/          # UI Components
│   │   ├── Cars.jsx        # Car cards with dynamic discount pricing
│   │   ├── DiscountPopUp.jsx # Interactive 10% discount modal
│   │   ├── Footer.jsx      # Social links and footer navigation
│   │   ├── Hero.jsx        # Hero banner with call-to-action
│   │   └── Navbar.jsx      # Responsive header with mobile drawer
│   ├── context/            # Shared State Management
│   │   ├── RentalContext.jsx
│   │   ├── RentalContextInstance.js
│   │   └── useRental.js    # Custom hook for shared state
│   ├── data/               # Centralized data sources
│   │   ├── carsData.js     # Single source of truth for fleet & rates
│   │   └── constants.js    # Global promo codes and constants
│   ├── pages/              # Routed pages
│   │   ├── About.jsx       # About company, stats, & fleet info
│   │   ├── Booking.jsx     # Booking form, date validator, & price calculator
│   │   ├── Contact.jsx     # Contact form & location info
│   │   ├── Home.jsx        # Landing page
│   │   └── Services.jsx    # Fleet offerings & perks
│   ├── App.jsx             # App layout, router & scroll restoration
│   ├── index.css           # Global stylesheet & Tailwind imports
│   └── main.jsx            # Application entry point
├── vercel.json             # Vercel SPA routing rewrite rules
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/FahadKhan2007/RentCar.git

# Navigate to the project folder
cd RentCar/RentCar

# Install project dependencies
npm install
```

### 3. Development Server
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Production Build
Build the optimized production bundles:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### 5. Linting
Verify code quality and check for ESLint issues:
```bash
npm run lint
```

---

## 🏷️ Discount & Promo System

- New visitors are presented with a **10% OFF** popup.
- Submitting an email or entering promo code **`Niazi804`** activates the 10% discount.
- Active discount is stored in `localStorage` under `discount` and automatically reflected on all car rental cards and checkout calculations.

---

## 🌐 Deployment to Vercel

This repository includes a pre-configured `vercel.json` file to ensure client-side routing works properly without 404 errors on deep routes:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Simply import your repository into [Vercel](https://vercel.com/) and click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
