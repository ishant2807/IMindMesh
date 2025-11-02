# MindMesh - AI Study Assistant - AI-Powered Study Assistant

An intelligent, context-aware study companion that helps students organize, understand, and interconnect their learning materials through a dynamic **Knowledge Mesh** visualization.

## Features

- **Multi-Format Input**: Upload PDFs, paste text, or add YouTube transcripts
- **AI Processing**: Automatic summarization, topic detection, and concept extraction
- **Smart Flashcards**: AI-generated Q&A pairs for effective studying
- **Interactive Knowledge Mesh**: Visual graph linking related topics and concepts
- **Local Storage**: All data saved locally in your browser
- **Beautiful UI**: Scult.in-inspired modern design with smooth animations
- 🤖 **AI Processing**: Automatic summarization, topic detection, and concept extraction
- 🎯 **Smart Flashcards**: AI-generated Q&A pairs for effective studying
- 📊 **Interactive Knowledge Mesh**: Visual graph linking related topics and concepts
- 💾 **Local Storage**: All data saved locally in your browser
- 🎨 **Beautiful UI**: Scult.in-inspired modern design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## 🎨 Design Philosophy

MindMesh follows the Scult.in design aesthetic:
- **Deep navy blue** primary color (#0B132B)
- **Electric blue** secondary (#1C2541)
- **Aqua teal** accent (#5BC0BE)
- Rounded corners and soft shadows
- Minimalist, card-based UI
- Smooth transitions and animations

## 📚 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Visualization**: D3.js
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **PDF Processing**: PDF.js
- **Storage**: localStorage / IndexedDB

## 🧩 Core Functionalities

### 1. Content Input
- Type or paste text notes
- Upload PDF documents
- Add video transcripts

### 2. AI Processing
- Topic and subtopic detection
- Automatic summarization
- Flashcard generation
- Quiz creation
- Concept relationship mapping

### 3. Knowledge Mesh
- Interactive graph visualization
- Dynamic node connections
- Click to explore related content
- Auto-updates with new materials

### 4. Study Tools
- Flashcard review mode
- Auto-generated quizzes
- Summary cards
- Progress tracking

## 🔧 Configuration

### AI API Integration

The app supports multiple AI providers:

1. **HuggingFace Inference API** (Default)
   - Free tier available
   - Great for summarization and NLP tasks

2. **OpenAI API** (Optional)
   - Better quality results
   - Requires API key

3. **Mock Mode** (Fallback)
   - Works offline
   - Uses pre-generated sample data

Set your API key in the Settings panel or the app will use mock mode.

## 📖 Usage Guide

### Adding Study Material

1. Click **"Add Material"** button
2. Choose input method:
   - Upload PDF file
   - Paste text directly
   - Import transcript
3. Click **"Process"**
4. View generated summary, flashcards, and quiz

### Exploring Knowledge Mesh

1. Navigate to **"Graph"** tab
2. View interconnected topics
3. Click on any node to:
   - View topic summary
   - Access related flashcards
   - See connected concepts
4. Drag nodes to rearrange
5. Zoom and pan to explore

### Studying with Flashcards

1. Go to **"Flashcards"** section
2. Select a topic
3. Click card to flip and reveal answer
4. Mark as "Know" or "Review"
5. Track your progress

## 🎯 Roadmap

- [ ] Supabase integration for cloud sync
- [ ] Spaced repetition algorithm
- [ ] Voice-based flashcard reading
- [ ] Export/import data backup
- [ ] Mobile app version
- [ ] Collaborative study groups
- [ ] Advanced analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own learning!

## 🙏 Acknowledgments

- Design inspired by [Scult.in](https://scult.in)
- Icons by [Lucide](https://lucide.dev)
- Built with [React](https://react.dev) and [TailwindCSS](https://tailwindcss.com)

---

**Made with 💙 for students everywhere**
