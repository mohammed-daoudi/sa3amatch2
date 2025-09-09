# SA3A Match - Sports Field Booking Platform

![SA3A Match](./public/logo.svg)

**SA3A Match** is a comprehensive sports field booking platform that connects sports enthusiasts with available playing fields. Users can browse, book, and manage sports field reservations with real-time availability, interactive maps, and weather information.

## 🏆 Features

### 🔐 User Management
- **User Registration & Authentication** - Secure signup and login system
- **Role-based Access Control** - Different permissions for users and administrators
- **Profile Management** - Users can manage their personal information and preferences

### ⚽ Field Management
- **Field Discovery** - Browse available sports fields with detailed information
- **Interactive Maps** - View field locations using Leaflet maps integration
- **Field Details** - Comprehensive information including amenities, pricing, and photos
- **Favorites System** - Save preferred fields for quick access

### 📅 Booking System
- **Real-time Availability** - Check field availability in real-time
- **Date & Time Selection** - Interactive calendar and time slot picker
- **Booking Management** - View, modify, and cancel reservations
- **Payment Integration** - Secure payment processing for bookings

### 🌤️ Weather Integration
- **Weather Information** - Real-time weather data for better planning
- **Weather Cards** - Display current conditions for each field location

### 👨‍💼 Admin Dashboard
- **Admin Panel** - Comprehensive dashboard for administrators
- **Booking Management** - Oversee all bookings across the platform
- **Statistics & Analytics** - View platform usage statistics and reports
- **Field Management** - Add, edit, and manage sports fields

### 📱 User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI** - Clean and intuitive user interface
- **Real-time Notifications** - Toast notifications for user actions
- **Fast Performance** - Built with modern technologies for optimal speed

## 🛠️ Technologies Used

### Frontend
- **React 18.3.1** - Modern JavaScript library for building user interfaces
- **TypeScript 5.6.3** - Static type checking for enhanced development experience
- **Vite 5.4.8** - Next generation frontend tooling for fast development
- **Tailwind CSS 3.4.13** - Utility-first CSS framework for styling

### Backend & Database
- **Supabase** - Backend-as-a-Service providing database, authentication, and APIs
- **PostgreSQL** - Robust relational database (via Supabase)

### State Management & Data Fetching
- **Zustand 4.5.1** - Lightweight state management solution
- **TanStack React Query 5.74.9** - Powerful data synchronization for React
- **Axios 1.9.0** - Promise-based HTTP client for API requests

### UI Components & Styling
- **Lucide React 0.344.0** - Beautiful and customizable icons
- **Class Variance Authority 0.7.1** - Component variant management
- **Tailwind Merge 2.6.0** - Utility for merging Tailwind CSS classes
- **Tailwindcss Animate 1.0.7** - Animation utilities for Tailwind

### Maps & Location
- **Leaflet 1.9.4** - Leading open-source JavaScript library for mobile-friendly interactive maps
- **React Leaflet 4.2.1** - React components for Leaflet maps

### Forms & Validation
- **React Hook Form 7.56.1** - Performant, flexible forms with easy validation
- **Hookform Resolvers 3.10.0** - Validation resolvers for React Hook Form
- **Zod 3.24.3** - TypeScript-first schema validation

### Date & Time Management
- **Date-fns 3.6.0** - Modern JavaScript date utility library
- **React Day Picker 8.10.1** - Flexible date picker component

### UI Feedback & Charts
- **React Hot Toast 2.5.2** - Smoking hot React notifications
- **Recharts 2.15.3** - Composable charting library for React

### Development Tools
- **ESLint 9.12.0** - Linting utility for JavaScript and TypeScript
- **TypeScript ESLint 8.8.1** - TypeScript support for ESLint
- **PostCSS 8.4.47** - Tool for transforming CSS with JavaScript
- **Autoprefixer 10.4.20** - PostCSS plugin to parse CSS and add vendor prefixes

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **Bun** (recommended) or **npm/yarn**
- **Git** for version control
- **Supabase Account** for backend services

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sa3amatch
```

### 2. Install Dependencies
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory and add the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ckdlgwswjfasclyyahrx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGxnd3N3amZhc2NseXlhaHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjE3MzgsImV4cCI6MjA3MjkzNzczOH0.y6DJwxDGb70j09LTBvsq9j2Z4GiNLlyzW_o1pSERffA

# Weather API (Optional)
VITE_WEATHER_API_KEY=https://api.open-meteo.com/v1/forecast

# Example for your location in Morocco (Khouribga)
VITE_DEFAULT_LATITUDE=32.8811
VITE_DEFAULT_LONGITUDE=-6.9063
VITE_DEFAULT_TIMEZONE=Africa/Casablanca

```

**How to get Supabase credentials:**
1. Visit [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### 4. Database Setup
Run the Supabase migrations to set up your database schema:

```bash
# Initialize Supabase (if not already done)
npx supabase init

# Apply migrations
npx supabase db push
```

### 5. Start Development Server
```bash
# Using Bun
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
sa3amatch/
├── public/                 # Static assets
│   └── logo.svg           # Application logo
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── bookings/     # Booking-related components
│   │   ├── fields/       # Field-related components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── map/          # Map components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility libraries
│   │   ├── api.ts        # API functions
│   │   ├── auth.ts       # Authentication logic
│   │   ├── supabase.ts   # Supabase client configuration
│   │   └── utils.ts      # Utility functions
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin-specific pages
│   │   ├── BookingsPage.tsx
│   │   ├── FieldsPage.tsx
│   │   ├── HomePage.tsx
│   │   └── ...
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎯 Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Browse Fields** - Explore available sports fields
3. **View Details** - Check field information, amenities, and pricing
4. **Check Availability** - Select date and time slots
5. **Make Booking** - Reserve your preferred time slot
6. **Manage Bookings** - View and manage your reservations
7. **Add Favorites** - Save fields you frequently use

### For Administrators
1. **Access Admin Panel** - Navigate to `/admin` (admin role required)
2. **Manage Fields** - Add, edit, or remove sports fields
3. **Monitor Bookings** - Oversee all platform bookings
4. **View Statistics** - Access platform analytics and reports
5. **User Management** - Manage user accounts and permissions

## 🔧 Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run ESLint
bun run lint

# Generate TypeScript types from Supabase
bun run generate:types
```

## 🌐 Deployment

### Production Build
```bash
bun run build
```

### Deploy to Vercel/Netlify
1. Build the project using `bun run build`
2. Deploy the `dist` folder to your hosting provider
3. Set up environment variables in your hosting platform
4. Configure Supabase for production environment

### Environment Variables for Production
Make sure to set these environment variables in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WEATHER_API_KEY` (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Write clean, readable code with proper comments
- Ensure responsive design for all components
- Test your changes thoroughly before submitting

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section for existing problems
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Specify your environment (OS, Node.js version, etc.)

## 🔮 Future Enhancements

- **Mobile App** - React Native mobile application
- **Payment Integration** - Stripe/PayPal payment processing
- **Push Notifications** - Real-time booking notifications
- **Rating System** - Field and user rating features
- **Social Features** - User profiles and social interactions
- **Multi-language Support** - Internationalization (i18n)
- **Advanced Analytics** - Detailed reporting and insights

---

**Built with ❤️ for the sports community**
