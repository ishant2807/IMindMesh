import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Download, Upload, Trash2, Key, AlertCircle, CheckCircle, Database } from 'lucide-react'
import { storageService } from '../services/storage'
import { aiService } from '../services/aiService'
import { loadSampleData } from '../utils/sampleData'

const Settings = () => {
  const [settings, setSettings] = useState({
    apiProvider: 'mock',
    apiKey: '',
    theme: 'light'
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const savedSettings = await storageService.getSettings()
    setSettings(savedSettings)
  }

  const handleSave = async () => {
    try {
      await storageService.saveSettings(settings)
      aiService.setProvider(settings.apiProvider, settings.apiKey)
      setSaved(true)
      setError(null)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save settings')
    }
  }

  const handleExport = async () => {
    try {
      const data = await storageService.exportData()
      if (data) {
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mindmesh-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Failed to export data')
    }
  }

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0]
      if (file) {
        const text = await file.text()
        const success = await storageService.importData(text)
        if (success) {
          alert('Data imported successfully! Please refresh the page.')
        } else {
          setError('Failed to import data')
        }
      }
    } catch (err) {
      setError('Failed to import data')
    }
  }

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await storageService.clearAll()
        alert('All data cleared! Please refresh the page.')
      } catch (err) {
        setError('Failed to clear data')
      }
    }
  }

  const handleLoadSampleData = async () => {
    try {
      const sampleData = await loadSampleData()
      await storageService.saveMaterials(sampleData.materials)
      await storageService.saveFlashcards(sampleData.flashcards)
      await storageService.saveGraphData(sampleData.graphData)
      alert('Sample data loaded successfully! Please refresh the page to see the changes.')
    } catch (err) {
      setError('Failed to load sample data')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <div className="flex items-center space-x-3 mb-2">
          <SettingsIcon className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Settings</h2>
        </div>
        <p className="text-text-muted">
          Configure your MindMesh experience and manage your data
        </p>
      </div>

      {/* Success/Error Messages */}
      {saved && (
        <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-slide-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Settings saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* AI Provider Settings */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-accent" />
          <span>AI Provider</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Provider
            </label>
            <select
              value={settings.apiProvider}
              onChange={(e) => setSettings({ ...settings, apiProvider: e.target.value })}
              className="input-field"
            >
              <option value="mock">Mock (Demo Mode)</option>
              <option value="huggingface">HuggingFace</option>
              <option value="openai">OpenAI</option>
            </select>
            <p className="text-xs text-text-muted mt-1">
              Mock mode works offline with sample data. Use real APIs for better results.
            </p>
          </div>

          {settings.apiProvider !== 'mock' && (
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                API Key
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="input-field"
              />
              <p className="text-xs text-text-muted mt-1">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          )}

          <button onClick={handleSave} className="btn-primary inline-flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <h3 className="text-xl font-bold text-primary mb-4">Data Management</h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLoadSampleData}
              className="btn-primary inline-flex items-center justify-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Load Sample Data</span>
            </button>

            <button
              onClick={handleExport}
              className="btn-secondary inline-flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>

            <label className="btn-secondary inline-flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearData}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </button>
          </div>

          <div className="bg-background-light rounded-xl p-4">
            <p className="text-sm text-text-muted">
              <strong>Load Sample Data:</strong> Try the app with demo materials on Quantum Mechanics and Photosynthesis
            </p>
            <p className="text-sm text-text-muted mt-2">
              <strong>Export:</strong> Download all your data as a JSON file for backup
            </p>
            <p className="text-sm text-text-muted mt-2">
              <strong>Import:</strong> Restore data from a previously exported file
            </p>
            <p className="text-sm text-text-muted mt-2">
              <strong>Clear:</strong> Permanently delete all stored data (cannot be undone)
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <h3 className="text-xl font-bold text-primary mb-4">About MindMesh</h3>
        <div className="space-y-3 text-sm text-text-muted">
          <p>
            <strong className="text-primary">Version:</strong> 1.0.0
          </p>
          <p>
            <strong className="text-primary">Description:</strong> AI-powered study assistant that helps you organize and interconnect your learning materials through an interactive Knowledge Mesh.
          </p>
          <p>
            <strong className="text-primary">Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>PDF and text processing</li>
            <li>AI-powered summarization</li>
            <li>Automatic flashcard generation</li>
            <li>Interactive knowledge graph visualization</li>
            <li>Local data storage</li>
            <li>Export/Import functionality</li>
          </ul>
          <p className="pt-4 border-t border-gray-200">
            <strong className="text-primary">Tech Stack:</strong> React, TailwindCSS, D3.js, Vite
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
