# 🚀 MindMesh Installation Guide

## Prerequisites

Before running MindMesh, you need to install Node.js and npm:

### Step 1: Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard (accept defaults)
5. Restart your computer if prompted

### Step 2: Verify Installation

Open a new PowerShell or Command Prompt and run:

```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Quick Start

Once Node.js is installed:

### 1. Install Dependencies

```bash
cd C:\Users\hp\OneDrive\Desktop\PROJECT
npm install
```

This will install all required packages (React, TailwindCSS, D3.js, etc.)

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Troubleshooting

### "npm is not recognized"

- Make sure Node.js is installed
- Restart your terminal/IDE after installation
- Check if `C:\Program Files\nodejs` is in your PATH environment variable

### Port 3000 already in use

Edit `vite.config.js` and change the port:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001  // Change to any available port
  }
})
```

### Installation fails

Try clearing npm cache:

```bash
npm cache clean --force
npm install
```

## Using MindMesh

### 1. Add Study Material

- Click "Add Material" in the navigation
- Choose to paste text or upload a PDF
- Click "Generate Summary & Flashcards"
- Wait for AI processing (uses mock data by default)

### 2. View Knowledge Mesh

- Navigate to "Knowledge Mesh"
- See your topics visualized as an interactive graph
- Click nodes to view details
- Drag to rearrange, zoom in/out

### 3. Study with Flashcards

- Go to "Flashcards" section
- Click cards to flip
- Mark as "I Know This" or "Review Again"
- Filter by topic

### 4. Settings

- Configure AI provider (Mock/HuggingFace/OpenAI)
- Export/Import your data
- Clear all data

## Features

✅ **Text Processing**: Paste notes or upload PDFs
✅ **AI Summarization**: Automatic key points extraction
✅ **Flashcard Generation**: Q&A pairs for studying
✅ **Knowledge Mesh**: Visual graph of topic connections
✅ **Local Storage**: All data saved in browser
✅ **Export/Import**: Backup your study materials
✅ **Beautiful UI**: Modern, responsive design

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **Visualization**: D3.js
- **Icons**: Lucide React
- **Storage**: localStorage
- **AI**: Mock service (configurable for real APIs)

## Need Help?

Check the README.md for more details or create an issue if you encounter problems.

---

**Happy studying! 🧠✨**
