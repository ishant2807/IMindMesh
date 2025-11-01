// Sample data for demonstration purposes

export const sampleMaterials = [
  {
    id: 'sample-1',
    title: 'Introduction to Quantum Mechanics',
    originalText: 'Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at atomic and subatomic scales...',
    summary: {
      brief: 'This material covers fundamental concepts of quantum mechanics, including wave-particle duality, uncertainty principle, and quantum states.',
      keyPoints: [
        'Quantum mechanics describes behavior at atomic and subatomic scales',
        'Wave-particle duality is a central concept',
        'Heisenberg uncertainty principle sets fundamental limits on measurement',
        'Quantum states and superposition are key principles'
      ]
    },
    topics: [
      { name: 'Quantum Mechanics', importance: 1, keywords: ['quantum', 'mechanics', 'physics'] },
      { name: 'Wave-Particle Duality', importance: 0.9, keywords: ['wave', 'particle', 'duality'] },
      { name: 'Uncertainty Principle', importance: 0.85, keywords: ['uncertainty', 'heisenberg', 'measurement'] },
      { name: 'Quantum States', importance: 0.8, keywords: ['states', 'superposition', 'quantum'] }
    ],
    flashcards: [
      {
        id: 'fc-1-1',
        materialId: 'sample-1',
        question: 'What is wave-particle duality?',
        answer: 'Wave-particle duality is the concept that all matter and energy exhibits both wave-like and particle-like properties. For example, light can behave as both a wave and a particle (photon).',
        difficulty: 'medium',
        topic: 'Wave-Particle Duality'
      },
      {
        id: 'fc-1-2',
        materialId: 'sample-1',
        question: 'What does the Heisenberg Uncertainty Principle state?',
        answer: 'The Heisenberg Uncertainty Principle states that it is impossible to simultaneously know both the exact position and exact momentum of a particle. The more precisely one property is measured, the less precisely the other can be known.',
        difficulty: 'hard',
        topic: 'Uncertainty Principle'
      },
      {
        id: 'fc-1-3',
        materialId: 'sample-1',
        question: 'What is quantum superposition?',
        answer: 'Quantum superposition is the principle that a quantum system can exist in multiple states simultaneously until it is measured. The famous Schrödinger\'s cat thought experiment illustrates this concept.',
        difficulty: 'medium',
        topic: 'Quantum States'
      }
    ],
    quiz: {
      id: 'quiz-1',
      questions: [
        {
          id: 'q-1-1',
          question: 'Which of the following best describes quantum mechanics?',
          options: [
            'A theory describing behavior at atomic and subatomic scales',
            'A theory only about light',
            'A theory about classical physics',
            'A theory about large-scale objects'
          ],
          correctAnswer: 0,
          explanation: 'Quantum mechanics is specifically a theory that describes the behavior of matter and energy at atomic and subatomic scales.'
        }
      ]
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Photosynthesis Process',
    originalText: 'Photosynthesis is the process by which plants convert light energy into chemical energy...',
    summary: {
      brief: 'This material explains photosynthesis, the process plants use to convert light energy into chemical energy, including light-dependent and light-independent reactions.',
      keyPoints: [
        'Photosynthesis converts light energy to chemical energy',
        'Takes place in chloroplasts of plant cells',
        'Light-dependent reactions occur in thylakoid membranes',
        'Calvin cycle (light-independent) produces glucose'
      ]
    },
    topics: [
      { name: 'Photosynthesis', importance: 1, keywords: ['photosynthesis', 'plants', 'energy'] },
      { name: 'Chloroplasts', importance: 0.85, keywords: ['chloroplast', 'organelle', 'cell'] },
      { name: 'Light Reactions', importance: 0.9, keywords: ['light', 'reaction', 'thylakoid'] },
      { name: 'Calvin Cycle', importance: 0.8, keywords: ['calvin', 'cycle', 'glucose'] }
    ],
    flashcards: [
      {
        id: 'fc-2-1',
        materialId: 'sample-2',
        question: 'What is photosynthesis?',
        answer: 'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy (usually from the sun) into chemical energy in the form of glucose, using carbon dioxide and water.',
        difficulty: 'easy',
        topic: 'Photosynthesis'
      },
      {
        id: 'fc-2-2',
        materialId: 'sample-2',
        question: 'Where does photosynthesis occur in plant cells?',
        answer: 'Photosynthesis occurs in chloroplasts, which are specialized organelles found in plant cells. The light-dependent reactions occur in the thylakoid membranes, while the Calvin cycle occurs in the stroma.',
        difficulty: 'medium',
        topic: 'Chloroplasts'
      }
    ],
    quiz: {
      id: 'quiz-2',
      questions: [
        {
          id: 'q-2-1',
          question: 'What are the main products of photosynthesis?',
          options: [
            'Glucose and oxygen',
            'Carbon dioxide and water',
            'Nitrogen and oxygen',
            'Glucose and carbon dioxide'
          ],
          correctAnswer: 0,
          explanation: 'Photosynthesis produces glucose (a sugar) and oxygen as byproducts, using carbon dioxide and water as inputs.'
        }
      ]
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const sampleGraphData = {
  nodes: [
    { id: 'sample-1', name: 'Quantum Mechanics', type: 'main', materialId: 'sample-1' },
    { id: 'sample-1-topic-0', name: 'Quantum Mechanics', type: 'subtopic', materialId: 'sample-1' },
    { id: 'sample-1-topic-1', name: 'Wave-Particle Duality', type: 'subtopic', materialId: 'sample-1' },
    { id: 'sample-1-topic-2', name: 'Uncertainty Principle', type: 'subtopic', materialId: 'sample-1' },
    { id: 'sample-1-topic-3', name: 'Quantum States', type: 'subtopic', materialId: 'sample-1' },
    { id: 'sample-2', name: 'Photosynthesis', type: 'main', materialId: 'sample-2' },
    { id: 'sample-2-topic-0', name: 'Photosynthesis', type: 'subtopic', materialId: 'sample-2' },
    { id: 'sample-2-topic-1', name: 'Chloroplasts', type: 'subtopic', materialId: 'sample-2' },
    { id: 'sample-2-topic-2', name: 'Light Reactions', type: 'subtopic', materialId: 'sample-2' },
    { id: 'sample-2-topic-3', name: 'Calvin Cycle', type: 'subtopic', materialId: 'sample-2' }
  ],
  links: [
    { source: 'sample-1', target: 'sample-1-topic-0', strength: 1 },
    { source: 'sample-1', target: 'sample-1-topic-1', strength: 1 },
    { source: 'sample-1', target: 'sample-1-topic-2', strength: 1 },
    { source: 'sample-1', target: 'sample-1-topic-3', strength: 1 },
    { source: 'sample-2', target: 'sample-2-topic-0', strength: 1 },
    { source: 'sample-2', target: 'sample-2-topic-1', strength: 1 },
    { source: 'sample-2', target: 'sample-2-topic-2', strength: 1 },
    { source: 'sample-2', target: 'sample-2-topic-3', strength: 1 },
    // Cross-connections
    { source: 'sample-1-topic-1', target: 'sample-2-topic-2', strength: 0.3 }
  ]
}

export const loadSampleData = async () => {
  // This can be called from Settings to load demo data
  return {
    materials: sampleMaterials,
    flashcards: sampleMaterials.flatMap(m => m.flashcards),
    graphData: sampleGraphData
  }
}
