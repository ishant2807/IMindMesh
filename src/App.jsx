import { useState, useEffect } from 'react'
import bgImg from '../bgimg.png'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import UploadSection from './components/UploadSection'
import KnowledgeMesh from './components/KnowledgeMesh'
import Flashcards from './components/Flashcards'
import Settings from './components/Settings'
import { storageService } from './services/storage'
import { selectAll } from './services/db'
import TableList from './components/TableList'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [materials, setMaterials] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from Supabase and localStorage
    const loadData = async () => {
      try {
        // Try to load from Supabase first
        try {
          const response = await fetch(`${BACKEND_URL}/api/data/materials`)
          if (response.ok) {
            const result = await response.json()
            const supabaseMaterials = result.data || []
            
            // Convert Supabase materials to app format
            const formattedMaterials = supabaseMaterials.map(material => ({
              id: material.id,
              title: material.title,
              content: material.file_url,
              fileUrl: material.file_url,
              fileName: material.file_name,
              keywords: material.keywords || [],
              topics: material.topics || [],
              createdAt: material.created_at,
              summary: {
                brief: `Material: ${material.title}`,
                keyPoints: material.keywords || []
              },
              flashcards: [] // Will be generated on demand
            }))
            
            setMaterials(formattedMaterials)
            
            // Build graph from Supabase materials
            const graph = buildGraphFromMaterials(formattedMaterials)
            setGraphData(graph)
          } else {
            console.warn('Failed to load from Supabase, falling back to localStorage')
            throw new Error('Supabase load failed')
          }
        } catch (supabaseError) {
          console.warn('Supabase not available, using localStorage:', supabaseError)
          // Fallback to localStorage
          const savedMaterials = await storageService.getMaterials()
          const savedFlashcards = await storageService.getFlashcards()
          const savedGraph = await storageService.getGraphData()
          
          setMaterials(savedMaterials || [])
          setFlashcards(savedFlashcards || [])
          setGraphData(savedGraph || { nodes: [], links: [] })
        }
        
        // Always load flashcards from localStorage for now
        const savedFlashcards = await storageService.getFlashcards()
        setFlashcards(savedFlashcards || [])
        
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const buildGraphFromMaterials = (materials) => {
    const nodes = []
    const links = []
    const topicMap = new Map()
    
    materials.forEach(material => {
      // Add main material node
      nodes.push({
        id: material.id,
        name: material.title,
        type: 'main',
        materialId: material.id
      })
      
      // Add topic nodes from keywords
      if (material.keywords && Array.isArray(material.keywords)) {
        material.keywords.forEach((keyword, index) => {
          const topicId = `${material.id}-topic-${index}`
          const topicKey = keyword.toLowerCase()
          
          // Check if this topic already exists
          if (!topicMap.has(topicKey)) {
            topicMap.set(topicKey, topicId)
            nodes.push({
              id: topicId,
              name: keyword,
              type: 'subtopic',
              materialId: material.id
            })
          }
          
          // Link topic to material
          links.push({
            source: material.id,
            target: topicMap.get(topicKey) || topicId,
            value: 1
          })
        })
      }
    })
    
    return { nodes, links }
  }

  const handleMaterialAdded = async (newMaterial) => {
    // Reload materials from Supabase to get the latest data
    try {
      const response = await fetch(`${BACKEND_URL}/api/data/materials`)
      if (response.ok) {
        const result = await response.json()
        const supabaseMaterials = result.data || []
        
        const formattedMaterials = supabaseMaterials.map(material => ({
          id: material.id,
          title: material.title,
          content: material.file_url,
          fileUrl: material.file_url,
          fileName: material.file_name,
          keywords: material.keywords || [],
          topics: material.topics || [],
          createdAt: material.created_at,
          summary: {
            brief: `Material: ${material.title}`,
            keyPoints: material.keywords || []
          },
          flashcards: []
        }))
        
        setMaterials(formattedMaterials)
        
        // Rebuild graph
        const graph = buildGraphFromMaterials(formattedMaterials)
        setGraphData(graph)
      }
    } catch (error) {
      console.error('Error reloading materials:', error)
      // Fallback to localStorage update
      const updatedMaterials = [...materials, newMaterial]
      setMaterials(updatedMaterials)
      await storageService.saveMaterials(updatedMaterials)
    }

    // Update flashcards
    if (newMaterial.flashcards) {
      const updatedFlashcards = [...flashcards, ...newMaterial.flashcards]
      setFlashcards(updatedFlashcards)
      await storageService.saveFlashcards(updatedFlashcards)
    }
  }

  const updateGraphData = (currentGraph, newMaterial) => {
    const newNodes = []
    const newLinks = []
    
    // Add main topic node
    const mainTopic = {
      id: newMaterial.id,
      name: newMaterial.title,
      type: 'main',
      materialId: newMaterial.id
    }
    newNodes.push(mainTopic)

    // Add subtopic nodes
    if (newMaterial.topics) {
      newMaterial.topics.forEach((topic, index) => {
        const topicNode = {
          id: `${newMaterial.id}-topic-${index}`,
          name: topic.name,
          type: 'subtopic',
          materialId: newMaterial.id
        }
        newNodes.push(topicNode)
        
        // Link subtopic to main topic
        newLinks.push({
          source: newMaterial.id,
          target: topicNode.id,
          strength: 1
        })
      })
    }

    // Find connections with existing nodes based on keywords
    const allNodes = [...currentGraph.nodes, ...newNodes]
    const existingNodes = currentGraph.nodes

    newNodes.forEach(newNode => {
      existingNodes.forEach(existingNode => {
        if (hasRelationship(newNode, existingNode, materials)) {
          newLinks.push({
            source: newNode.id,
            target: existingNode.id,
            strength: 0.5
          })
        }
      })
    })

    return {
      nodes: allNodes,
      links: [...currentGraph.links, ...newLinks]
    }
  }

  const hasRelationship = (node1, node2, materials) => {
    // Simple keyword matching for now
    const keywords1 = node1.name.toLowerCase().split(' ')
    const keywords2 = node2.name.toLowerCase().split(' ')
    
    return keywords1.some(k1 => keywords2.some(k2 => 
      k1.length > 4 && k2.length > 4 && (k1.includes(k2) || k2.includes(k1))
    ))
  }

  const handleDeleteMaterial = async (materialId) => {
    const updatedMaterials = materials.filter(m => m.id !== materialId)
    setMaterials(updatedMaterials)
    await storageService.saveMaterials(updatedMaterials)

    // Update flashcards
    const updatedFlashcards = flashcards.filter(f => f.materialId !== materialId)
    setFlashcards(updatedFlashcards)
    await storageService.saveFlashcards(updatedFlashcards)

    // Update graph data
    const updatedGraph = {
      nodes: graphData.nodes.filter(n => n.materialId !== materialId),
      links: graphData.links.filter(l => 
        !l.source.toString().startsWith(materialId) && 
        !l.target.toString().startsWith(materialId)
      )
    }
    setGraphData(updatedGraph)
    await storageService.saveGraphData(updatedGraph)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-light text-lg">Loading MindMesh...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light"
    //code added here
    style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeView === 'dashboard' && (
          <Dashboard 
            materials={materials}
            flashcards={flashcards}
            graphData={graphData}
            onDeleteMaterial={handleDeleteMaterial}
            onNavigate={setActiveView}
          />
        )}
        
        {activeView === 'upload' && (
          <UploadSection onMaterialAdded={handleMaterialAdded} />
        )}
        
        {activeView === 'graph' && (
          <KnowledgeMesh 
            graphData={graphData}
            materials={materials}
          />
        )}
        
        {activeView === 'flashcards' && (
          <Flashcards 
            flashcards={flashcards}
            materials={materials}
          />
        )}
        
        {activeView === 'data' && (
          <TableList />
        )}
        
        {activeView === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  )
}

export default App
