# 🛒 ShopHub — React E-Commerce App

A modern, full-featured e-commerce web application built with **React** and **Supabase**. Browse products, manage your cart and favorites, upload avatars, and enjoy a smooth, responsive shopping experience — all with real-time authentication and cloud storage.

---

## ✨ Features

- 🔐 **Authentication** — Sign up, log in, forgot/reset password powered by Supabase Auth
- 👤 **User Profile** — View and edit profile info with avatar upload (Supabase Storage)
- 🛒 **Shopping Cart** — Add, remove, and manage items with persistent state via Context API
- ❤️ **Favorites / Wishlist** — Save products you love for later
- 🔍 **Product Search** — Search products in real time
- 📂 **Category Browsing** — Filter products by category
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🎞️ **Smooth Animations** — Page transitions and UI motion with Framer Motion
- 🔔 **Toast Notifications** — Instant feedback via React Hot Toast
- 🛡️ **Protected Routes** — Cart, favorites, and profile require authentication

---

## 🛠️ Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| **Framework**  | React 19 (Vite)                                               |
| **Routing**    | React Router DOM v7                                           |
| **State**      | Context API (`AuthContext`, `CartContext`)                     |
| **Backend**    | Supabase (Auth, Database, Storage)                            |
| **HTTP**       | Axios                                                         |
| **Styling**    | CSS + Tailwind CSS                                            |
| **Animations** | Framer Motion                                                 |
| **Sliders**    | React Slick, Swiper                                           |
| **Icons**      | React Icons, Lucide React                                     |
| **Toasts**     | React Hot Toast                                               |
| **Deploy**     | GitHub Pages (`gh-pages`)                                     |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Context/
│   │   ├── AuthContext.jsx        # Authentication state & logic
│   │   └── CartContext.jsx        # Cart state management
│   ├── Navbar/                    # Navigation bar
│   ├── Footer/                    # Footer component
│   ├── slideproducts/             # Product slider/carousel
│   ├── HeroSlider.jsx             # Hero banner slider
│   ├── LogoutButton.jsx           # Logout functionality
│   ├── PrivateRoute.jsx           # Route guard for auth
│   ├── ScrollToTop.jsx            # Scroll restoration
│   └── PageTransition.jsx         # Animated page transitions
├── hooks/
│   ├── useAuth.js                 # Authentication hook
│   └── useUserData.js             # User data fetching hook
├── page/
│   ├── home/                      # Home page
│   ├── Shop/                      # Shop / all products
│   ├── productDetails/            # Single product view
│   ├── CategoryPage/              # Products by category
│   ├── cart/                       # Shopping cart
│   ├── favorites/                  # Wishlist page
│   ├── UserProfile/               # User profile & settings
│   ├── Login/                     # Login, Forgot & Reset Password
│   ├── Register/                  # Registration
│   ├── About/                     # About Us
│   ├── Contact Us/                # Contact page
│   ├── FAQ/                       # FAQ page
│   └── SearchResults.jsx          # Search results
├── image/                         # Static image assets
├── supabaseClient.js              # Supabase client init
├── App.jsx                        # Root component & routes
├── main.jsx                       # Entry point
└── index.css                      # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://mhmd-elawady.github.io/Ecommerce
cd Ecommerce

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **https://mhmd-elawady.github.io/Ecommerce**.

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🌐 Deployment

This project is configured for **GitHub Pages** deployment:

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

This runs `vite build` then publishes the `dist/` folder via `gh-pages`.

---

## 💡 Challenges & Highlights

### Supabase Schema & RLS Policies
Setting up Row-Level Security (RLS) policies in Supabase required careful design to ensure users can only read and modify their own data (profile info, avatar, cart, etc.) while keeping the products table publicly readable.

### Avatar Upload Flow
Implemented a complete avatar upload pipeline — from file selection to Supabase Storage upload to displaying the updated avatar — handling edge cases like file size limits and format validation.

### Authentication Flow
Built a robust auth system with email/password login, registration, forgot-password emails, and secure password reset — all via Supabase Auth, with session management through a custom `AuthContext`.

### Responsive Slider Fixes
Resolved CSS conflicts with React Slick to correctly display a single card per slide on mobile widths, ensuring a consistent carousel experience across all breakpoints.

---

## 📸 Screenshots

> _Add screenshots here to showcase your app's UI._
>
> | Home Page | Product Details | User Profile |
> | --------- | --------------- | ------------ |
> | ![Home](src/image/Screenshot%202026-03-24%20180828.png) | ![Product](src/image/Screenshot%202026-03-24%20181006.png) | ![Profile](src/image/Screenshot%202026-03-24%20181025.png) |

---

## 🔮 Future Improvements
- [ ] Order history and tracking
- [ ] Admin dashboard for product management
- [ ] Product reviews and ratings
- [ ] Email notifications for orders
- [ ] Dark mode toggle

---

## 👤 Author

**Mohamed Elawady**

- GitHub: [@Mhmd-Elawady](https://github.com/Mhmd-Elawady)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
