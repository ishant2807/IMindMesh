import { Plus, BookOpen, CreditCard, Network, Trash2, Eye, Calendar } from 'lucide-react'

const Dashboard = ({ materials, flashcards, graphData, onDeleteMaterial, onNavigate }) => {
  const stats = {
    totalMaterials: materials.length,
    totalFlashcards: flashcards.length,
    totalTopics: graphData.nodes.length,
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-soft-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to MindMesh</h2>
        <p className="text-text-light/80 mb-6">
          Your AI-powered study companion for organizing and interconnecting learning materials
        </p>
        <button
          onClick={() => onNavigate('upload')}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Material</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white/10 backdrop-blur-sm border border-white/20 group hover:scale-105 cursor-pointer" onClick={() => onNavigate('upload')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Study Materials</p>
              <p className="text-3xl font-bold text-primary">{stats.totalMaterials}</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 group-hover:bg-accent transition-all duration-300">
              <BookOpen className="w-8 h-8 text-accent group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>

        <div className="card bg-white/10 backdrop-blur-sm border border-white/20 group hover:scale-105 cursor-pointer" onClick={() => onNavigate('flashcards')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Flashcards</p>
              <p className="text-3xl font-bold text-primary">{stats.totalFlashcards}</p>
            </div>
            <div className="bg-secondary/10 rounded-xl p-3 group-hover:bg-secondary transition-all duration-300">
              <CreditCard className="w-8 h-8 text-secondary group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>

        <div className="card bg-white/10 backdrop-blur-sm border border-white/20 group hover:scale-105 cursor-pointer" onClick={() => onNavigate('graph')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Topics in Mesh</p>
              <p className="text-3xl font-bold text-primary">{stats.totalTopics}</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 group-hover:bg-accent transition-all duration-300">
              <Network className="w-8 h-8 text-accent group-hover:text-white transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="card bg-white/20 backdrop-blur-sm border border-white/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">Recent Materials</h3>
          {materials.length > 0 && (
            <button
              onClick={() => onNavigate('upload')}
              className="text-accent hover:text-accent-dark text-sm font-medium transition-colors"
            >
              View All
            </button>
          )}
        </div>

        {materials.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-accent" />
            </div>
            <h4 className="text-lg font-semibold text-primary mb-2">No materials yet</h4>
            <p className="text-text-muted mb-6">
              Start by uploading your first study material or pasting some notes
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Material</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {materials.slice(0, 5).map((material) => (
              <div
                key={material.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-accent transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-primary group-hover:text-accent transition-colors">
                        {material.title}
                      </h4>
                      <span className="badge badge-primary">{material.topics?.length || 0} topics</span>
                    </div>
                    <p className="text-text-muted text-sm mb-3 line-clamp-2">
                      {material.summary?.brief || 'No summary available'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-text-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(material.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{material.flashcards?.length || 0} flashcards</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        // TODO: Implement view detail
                        console.log('View material:', material.id)
                      }}
                      className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMaterial(material.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Points Preview */}
                {material.summary?.keyPoints && material.summary.keyPoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-text-muted mb-2">Key Points:</p>
                    <ul className="space-y-1">
                      {material.summary.keyPoints.slice(0, 2).map((point, index) => (
                        <li key={index} className="text-xs text-text-muted flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span className="line-clamp-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => onNavigate('graph')}
          className="card bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer group hover:shadow-soft-lg hover:border hover:border-accent transition-all duration-300 "
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent/10 rounded-xl p-4 group-hover:bg-accent transition-all duration-300">
              <Network className="w-8 h-8 text-accent group-hover:text-white transition-all duration-300" />
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Explore Knowledge Mesh</h4>
              <p className="text-sm text-text-muted">
                Visualize connections between your topics
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('flashcards')}
          className="card bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer group hover:shadow-soft-lg hover:border hover:border-secondary transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-secondary/10 rounded-xl p-4 group-hover:bg-secondary transition-all duration-300">
              <CreditCard className="w-8 h-8 text-secondary group-hover:text-white transition-all duration-300" />
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Study Flashcards</h4>
              <p className="text-sm text-text-muted">
                Review your AI-generated flashcards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
