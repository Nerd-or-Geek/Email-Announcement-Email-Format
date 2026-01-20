# Email Announcement Builder

A web-based tool for creating beautiful inline CSS email announcements, perfect for organizations like Civil Air Patrol squadrons, clubs, and teams.

![Email Builder Preview](https://via.placeholder.com/800x450?text=Email+Builder+Preview)

## Features

- 🎨 **Theme Customization**: Choose from preset color schemes or create your own
- 📰 **Header & Footer**: Customize title, subtitle, and footer content
- 📂 **Section Management**: Add, reorder, and customize content sections
- 📦 **Widget System**: Multiple widget types for flexible content creation
  - Meetings with details and buttons
  - Text and headings
  - Button groups
  - Bullet and numbered lists
  - Notices and alerts
  - Video embeds (YouTube)
  - Google Maps embeds
  - Images
- 📋 **Export Options**: Copy HTML to clipboard or download as file
- 💾 **Auto-Save**: Your work is automatically saved to browser storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Email-Announcement-Email-Format.git
cd Email-Announcement-Email-Format
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage

### Creating an Email

1. **Set Header**: Go to the "Header" tab to set your title and subtitle
2. **Choose Theme**: Use the "Theme" tab to select colors
3. **Add Sections**: Go to "Sections" and click "Add Section"
4. **Add Widgets**: Click on a section to expand it, then click "Add Widget"
5. **Configure Widgets**: Click "Edit" on any widget to customize it
6. **Export**: Click "View & Copy HTML" to get the final inline CSS HTML

### Widget Types

| Widget | Description |
|--------|-------------|
| Meeting | Event card with details (location, time, etc.) and buttons |
| Text | Simple paragraph text |
| Heading | H3 or H4 heading |
| Button | Single call-to-action button |
| Buttons | Group of multiple buttons |
| List | Bullet or numbered list |
| Notice | Highlighted alert box (info, warning, success, danger) |
| Divider | Horizontal separator line |
| Video | YouTube video embed |
| Map | Google Maps embed |
| Image | Image with optional sizing |

## Deployment to GitHub Pages

### Automatic Deployment

1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to the main branch - deployment happens automatically

### Manual Deployment

```bash
npm run deploy
```

This will:
1. Build the project
2. Push the `dist` folder to the `gh-pages` branch
3. Your site will be available at `https://YOUR_USERNAME.github.io/Email-Announcement-Email-Format/`

## Development

### Project Structure

```
src/
├── components/
│   ├── HeaderFooterEditor.tsx  # Header/footer configuration
│   ├── SectionEditor.tsx       # Section management
│   ├── ThemeEditor.tsx         # Theme/color picker
│   ├── WidgetEditor.tsx        # Widget configuration modals
│   └── WidgetTemplates.tsx     # Pre-configured widget templates
├── App.tsx                     # Main application component
├── htmlGenerator.ts            # Generates inline CSS HTML output
├── index.css                   # Global styles
├── main.tsx                    # React entry point
└── types.ts                    # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Technologies

- React 18
- TypeScript
- Vite
- CSS3 (no external UI framework)

## License

MIT License - feel free to use and modify for your own projects.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

Made with ❤️ for Civil Air Patrol and other organizations needing beautiful email announcements.
