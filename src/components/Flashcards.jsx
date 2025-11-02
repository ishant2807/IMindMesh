import { useState } from 'react'
import { CreditCard, RotateCw, ChevronLeft, ChevronRight, CheckCircle, XCircle, Filter } from 'lucide-react'

const Flashcards = ({ flashcards, materials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filterTopic, setFilterTopic] = useState('all')
  const [studyMode, setStudyMode] = useState(false)
  const [knownCards, setKnownCards] = useState(new Set())

  // Get unique topics
  const topics = ['all', ...new Set(materials.flatMap(m => m.topics?.map(t => t.name) || []))]

  // Filter flashcards
  const filteredCards = filterTopic === 'all' 
    ? flashcards 
    : flashcards.filter(card => card.topic === filterTopic)

  const currentCard = filteredCards[currentIndex]

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
  }

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const handleMarkKnown = () => {
    setKnownCards(new Set([...knownCards, currentCard.id]))
    handleNext()
  }

  const handleMarkReview = () => {
    const updated = new Set(knownCards)
    updated.delete(currentCard.id)
    setKnownCards(updated)
    handleNext()
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (flashcards.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card bg-white/10 backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-bold text-primary mb-2">Flashcards</h2>
          <p className="text-text-muted">Review AI-generated flashcards for your study materials</p>
        </div>
        
        <div className="card bg-white/10 backdrop-blur-sm border border-white/20 text-center py-12">
          <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">No flashcards yet</h3>
          <p className="text-text-muted">
            Add study materials to automatically generate flashcards
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Flashcards</h2>
            <p className="text-text-muted">
              Review mode • {filteredCards.length} cards • {knownCards.size} mastered
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
            className="px-4 py-2 rounded-xl border-2 border-gray-200  focus:outline-none text-sm text-white bg-[#0B132B]"
              value={filterTopic}
              onChange={(e) => {
                setFilterTopic(e.target.value)
                setCurrentIndex(0)
                setFlipped(false)
              }}
              
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <div className="flex items-center justify-between text-sm text-text-muted mb-2">
          <span>Progress</span>
          <span>{currentIndex + 1} / {filteredCards.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard Display */}
      {currentCard && (
        <div className="relative">
          <div
            onClick={handleFlip}
            className={`card glow-accent cursor-pointer transition-all duration-500 transform preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
            style={{
              minHeight: '400px',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Front of card */}
            <div
              className={`absolute inset-0 backface-hidden ${flipped ? 'invisible' : 'visible'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex flex-col justify-between h-full min-h-[400px] p-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`badge ${getDifficultyColor(currentCard.difficulty)}`}>
                      {currentCard.difficulty || 'medium'}
                    </span>
                    <span className="badge badge-primary">{currentCard.topic}</span>
                  </div>
                  
                  <div className="flex items-center justify-center flex-1 py-12">
                    <div className="text-center">
                      <CreditCard className="w-12 h-12 text-accent mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-primary mb-4">
                        {currentCard.question}
                      </h3>
                      <p className="text-text-muted text-sm">Click to reveal answer</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <RotateCw className="w-5 h-5 text-accent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 ${flipped ? 'visible' : 'invisible'}`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex flex-col justify-between h-full min-h-[400px] p-8 bg-accent/5">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="badge badge-secondary">Answer</span>
                    <span className="badge badge-primary">{currentCard.topic}</span>
                  </div>
                  
                  <div className="flex items-center justify-center flex-1 py-12">
                    <div className="text-center max-w-2xl">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
                      <p className="text-lg text-text-dark leading-relaxed">
                        {currentCard.answer}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <RotateCw className="w-5 h-5 text-accent animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={filteredCards.length <= 1}
              className="p-3 rounded-xl bg-secondary text-white hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleFlip}
              className="px-6 py-3 rounded-xl bg-accent text-white hover:bg-accent-dark transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCw className="w-5 h-5" />
              <span>Flip Card</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={filteredCards.length <= 1}
              className="p-3 rounded-xl bg-secondary text-white hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Study Actions */}
          {flipped && (
            <div className="flex items-center space-x-2 animate-slide-up">
              <button
                onClick={handleMarkReview}
                className="px-4 py-2 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Review Again</span>
              </button>
              
              <button
                onClick={handleMarkKnown}
                className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all duration-300 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I Know This</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-text-muted text-sm mb-1">Total Cards</p>
          <p className="text-2xl font-bold text-primary">{filteredCards.length}</p>
        </div>
        <div className="card">
          <p className="text-text-muted text-sm mb-1">Mastered</p>
          <p className="text-2xl font-bold text-green-500">{knownCards.size}</p>
        </div>
        <div className="card">
          <p className="text-text-muted text-sm mb-1">To Review</p>
          <p className="text-2xl font-bold text-red-500">
            {filteredCards.length - knownCards.size}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
