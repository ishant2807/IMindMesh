import { useState } from 'react'
import { Upload, FileText, Type, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { aiService } from '../services/aiService'

const UploadSection = ({ onMaterialAdded }) => {
  const [activeTab, setActiveTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload a PDF file')
        setFile(null)
      }
    }
  }

  const handleProcess = async () => {
    setError(null)
    setResult(null)

    let textToProcess = ''
    let materialTitle = title || 'Untitled Material'

    // Validate input
    if (activeTab === 'text') {
      if (!textInput.trim()) {
        setError('Please enter some text to process')
        return
      }
      textToProcess = textInput
    } else if (activeTab === 'file') {
      if (!file) {
        setError('Please select a PDF file')
        return
      }
      materialTitle = title || file.name.replace('.pdf', '')
    }

    setProcessing(true)

    try {
      // Extract text from PDF if file upload
      if (activeTab === 'file' && file) {
        textToProcess = await aiService.extractPDFText(file)
      }

      // Process the text with AI
      const processedMaterial = await aiService.processText(textToProcess, materialTitle)
      
      setResult(processedMaterial)
      
      // Add material to parent component
      onMaterialAdded(processedMaterial)

      // Reset form
      setTimeout(() => {
        setTextInput('')
        setTitle('')
        setFile(null)
        setResult(null)
      }, 3000)
    } catch (err) {
      setError('Failed to process material. Please try again.')
      console.error('Processing error:', err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <h2 className="text-2xl font-bold text-primary mb-2">Add Study Material</h2>
        <p className="text-text-muted">
          Upload PDFs, paste text, or add transcripts. Our AI will analyze and create summaries, flashcards, and connect concepts.
        </p>
      </div>

      {/* Input Section */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            Material Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Quantum Mechanics Chapter 3"
            className="input-field"
          />
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-300 ${
              activeTab === 'text'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-accent'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-300 ${
              activeTab === 'file'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-accent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* Text Input Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your study notes, article text, or lecture transcript here..."
              className="textarea-field min-h-[300px]"
            />
            <p className="text-xs text-text-muted">
              {textInput.length} characters • Minimum 50 characters recommended
            </p>
          </div>
        )}

        {/* File Upload Tab */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-accent transition-all duration-300">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="bg-accent/10 rounded-full p-4 mb-4">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                {file ? (
                  <div className="space-y-2">
                    <p className="font-medium text-primary">{file.name}</p>
                    <p className="text-sm text-text-muted">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                      }}
                      className="text-sm text-accent hover:text-accent-dark"
                    >
                      Change file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-primary font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-text-muted">PDF files only (max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Process Button */}
        <div className="mt-6">
          <button
            onClick={handleProcess}
            disabled={processing}
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Generate Summary & Flashcards</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Success Message */}
          <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Material processed successfully! Added to your knowledge mesh.
            </p>
          </div>

          {/* Summary Card */}
          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">Summary</h3>
            <p className="text-text-muted mb-4">{result.summary.brief}</p>
            <div>
              <p className="font-medium text-primary mb-2">Key Points:</p>
              <ul className="space-y-2">
                {result.summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2 text-text-muted">
                    <span className="text-accent font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Topics Card */}
          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">Detected Topics</h3>
            <div className="flex flex-wrap gap-2">
              {result.topics.map((topic, index) => (
                <span
                  key={index}
                  className="badge badge-primary px-4 py-2"
                  style={{ opacity: topic.importance }}
                >
                  {topic.name}
                </span>
              ))}
            </div>
          </div>

          {/* Flashcards Preview */}
          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">
              Generated Flashcards ({result.flashcards.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.flashcards.slice(0, 4).map((flashcard, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:border-accent transition-all duration-300"
                >
                  <p className="text-sm font-medium text-primary mb-2">{flashcard.question}</p>
                  <p className="text-xs text-text-muted">{flashcard.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadSection
