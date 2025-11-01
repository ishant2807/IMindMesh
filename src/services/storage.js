// Storage service for managing localStorage
const STORAGE_KEYS = {
  MATERIALS: 'mindmesh_materials',
  FLASHCARDS: 'mindmesh_flashcards',
  GRAPH_DATA: 'mindmesh_graph_data',
  SETTINGS: 'mindmesh_settings',
}

class StorageService {
  // Materials
  async getMaterials() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATERIALS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error getting materials:', error)
      return []
    }
  }

  async saveMaterials(materials) {
    try {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials))
      return true
    } catch (error) {
      console.error('Error saving materials:', error)
      return false
    }
  }

  // Flashcards
  async getFlashcards() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error getting flashcards:', error)
      return []
    }
  }

  async saveFlashcards(flashcards) {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards))
      return true
    } catch (error) {
      console.error('Error saving flashcards:', error)
      return false
    }
  }

  // Graph Data
  async getGraphData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRAPH_DATA)
      return data ? JSON.parse(data) : { nodes: [], links: [] }
    } catch (error) {
      console.error('Error getting graph data:', error)
      return { nodes: [], links: [] }
    }
  }

  async saveGraphData(graphData) {
    try {
      localStorage.setItem(STORAGE_KEYS.GRAPH_DATA, JSON.stringify(graphData))
      return true
    } catch (error) {
      console.error('Error saving graph data:', error)
      return false
    }
  }

  // Settings
  async getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : {
        apiProvider: 'mock',
        apiKey: '',
        theme: 'light'
      }
    } catch (error) {
      console.error('Error getting settings:', error)
      return {
        apiProvider: 'mock',
        apiKey: '',
        theme: 'light'
      }
    }
  }

  async saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }

  // Clear all data
  async clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  // Export data as JSON
  async exportData() {
    try {
      const data = {
        materials: await this.getMaterials(),
        flashcards: await this.getFlashcards(),
        graphData: await this.getGraphData(),
        settings: await this.getSettings(),
        exportDate: new Date().toISOString()
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return null
    }
  }

  // Import data from JSON
  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      
      if (data.materials) await this.saveMaterials(data.materials)
      if (data.flashcards) await this.saveFlashcards(data.flashcards)
      if (data.graphData) await this.saveGraphData(data.graphData)
      if (data.settings) await this.saveSettings(data.settings)
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

export const storageService = new StorageService()
