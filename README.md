# WJ Cleaning Services - Professional Cleaning & Staffing Services

A modern, responsive website for WJ Cleaning Services, a professional cleaning and staffing services company. Built with Next.js 15, TypeScript, and Tailwind CSS.

![WJ Cleaning Services](./public/placeholder-logo.svg)

## ✨ Features

- **Modern Design**: Beautiful, responsive design with smooth animations and professional aesthetics
- **Multiple Services**: Residential cleaning, office cleaning, warehouse staffing, and event staffing
- **Mobile-First**: Fully responsive with mobile bottom navigation bar
- **Performance Optimized**: Built with Next.js 15 for optimal performance and SEO
- **Interactive UI**: Modern components with hover effects and animations
- **Contact Forms**: Functional contact forms with service selection
- **Professional Branding**: Consistent branding throughout the site

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: npm (with legacy peer deps for React 19 compatibility)

## 📦 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "wj cleaning service"
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: We use `--legacy-peer-deps` to resolve React 19 compatibility with some packages*

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
wj cleaning service/
├── app/                          # Next.js App Router
│   ├── about/                   # About page
│   ├── contact/                 # Contact page  
│   ├── services/                # Services page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── navigation.tsx           # Main navigation
│   ├── footer.tsx               # Site footer
│   └── mobile-bottom-bar.tsx    # Mobile navigation
├── lib/                         # Utility functions
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components including:

- **Layout**: Navigation, Footer, Cards
- **Forms**: Input, Textarea, Select, Button
- **Feedback**: Toast, Alert Dialog
- **Data Display**: Badge, Accordion, Tabs
- **And many more...**

## 📱 Pages Overview

### Home Page (`/`)
- Hero section with company introduction
- Services overview with modern cards
- About section highlighting founders
- How it works process
- Call-to-action sections

### About Page (`/about`)
- Company story and founders
- Core values and principles
- Team introduction
- Professional mission

### Services Page (`/services`)
- Detailed service descriptions
- Cleaning services (Residential & Office)
- Staffing services (Warehouse & Event)
- Service benefits and guarantees

### Contact Page (`/contact`)
- Contact form with service selection
- Multiple contact methods
- Business hours and service area
- FAQ section

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Mobile bottom navigation bar
- Adaptive layouts

### Modern Animations
- Smooth hover effects
- CSS animations and transitions
- Loading states
- Interactive elements

### Professional Branding
- Consistent color scheme (Blue & Purple)
- Modern typography
- Professional imagery placeholders
- Cohesive design language

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.ts` with:
- Extended color palette
- Custom animations
- Component utilities
- Responsive breakpoints

### Next.js
Configuration in `next.config.mjs`:
- Image optimization disabled for flexibility
- TypeScript and ESLint configured
- Build optimizations

## 🚀 Deployment

The project is ready for deployment on platforms like:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

### Build for Production
```bash
npm run build
npm run start
```

## 📞 Contact Information

**WJ Cleaning Services**
- Phone: (555) 123-4567
- Email: info@wjcleanforce.com
- Service Area: Greater Metro Area

## 👥 About WJ Cleaning Services

WJ Cleaning Services is built on the principles of trust, reliability, and excellence. The company provides both cleaning services and professional staffing solutions with a professional approach that sets us apart in the industry.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and belongs to WJ Cleaning Services.

---

**Built with ❤️ for WJ Cleaning Services**

*For technical support or questions about this website, please contact the development team.* 