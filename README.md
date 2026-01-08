
This website is hosted on [Netlify](https://www.netlify.com/):

1. Push your code to GitHub.
2. Connect your repository to Netlify (via the Netlify dashboard).
3. Netlify will detect your `netlify.toml` and build the site automatically.
4. Your site will be live at your Netlify domain (or a custom domain you configure).

**Build command:** `npm run build`
**Publish directory:** `dist`

You can manage environment variables, deploy previews, and domain settings in the Netlify dashboard.
# Backend Integration

The Sick Day website integrates with a Python backend agent (deployed on Render) for booking automation and email replies. Inbound emails to the band are processed by the backend, which now automatically replies using AI.

**If you update the backend:**
- Make sure the Render deployment is up to date for new features (like automated email replies).
- The frontend can be updated and deployed independently, but some features (like booking automation) depend on the backend being live.

See the backend's README in `booking-agent/agent/README.md` for more details.
# Sick Day with Ferris - Official Website 🎸

A modern, fun, and energetic website for the band Sick Day with Ferris.

## Features

- 🎨 **Modern Design** - Built with React and Tailwind CSS
- ✨ **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Looks great on all devices
- 🎵 **Music Section** - Showcase your releases and videos
- 🎤 **Tour Dates** - Keep fans updated on upcoming shows
- 📸 **Photo Gallery** - Share your best moments
- 📧 **Contact Form** - Easy way for fans to reach out
- ⚡ **Fast Performance** - Optimized with Vite

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment on Render

This project is configured for easy deployment on Render:

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` configuration
4. Your site will be live at your custom domain!

## Customization

### Update Band Information

- Edit content in the component files in `src/components/`
- Update tour dates in `Tours.jsx`
- Replace placeholder images in `Music.jsx` and `Gallery.jsx`
- Update social media links in `Contact.jsx` and `Footer.jsx`

### Change Colors

Edit the color scheme in `tailwind.config.js`:
- `primary`: Main accent color (currently pink/red)
- `secondary`: Secondary accent color (currently teal)
- `dark`: Background color
- `light`: Text color

### Add Real Content

- Replace placeholder images with your actual band photos
- Add your Spotify/Apple Music links in the Music section
- Embed your YouTube videos in the Music section
- Update contact email addresses

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## License

This project is open source and available for personal and commercial use.

---

Made with ❤️ by Sick Day with Ferris

*Life moves pretty fast. If you don't stop and listen once in a while, you could miss it.* 🎸
