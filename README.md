# Warung App

A modern, full-featured Point of Sale (POS) and store management app for small businesses and warungs, built with Expo (React Native) and Supabase.

## ✨ Features
- **User Authentication**: Secure signup, login, and email verification using Supabase Auth
- **Store Registration**: Users must register their store before accessing main features
- **Product & Inventory Management**: Manage products, categories, variants, and stock
- **Order Management**: Create, view, and manage orders with detailed order items
- **Sales Summary**: Daily summaries, revenue, and analytics
- **Role-based Access**: User roles and permissions
- **Responsive UI**: Built with NativeWind (Tailwind CSS for React Native)
- **Form Validation**: Robust forms with React Hook Form and Zod

## 🛠️ Tech Stack
- **Expo (React Native)**
- **Supabase** (Database, Auth, Realtime)
- **React Hook Form** & **Zod** (Validation)
- **NativeWind** (Tailwind CSS for React Native)
- **TypeScript**

## 📁 Folder Structure
```
app/                # All screens/pages (Expo Router)
  (tabs)/           # Main tabbed navigation
  login.tsx         # Login page
  signup.tsx        # Signup page
  register-store.tsx# Store registration page
components/ui/      # Reusable UI components (Button, Input, etc)
lib/                # Utilities, AuthContext, Supabase client, constants
```

## 🚀 Getting Started
1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/warung-app.git
   cd warung-app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase keys
4. **Run the app:**
   ```sh
   npx expo start
   ```

## 📝 Notes
- Deeplink/email verification works on standalone builds (not Expo Go)
- Make sure to configure your Supabase project (tables, auth, etc) as per the ERD

## 📄 License
MIT
