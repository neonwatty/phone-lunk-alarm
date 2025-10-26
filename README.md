# Next.js Landing Page Template

A modern, performant, and highly customizable static landing page template built with Next.js 15, TypeScript, and Tailwind CSS. Perfect for quickly prototyping product landing pages and deploying to GitHub Pages.

## ✨ Features

- 🚀 **Next.js 15** with App Router and static export
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** with custom design system
- 🌓 **Dark/Light Mode** with smooth transitions
- 📱 **Fully Responsive** mobile-first design
- ⚡ **Optimized Performance** static site generation
- 🎯 **SEO Ready** with meta tags, Open Graph, and Twitter Cards
- 📊 **Analytics Support** (Google Analytics, Vercel Analytics)
- 🎭 **Professional UI** with glassmorphism and smooth animations
- ⚙️ **Single Config File** for easy customization
- 🚢 **GitHub Pages Deploy** automated with GitHub Actions

## 🚀 Quick Start

### 1. Use This Template

```bash
# Clone or download this template
git clone <your-repo-url>
cd nextjs-landing-template

# Install dependencies
npm install
```

### 2. Customize Your Site

Edit `site.config.mjs` to customize your landing page:

```javascript
const siteConfig = {
  site: {
    name: 'Your Product Name',
    url: 'https://yourusername.github.io/your-repo',
    // ... more settings
  },
  // ... configure hero, features, social links, etc.
}
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 4. Build for Production

```bash
npm run build
```

The static site will be generated in the `out/` directory.

## 📝 Customization Guide

### Site Configuration

All main customization happens in `site.config.mjs`:

- **Site Info**: Name, tagline, description, URL, keywords
- **Author**: Name, role, bio, email
- **Social Links**: GitHub, Twitter, LinkedIn, Email
- **Navigation**: Menu items
- **Hero Section**: Headline, subheadline, CTA buttons, optional image
- **Features**: Feature cards with icons and descriptions
- **CTA Section**: Call-to-action banner
- **SEO**: Meta tags, Open Graph, Twitter Cards
- **Analytics**: Google Analytics, Vercel Analytics

### Content Pages

- **Home**: `app/page.tsx` - Landing page with Hero, Features, and CTA
- **About**: `app/about/page.tsx` - About page (customize as needed)
- **404**: `app/not-found.tsx` - Custom 404 page

### Styling

- **Design System**: `app/globals.css` - CSS variables and utilities
- **Tailwind Config**: `tailwind.config.js` - Tailwind customization
- **Theme Colors**: Modify in `site.config.mjs` or `globals.css`

### Adding New Pages

1. Create a new directory in `app/` (e.g., `app/contact/`)
2. Add a `page.tsx` file
3. Update navigation in `site.config.mjs`

Example:
```typescript
// app/contact/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Your content */}
      </main>
      <Footer />
    </div>
  )
}
```

## 🚢 Deployment to GitHub Pages

### Setup

1. **Create a new GitHub repository** for your project

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: GitHub Actions

3. **Update configuration**:
   ```javascript
   // site.config.mjs
   site: {
     url: 'https://yourusername.github.io/your-repo'
   }
   ```

4. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

The GitHub Action will automatically build and deploy your site!

### Environment Variables

For production, you can set environment variables in GitHub:

- **Repository Variables** (Settings → Secrets and variables → Actions → Variables):
  - `NEXT_PUBLIC_SITE_URL`: Your site URL

- **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets):
  - `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

## 🎨 Components

### Pre-built Components

- `Header` - Sticky navigation with theme toggle
- `Footer` - Footer with social links
- `Hero` - Hero section with headline and CTAs
- `Features` - Feature grid with icons
- `CTA` - Call-to-action banner
- `ThemeToggle` - Dark/light mode switcher
- `ThemeProvider` - Theme context provider

### Custom Components

Create new components in the `components/` directory and import them in your pages.

## 📚 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run dev:clean` - Clean .next and start dev server

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Fonts**: Google Fonts (Inter, Poppins, JetBrains Mono)
- **Analytics**: Vercel Analytics, Google Analytics
- **Testing**: Jest, Playwright
- **Deployment**: GitHub Pages via GitHub Actions

## 📖 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 🤝 Contributing

This is a template repository. Feel free to:
- Fork it for your own projects
- Submit issues for bugs or feature requests
- Create pull requests for improvements

## 📄 License

MIT License - feel free to use this template for any project!

## 🙏 Acknowledgments

Built with modern web technologies and best practices for optimal performance and developer experience.

---

**Made with ❤️ using Next.js**
