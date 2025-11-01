import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react'

const KnowledgeMesh = ({ graphData, materials }) => {
  const svgRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, window.innerHeight - 300)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!graphData.nodes.length || !svgRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    const { width, height } = dimensions
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    // Create container group for zoom
    const g = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(100)
        .strength(d => d.strength || 0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Create arrow markers for links
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#5BC0BE')
      .attr('opacity', 0.6)

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke', '#5BC0BE')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength || 1) * 2)
      .attr('marker-end', 'url(#arrow)')

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation()
        handleNodeClick(d)
      })

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.type === 'main' ? 30 : 20)
      .attr('fill', d => d.type === 'main' ? '#5BC0BE' : '#1C2541')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))')
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d => (d.type === 'main' ? 30 : 20) * 1.2)
          .style('filter', 'drop-shadow(0px 6px 12px rgba(91, 192, 190, 0.4))')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d => d.type === 'main' ? 30 : 20)
          .style('filter', 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))')
      })

    // Add labels to nodes
    node.append('text')
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'main' ? 45 : 35)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#0B132B')
      .attr('pointer-events', 'none')

    // Add tooltips
    node.append('title')
      .text(d => d.name)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [graphData, dimensions])

  const handleNodeClick = (node) => {
    const material = materials.find(m => m.id === node.materialId)
    setSelectedNode({ ...node, material })
  }

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().scaleBy, 1.3)
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().scaleBy, 0.7)
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().transform, d3.zoomIdentity)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Knowledge Mesh</h2>
            <p className="text-text-muted">
              Interactive visualization of connected topics and concepts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Visualization */}
      {graphData.nodes.length === 0 ? (
        <div className="card bg-white/10 backdrop-blur-sm border border-white/20 text-center py-12">
          <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Info className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">No data yet</h3>
          <p className="text-text-muted">
            Add some study materials to see the knowledge mesh visualization
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <svg ref={svgRef} className="w-full bg-gradient-to-br from-background-light to-white"></svg>
        </div>
      )}

      {/* Legend */}
      {graphData.nodes.length > 0 && (
        <div className="card ">
          <h3 className="font-semibold text-primary mb-3">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-white"></div>
              <span className="text-sm text-text-muted">Main Topic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-secondary border-2 border-white"></div>
              <span className="text-sm text-text-muted">Subtopic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-0.5 bg-accent"></div>
              <span className="text-sm text-text-muted">Connection</span>
            </div>
          </div>
        </div>
      )}

      {/* Node Details Modal */}
      {selectedNode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary">{selectedNode.name}</h3>
                <span className="badge badge-primary mt-2">
                  {selectedNode.type === 'main' ? 'Main Topic' : 'Subtopic'}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-text-muted hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedNode.material && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Summary</h4>
                  <p className="text-text-muted">{selectedNode.material.summary?.brief}</p>
                </div>

                {selectedNode.material.summary?.keyPoints && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {selectedNode.material.summary.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2 text-text-muted">
                          <span className="text-accent font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNode.material.flashcards && selectedNode.material.flashcards.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Related Flashcards</h4>
                    <div className="space-y-2">
                      {selectedNode.material.flashcards.slice(0, 3).map((flashcard, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-primary mb-1">{flashcard.question}</p>
                          <p className="text-xs text-text-muted">{flashcard.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default KnowledgeMesh
