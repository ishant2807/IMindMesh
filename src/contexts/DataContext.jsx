import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const DataContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const DataProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try Supabase first, fallback to localStorage
      try {
        const response = await fetch(`${BACKEND_URL}/api/data/materials`);
        if (response.ok) {
          const result = await response.json();
          const supabaseMaterials = result.data || [];
          
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
          }));
          
          setMaterials(formattedMaterials);
          const graph = buildGraphFromMaterials(formattedMaterials);
          setGraphData(graph);
        } else {
          throw new Error('Supabase load failed');
        }
      } catch (supabaseError) {
        console.warn('Using localStorage:', supabaseError.message);
        const savedMaterials = await storageService.getMaterials();
        const savedFlashcards = await storageService.getFlashcards();
        const savedGraph = await storageService.getGraphData();
        
        setMaterials(savedMaterials || []);
        setFlashcards(savedFlashcards || []);
        setGraphData(savedGraph || { nodes: [], links: [] });
      }
    } catch (error) {
      console.error('Data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildGraphFromMaterials = (materialsData) => {
    const nodes = [];
    const links = [];
    const topicMap = new Map();

    materialsData.forEach(material => {
      // Add main material node
      nodes.push({
        id: material.id,
        name: material.title,
        type: 'main',
        materialId: material.id
      });

      // Add topic nodes from keywords
      if (material.keywords && Array.isArray(material.keywords)) {
        material.keywords.forEach((keyword, index) => {
          const topicId = `${material.id}-topic-${index}`;
          const topicKey = keyword.toLowerCase();

          // Check if this topic already exists
          if (!topicMap.has(topicKey)) {
            topicMap.set(topicKey, topicId);
            nodes.push({
              id: topicId,
              name: keyword,
              type: 'subtopic',
              materialId: material.id
            });
          }

          // Link topic to material
          links.push({
            source: material.id,
            target: topicMap.get(topicKey) || topicId,
            value: 1
          });
        });
      }
    });

    return { nodes, links };
  };

  const addMaterial = async (newMaterial) => {
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    
    if (newMaterial.flashcards) {
      const updatedFlashcards = [...flashcards, ...newMaterial.flashcards];
      setFlashcards(updatedFlashcards);
      await storageService.saveFlashcards(updatedFlashcards);
    }

    const updatedGraph = updateGraphData(graphData, newMaterial);
    setGraphData(updatedGraph);

    await storageService.saveMaterials(updatedMaterials);
    await storageService.saveGraphData(updatedGraph);
  };

  const deleteMaterial = async (materialId) => {
    const updatedMaterials = materials.filter(m => m.id !== materialId);
    const updatedFlashcards = flashcards.filter(f => f.materialId !== materialId);
    
    setMaterials(updatedMaterials);
    setFlashcards(updatedFlashcards);

    const updatedGraph = buildGraphFromMaterials(updatedMaterials);
    setGraphData(updatedGraph);

    await storageService.saveMaterials(updatedMaterials);
    await storageService.saveFlashcards(updatedFlashcards);
    await storageService.saveGraphData(updatedGraph);
  };

  const updateGraphData = (currentGraph, newMaterial) => {
    const newNodes = [];
    const newLinks = [];

    // Add main material node
    const mainNode = {
      id: newMaterial.id,
      name: newMaterial.title,
      type: 'main',
      materialId: newMaterial.id
    };
    newNodes.push(mainNode);

    // Add topic nodes from keywords
    if (newMaterial.keywords && Array.isArray(newMaterial.keywords)) {
      newMaterial.keywords.forEach((keyword, index) => {
        const topicNode = {
          id: `${newMaterial.id}-topic-${index}`,
          name: keyword,
          type: 'subtopic',
          materialId: newMaterial.id
        };
        newNodes.push(topicNode);

        // Link subtopic to main material
        newLinks.push({
          source: newMaterial.id,
          target: topicNode.id,
          value: 1
        });
      });
    }

    // Find connections with existing nodes based on keyword matching
    const existingNodes = currentGraph.nodes;
    newNodes.forEach(newNode => {
      existingNodes.forEach(existingNode => {
        if (hasRelationship(newNode, existingNode)) {
          newLinks.push({
            source: newNode.id,
            target: existingNode.id,
            value: 0.5
          });
        }
      });
    });

    return {
      nodes: [...currentGraph.nodes, ...newNodes],
      links: [...currentGraph.links, ...newLinks]
    };
  };

  const hasRelationship = (node1, node2) => {
    // Simple keyword matching
    const keywords1 = node1.name.toLowerCase().split(' ');
    const keywords2 = node2.name.toLowerCase().split(' ');

    return keywords1.some(k1 =>
      keywords2.some(k2 =>
        k1.length > 4 && k2.length > 4 && (k1.includes(k2) || k2.includes(k1))
      )
    );
  };

  const clearAllData = async () => {
    setMaterials([]);
    setFlashcards([]);
    setGraphData({ nodes: [], links: [] });
    await storageService.clearAll();
  };

  const value = {
    materials,
    flashcards,
    graphData,
    loading,
    addMaterial,
    deleteMaterial,
    clearAllData,
    refreshData: loadData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
