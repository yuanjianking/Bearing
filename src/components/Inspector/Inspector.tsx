// Inspector.tsx
import { useFlowStore } from '../../stores/useFlowStore'
import styles from './Inspector.module.css'

export default function Inspector() {
  const selectedId = useFlowStore((s) => s.selectedId)
  const nodes = useFlowStore((s) => s.nodes)
  const edges = useFlowStore((s) => s.edges)
  const updateNode = useFlowStore((s) => s.updateNode)
  const deleteNode = useFlowStore((s) => s.deleteNode)
  const deleteEdge = useFlowStore((s) => s.deleteEdge)

  // Determine if selected item is a node or edge
  const selectedNode = nodes.find((n) => n.id === selectedId)
  const selectedEdge = edges.find((e) => e.id === selectedId)

  if (!selectedId) {
    return (
      <div className={styles.noSelection}>
        <div className={styles.noSelectionIcon}>📌</div>
        <div className={styles.noSelectionTitle}>No Element Selected</div>
        <div className={styles.noSelectionText}>
          Click on a node or edge in the canvas to view and edit its properties
        </div>
      </div>
    )
  }

  // If selected item is an edge
  if (selectedEdge) {
    const sourceNode = nodes.find(n => n.id === selectedEdge.source)
    const targetNode = nodes.find(n => n.id === selectedEdge.target)

    return (
      <div className={styles.inspector}>
        <div className={styles.header}>
          <h4 className={styles.title}>Edge Properties</h4>
          <div className={styles.elementId}>ID: {selectedEdge.id}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Edge Type
              <div className={styles.readonlyField}>
                {selectedEdge.type || 'default'}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Source Node
              <div className={styles.readonlyField}>
                {sourceNode ? sourceNode.data.title : selectedEdge.source}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Target Node
              <div className={styles.readonlyField}>
                {targetNode ? targetNode.data.title : selectedEdge.target}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Edge Status
              <div className={styles.edgeStatus}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Animation:</span>
                  <span className={`${styles.statusValue} ${selectedEdge.animated ? styles.animated : ''}`}>
                    {selectedEdge.animated ? 'On' : 'Off'}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Connection:</span>
                  <span className={styles.statusValue}>
                    {selectedEdge.sourceHandle ? 'Custom' : 'Default'}
                  </span>
                </div>
              </div>
            </label>
          </div>

          <div className={styles.footer}>
            <button
              className={styles.deleteButton}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this edge?')) {
                  deleteEdge(selectedEdge.id)
                }
              }}
            >
              Delete Edge
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If selected item is a node
  if (selectedNode) {
    return (
      <div className={styles.inspector}>
        <div className={styles.header}>
          <h4 className={styles.title}>Node Properties</h4>
          <div className={styles.elementId}>ID: {selectedNode.id}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Title
              <input
                type="text"
                className={styles.input}
                value={selectedNode.data.title}
                onChange={(e) =>
                  updateNode(selectedNode.id, { title: e.target.value })
                }
                placeholder="Enter node title"
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Description
              <textarea
                className={styles.textarea}
                value={selectedNode.data.description || ''}
                onChange={(e) =>
                  updateNode(selectedNode.id, { description: e.target.value })
                }
                placeholder="Enter node description"
                rows={3}
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Node Type
              <div className={styles.readonlyField}>
                {selectedNode.data.type || 'Default'}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Layer
              <div className={styles.readonlyField}>
                {selectedNode.data.layer === 'layer1' ? 'Core Purpose' :
                 selectedNode.data.layer === 'layer2' ? 'Major Goals' : 'Foundations'}
              </div>
            </label>
          </div>

          {selectedNode.data.weight !== undefined && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Weight
                <div className={styles.weightContainer}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className={styles.rangeInput}
                    value={selectedNode.data.weight || 1}
                    onChange={(e) =>
                      updateNode(selectedNode.id, { weight: parseInt(e.target.value) })
                    }
                  />
                  <span className={styles.weightValue}>{selectedNode.data.weight || 1}</span>
                </div>
              </label>
            </div>
          )}

          <div className={styles.footer}>
            <button
              className={styles.deleteButton}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this node?')) {
                  deleteNode(selectedNode.id)
                }
              }}
            >
              Delete Node
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}