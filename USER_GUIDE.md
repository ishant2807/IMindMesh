# 📚 MindMesh User Guide

Welcome to MindMesh, your AI-powered study companion! This guide will help you get the most out of the application.

## 🚀 Getting Started

### First Time Setup

1. **Install Node.js** (if not already installed)
   - Visit https://nodejs.org/
   - Download and install the LTS version
   - Restart your computer

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the App**
   - Double-click `run.bat` (Windows)
   - OR run: `npm run dev`
   - Browser opens at http://localhost:3000

4. **Try Sample Data** (Optional)
   - Go to Settings
   - Click "Load Sample Data"
   - Refresh page to see demo materials

## 🎯 Core Features

### 1. Dashboard

Your home base showing:
- **Quick Stats**: Materials, flashcards, and topics count
- **Recent Materials**: Latest study content you've added
- **Quick Actions**: Jump to Knowledge Mesh or Flashcards

**Tips:**
- Click on stat cards to navigate to that section
- Delete materials directly from the dashboard
- View key points without opening full details

### 2. Add Material

Upload and process study content:

#### Text Input
1. Click "Add Material" in navigation
2. Select "Paste Text" tab
3. Paste your notes, articles, or transcripts
4. Add optional title
5. Click "Generate Summary & Flashcards"

#### PDF Upload
1. Select "Upload PDF" tab
2. Click to choose file or drag-and-drop
3. PDF text is extracted automatically
4. Processing generates summaries and flashcards

**What You Get:**
- ✅ **Summary**: Brief overview and key points
- ✅ **Topics**: Automatically detected concepts
- ✅ **Flashcards**: Q&A pairs for review
- ✅ **Quiz**: Multiple choice questions
- ✅ **Knowledge Mesh**: Topic added to graph

**Best Practices:**
- Use descriptive titles for easy organization
- Add at least 100 words for better AI analysis
- Include well-structured content (paragraphs, sections)
- Avoid highly technical symbols that might confuse parser

### 3. Knowledge Mesh

Interactive graph visualization of your learning:

**Features:**
- **Nodes**: Circles represent topics
  - Large aqua circles = Main topics
  - Smaller blue circles = Subtopics
- **Links**: Lines show relationships between concepts
- **Interactive**:
  - Click nodes to view details
  - Drag nodes to rearrange
  - Scroll to zoom in/out
  - Pan by clicking and dragging background

**Controls:**
- 🔍 **Zoom In/Out**: Use buttons or mouse wheel
- ↔️ **Reset View**: Center and reset zoom
- 🖱️ **Drag Nodes**: Click and drag to reposition
- 👆 **Click Node**: View summary and flashcards

**Understanding Connections:**
- Strong connections = Topics from same material
- Weak connections = Related concepts across materials
- Connection strength shown by line thickness

**Tips:**
- Start with a few materials to see clear patterns
- Related topics automatically connect
- Use graph to find knowledge gaps
- Great for visual learners!

### 4. Flashcards

Study mode with AI-generated Q&A cards:

**Using Flashcards:**
1. Navigate to Flashcards section
2. Click card to flip and reveal answer
3. Use navigation arrows for next/previous
4. Mark cards as "I Know This" or "Review Again"

**Features:**
- **Progress Bar**: Track your review progress
- **Topic Filter**: Focus on specific subjects
- **Difficulty Badges**: Easy, Medium, Hard
- **Statistics**: See mastered vs. to-review counts

**Study Tips:**
- Review regularly for better retention
- Focus on "hard" difficulty cards first
- Use topic filter for focused sessions
- Mark honestly - it helps track real progress

**Controls:**
- ⬅️ **Previous**: Go back one card
- 🔄 **Flip Card**: Reveal answer
- ➡️ **Next**: Move to next card
- ✅ **I Know This**: Mark as mastered
- ❌ **Review Again**: Keep in review pile

### 5. Settings

Configure and manage your app:

#### AI Provider
- **Mock Mode** (Default): Works offline, uses sample AI
- **HuggingFace**: Free API, good quality
- **OpenAI**: Premium quality, requires API key

**To Use Real AI:**
1. Select provider
2. Enter API key
3. Click "Save Settings"
4. Your key is stored locally (secure)

#### Data Management

**Load Sample Data**
- Try the app with demo materials
- Includes Quantum Mechanics and Photosynthesis
- Great for learning the interface

**Export Data**
- Downloads all your data as JSON
- Use for backup
- Can import on another device

**Import Data**
- Restore from previous export
- Merge with existing data
- Transfer between devices

**Clear All Data**
- Permanently delete everything
- Cannot be undone
- Export first as backup!

## 💡 Best Practices

### Study Workflow

1. **Upload Materials**
   - Add content as you learn
   - Use descriptive titles
   - Process one topic at a time

2. **Review Summaries**
   - Read AI-generated key points
   - Verify information accuracy
   - Add more context if needed

3. **Explore Knowledge Mesh**
   - See how topics connect
   - Identify related concepts
   - Find knowledge gaps

4. **Active Recall with Flashcards**
   - Regular review sessions
   - Focus on difficult cards
   - Track your progress

5. **Regular Maintenance**
   - Export data weekly
   - Remove outdated materials
   - Reorganize as needed

### Tips for Success

✅ **DO:**
- Add materials consistently
- Review flashcards daily
- Explore the knowledge mesh
- Export data regularly
- Use descriptive titles

❌ **DON'T:**
- Upload duplicate content
- Ignore weak connections
- Skip difficult flashcards
- Forget to backup data
- Process too much at once

## 🔧 Troubleshooting

### App Won't Start
- Check Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`
- Clear cache: `npm cache clean --force`
- Check port 3000 isn't in use

### Processing Fails
- Check content has enough text (100+ words)
- Verify PDF isn't encrypted
- Try switching AI provider in Settings
- Use mock mode as fallback

### Data Not Saving
- Check browser storage isn't full
- Allow localStorage for the site
- Export and reimport data
- Try different browser

### Graph Not Showing
- Add at least one material
- Refresh the page
- Check browser console for errors
- Clear and reload data

### Slow Performance
- Limit to 50-100 materials
- Export and clear old data
- Close other browser tabs
- Restart the app

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + K` | Quick search (future) |
| `Space` | Flip flashcard |
| `←` | Previous flashcard |
| `→` | Next flashcard |
| `Ctrl + E` | Export data |

## 🎨 UI Elements

### Color Coding
- **Deep Navy** (#0B132B): Primary elements
- **Electric Blue** (#1C2541): Secondary elements
- **Aqua Teal** (#5BC0BE): Accent/interactive
- **Green**: Success, mastered items
- **Yellow**: Warning, medium difficulty
- **Red**: Error, review needed

### Icons Meaning
- 🧠 Brain: Main app identity
- 📊 Dashboard: Home view
- ⬆️ Upload: Add new content
- 🕸️ Network: Knowledge mesh
- 🎴 Cards: Flashcards
- ⚙️ Gear: Settings

## 🆘 Getting Help

### Resources
- 📖 **README.md**: Project overview
- 🔧 **INSTALLATION.md**: Setup guide
- 📝 **USER_GUIDE.md**: This document
- 💬 **Issues**: GitHub issues page

### Common Questions

**Q: Is my data private?**  
A: Yes! All data is stored locally in your browser. Nothing is sent to external servers.

**Q: Can I use without internet?**  
A: Yes, in Mock mode. Real AI APIs require internet.

**Q: How many materials can I add?**  
A: Unlimited, but 50-100 recommended for performance.

**Q: Can I edit generated content?**  
A: Currently view-only. Feature planned for future.

**Q: Does it work on mobile?**  
A: Responsive design works, but desktop recommended.

## 🚀 Advanced Tips

### Power User Features

1. **Bulk Import**: Use import feature with custom JSON
2. **Cross-Device Sync**: Export from one device, import to another
3. **Custom Topics**: Materials with similar keywords auto-connect
4. **Study Sessions**: Filter flashcards by topic for focused review
5. **Data Analysis**: Export JSON to analyze with external tools

### Future Features (Roadmap)

- 🔄 Spaced repetition algorithm
- 🎤 Voice flashcard reading
- 📊 Advanced analytics
- 👥 Collaborative study groups
- ☁️ Cloud sync (Supabase)
- 🎯 Study goals and streaks
- 📱 Mobile app
- 🌐 Multi-language support

## 💬 Feedback

We'd love to hear from you!
- Found a bug? Report it
- Have a suggestion? Share it
- Built something cool? Show us!

---

**Happy studying! May your knowledge mesh grow strong! 🧠✨**

Version 1.0.0 | Made with 💙 for students everywhere
