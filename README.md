# 🚗 CARRENT - Premium Car Rental Platform

A modern, high-performance, and fully responsive Car Rental web application built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router v7**.

Featuring a sleek dark and crimson red automotive theme, real-time rental price calculations, an automated 10% promotional discount system with `localStorage` persistence, interactive date and time validation, and full mobile responsiveness.

---

## 🌟 Key Features

- **⚡ Fast & Modern Architecture:** Built on Vite 8 and React 19 for instantaneous hot-module replacement and ultra-fast production builds.
- **📱 Fully Responsive Design:** Handcrafted for desktop, tablet, and mobile (tested down to 320px and 390px viewport widths) with a responsive navigation drawer, flexible grid layouts, and touch-friendly tap targets.
- **🏷️ Honest & Direct 10% Discount System:** 
  - Welcome coupon modal for visitors with promo code **`Niazi804`**.
  - One-click **Copy Code** button with immediate clipboard feedback and confirmation.
  - One-click **Apply Code & Start Booking** button that saves the discount to `localStorage` and takes the user directly to the booking portal.
  - Automatically recalculates vehicle pricing across fleet cards and live booking summary with single-discount enforcement.
- **🚘 "Rent Now" Smart Car Pre-Selection:**
  - Clicking "Rent Now" on any vehicle card automatically navigates to the booking portal with that exact car pre-selected.
- **📅 Dynamic Date Validation & Price Calculator:**
  - Robust local date and time validation preventing past bookings and requiring a minimum rental duration of 1 hour.
  - Partial rental days are charged as full days (e.g. 25 hours = 2 billable days).
  - Real-time calculation of billable rental days, subtotal, 10% promo savings, and final estimated total.
- **💾 Persistent Bookings & Contact System:**
  - Saves all booking submissions with unique reference IDs (`CR-XXXX-XXXX`) to `localStorage` using safe `Array.isArray()` parser guards.
  - Built-in "My Saved Bookings" modal allowing users to review and cancel active reservations.
  - Fully functional contact form with input validation and submission feedback.
- **🚀 Production-Ready & Vercel Optimized:**
  - Clean client-side Single Page Application (SPA) with custom `vercel.json` rewrite configuration preventing 404 errors on deep routes and direct page reloads.
  - Zero external backend dependencies or exposed endpoints.
  - Cleaned and audited codebase with **0 ESLint errors** and **61 automated tests passing**.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 (`react`, `react-dom`)
- **Routing:** React Router DOM v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Icons:** React Icons (`react-icons/fa`)
- **Build Tool:** Vite 8
- **Testing:** Vitest 5 (`vitest`)
- **Code Quality:** ESLint 10 with React Hooks and React Refresh rules

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
│   │   ├── DiscountPopUp.jsx # Honest 10% discount promo modal with Copy Code
│   │   ├── FloatingDiscountBtn.jsx # Floating quick-access coupon trigger
│   │   ├── Footer.jsx      # Social links and footer navigation
│   │   ├── Hero.jsx        # Hero banner with call-to-action
│   │   └── Navbar.jsx      # Responsive header with mobile drawer
│   ├── context/            # Shared State Management
│   │   ├── RentalContext.jsx # Provider with localStorage synchronization
│   │   ├── RentalContextInstance.js
│   │   └── useRental.js    # Custom hook for shared rental state
│   ├── data/               # Centralized data sources
│   │   ├── carsData.js     # Single source of truth for fleet & rates
│   │   └── constants.js    # Global promo code and app constants
│   ├── pages/              # Routed pages
│   │   ├── About.jsx       # About company, stats, & fleet info
│   │   ├── Booking.jsx     # Booking form, date validator, & price calculator
│   │   ├── Contact.jsx     # Contact form & location info
│   │   ├── Home.jsx        # Landing page
│   │   └── Services.jsx    # Fleet offerings & perks
│   ├── utils/              # Pure business logic & automated tests
│   │   ├── __tests__/      # Vitest test suite (61 unit tests)
│   │   │   ├── dateValidation.test.js
│   │   │   ├── discountCalculations.test.js
│   │   │   ├── discountPopupLogic.test.js
│   │   │   ├── promoCode.test.js
│   │   │   ├── rentalDays.test.js
│   │   │   ├── rentalPrice.test.js
│   │   │   └── storage.test.js
│   │   ├── bookingCalculations.js
│   │   ├── dateValidation.js
│   │   ├── promoCode.js
│   │   └── storage.js
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

# Navigate to the project directory
cd RentCar/RentCar

# Install project dependencies
npm install
```

### 3. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Production Build
Compile and bundle the application for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### 5. Automated Tests
Run the Vitest automated test suite (61 tests covering date validation, rental pricing, discount calculations, promo code logic, and safe storage):
```bash
npm test
```

### 6. Linting
Verify code quality and check for ESLint issues:
```bash
npm run lint
```

---

## 🏷️ Promo Code & Discount Functionality

- **Valid Code:** **`Niazi804`**
- **Discount:** **10% OFF** calculated on the rental subtotal.
- **Case-Insensitive:** Accepts `Niazi804`, `niazi804`, `NIAZI804`, and trims leading/trailing whitespace.
- **Single Discount Guarantee:** Prevents users from stacking multiple promotional discounts on a single booking.
- **Instant Persistence:** Applying the code automatically saves it to browser `localStorage` and keeps it in sync across all pages, vehicle cards, and the booking summary.
- **Honest User Experience:** The discount popup directly displays the promo code with a one-click copy button and an "Apply Code & Start Booking" shortcut. No emails or fake registration forms required.

---

## ⏱️ Rental Pricing Rules

- **Partial Days:** Partial rental days are charged as full days (e.g., 25 hours = 2 billable days). The booking summary clearly notes: *"Partial rental days are charged as full days."*
- **Minimum Rental Duration:** Minimum booking duration is at least 1 hour.
- **Local Date & Time Validation:** Uses the user's local device date and time (`getFullYear()`, `getMonth()`, `getDate()`) to prevent past bookings and ensure return times occur after pickup times.
- **Transparent Summary:** Displays daily rate, billable days, subtotal, 10% promo discount deduction, and final total separately.

---

## 🌐 Deployment to Vercel

The application is deployed on Vercel as a client-side Single Page Application (SPA).

A clean [`vercel.json`](vercel.json) rewrite rule handles all deep links and page reloads smoothly without 404 errors:

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

### Deployment Steps:
1. Push your changes to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import the repository.
3. Configure the Root Directory as `RentCar` (if inside a monorepo or subfolder).
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
