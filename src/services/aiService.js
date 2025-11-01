// AI Service for processing text and generating content
// This includes both real API integration and mock fallback

class AIService {
  constructor() {
    this.apiProvider = 'mock' // 'mock', 'huggingface', 'openai'
    this.apiKey = null
  }

  setProvider(provider, apiKey = null) {
    this.apiProvider = provider
    this.apiKey = apiKey
  }

  // Main processing function
  async processText(text, title = 'Untitled') {
    try {
      // For now, use mock data. Real API integration can be added later
      const summary = await this.generateSummary(text)
      const topics = await this.extractTopics(text)
      const flashcards = await this.generateFlashcards(text, topics)
      const quiz = await this.generateQuiz(text, topics)

      return {
        id: this.generateId(),
        title,
        originalText: text,
        summary,
        topics,
        flashcards,
        quiz,
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error processing text:', error)
      throw error
    }
  }

  // Generate summary
  async generateSummary(text) {
    if (this.apiProvider === 'mock') {
      return this.mockSummary(text)
    }
    
    // TODO: Add real API integration
    // For HuggingFace:
    // const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
    //   body: JSON.stringify({ inputs: text })
    // })
    
    return this.mockSummary(text)
  }

  mockSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const keyPoints = sentences.slice(0, Math.min(3, sentences.length)).map(s => s.trim())
    
    return {
      brief: `This material covers key concepts about ${this.extractMainTopic(text)}.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        'Core concepts and fundamental principles',
        'Practical applications and examples',
        'Important relationships and connections'
      ]
    }
  }

  // Extract topics and subtopics
  async extractTopics(text) {
    if (this.apiProvider === 'mock') {
      return this.mockTopics(text)
    }
    
    return this.mockTopics(text)
  }

  mockTopics(text) {
    const words = text.toLowerCase().split(/\s+/)
    const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'])
    
    const wordFreq = {}
    words.forEach(word => {
      const cleaned = word.replace(/[^a-z]/g, '')
      if (cleaned.length > 4 && !commonWords.has(cleaned)) {
        wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1
      }
    })
    
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    
    return sortedWords.map((word, index) => ({
      name: word,
      importance: 1 - (index * 0.15),
      keywords: [word]
    }))
  }

  extractMainTopic(text) {
    const words = text.split(/\s+/)
    const meaningful = words.filter(w => w.length > 5)[0] || 'this topic'
    return meaningful.charAt(0).toUpperCase() + meaningful.slice(1)
  }

  // Generate flashcards
  async generateFlashcards(text, topics) {
    if (this.apiProvider === 'mock') {
      return this.mockFlashcards(text, topics)
    }
    
    return this.mockFlashcards(text, topics)
  }

  mockFlashcards(text, topics) {
    const flashcards = []
    
    topics.slice(0, 3).forEach((topic, index) => {
      flashcards.push({
        id: `flashcard-${this.generateId()}-${index}`,
        materialId: null, // Will be set later
        question: `What is ${topic.name}?`,
        answer: `${topic.name} is a key concept that relates to the core principles discussed in this material. It involves understanding the fundamental aspects and applications.`,
        difficulty: index === 0 ? 'easy' : index === 1 ? 'medium' : 'hard',
        topic: topic.name
      })
    })
    
    if (flashcards.length === 0) {
      flashcards.push({
        id: `flashcard-${this.generateId()}-0`,
        materialId: null,
        question: 'What are the main concepts covered?',
        answer: 'This material covers fundamental concepts and their practical applications.',
        difficulty: 'medium',
        topic: 'General'
      })
    }
    
    return flashcards
  }

  // Generate quiz questions
  async generateQuiz(text, topics) {
    if (this.apiProvider === 'mock') {
      return this.mockQuiz(text, topics)
    }
    
    return this.mockQuiz(text, topics)
  }

  mockQuiz(text, topics) {
    const quiz = {
      id: `quiz-${this.generateId()}`,
      questions: []
    }
    
    topics.slice(0, 3).forEach((topic, index) => {
      quiz.questions.push({
        id: `q-${index}`,
        question: `Which of the following best describes ${topic.name}?`,
        options: [
          `A fundamental concept related to ${topic.name}`,
          'An unrelated topic',
          'A different concept entirely',
          'None of the above'
        ],
        correctAnswer: 0,
        explanation: `${topic.name} is a key concept covered in this material.`
      })
    })
    
    if (quiz.questions.length === 0) {
      quiz.questions.push({
        id: 'q-0',
        question: 'What is the main focus of this material?',
        options: [
          'Core concepts and principles',
          'Unrelated information',
          'Random facts',
          'None of the above'
        ],
        correctAnswer: 0,
        explanation: 'This material focuses on core concepts and principles.'
      })
    }
    
    return quiz
  }

  // Extract text from PDF
  async extractPDFText(file) {
    // This is a placeholder. Real implementation would use pdf.js
    // For now, return a sample text
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Sample PDF content from ${file.name}.\n\nThis is extracted text that would normally come from the PDF file. It contains information about the subject matter, key concepts, and important details that students need to learn.`)
      }, 1000)
    })
  }

  // Utility function to generate unique IDs
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const aiService = new AIService()
