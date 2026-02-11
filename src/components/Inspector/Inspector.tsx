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

  // 判断选中的是节点还是边
  const selectedNode = nodes.find((n) => n.id === selectedId)
  const selectedEdge = edges.find((e) => e.id === selectedId)

  if (!selectedId) {
    return (
      <div className={styles.noSelection}>
        <div className={styles.noSelectionIcon}>📌</div>
        <div className={styles.noSelectionTitle}>未选中任何元素</div>
        <div className={styles.noSelectionText}>
          请在画布中点击一个节点或连接线以查看和编辑其属性
        </div>
      </div>
    )
  }

  // 如果选中的是边
  if (selectedEdge) {
    const sourceNode = nodes.find(n => n.id === selectedEdge.source)
    const targetNode = nodes.find(n => n.id === selectedEdge.target)

    return (
      <div className={styles.inspector}>
        <div className={styles.header}>
          <h4 className={styles.title}>连接线属性</h4>
          <div className={styles.elementId}>ID: {selectedEdge.id}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              连接类型
              <div className={styles.readonlyField}>
                {selectedEdge.type || 'default'}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              来源节点
              <div className={styles.readonlyField}>
                {sourceNode ? sourceNode.data.title : selectedEdge.source}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              目标节点
              <div className={styles.readonlyField}>
                {targetNode ? targetNode.data.title : selectedEdge.target}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              连接线状态
              <div className={styles.edgeStatus}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>动画:</span>
                  <span className={`${styles.statusValue} ${selectedEdge.animated ? styles.animated : ''}`}>
                    {selectedEdge.animated ? '开启' : '关闭'}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>连线:</span>
                  <span className={styles.statusValue}>
                    {selectedEdge.sourceHandle ? '自定义' : '默认'}
                  </span>
                </div>
              </div>
            </label>
          </div>

          <div className={styles.footer}>
            <button
              className={styles.deleteButton}
              onClick={() => {
                if (window.confirm('确定要删除这个连接线吗？')) {
                  deleteEdge(selectedEdge.id)
                }
              }}
            >
              删除连接线
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 如果选中的是节点
  if (selectedNode) {
    return (
      <div className={styles.inspector}>
        <div className={styles.header}>
          <h4 className={styles.title}>节点属性</h4>
          <div className={styles.elementId}>ID: {selectedNode.id}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              标题
              <input
                type="text"
                className={styles.input}
                value={selectedNode.data.title}
                onChange={(e) =>
                  updateNode(selectedNode.id, { title: e.target.value })
                }
                placeholder="输入节点标题"
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              描述
              <textarea
                className={styles.textarea}
                value={selectedNode.data.description || ''}
                onChange={(e) =>
                  updateNode(selectedNode.id, { description: e.target.value })
                }
                placeholder="输入节点描述"
                rows={3}
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              节点类型
              <div className={styles.readonlyField}>
                {selectedNode.data.type || '默认'}
              </div>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              所属层级
              <div className={styles.readonlyField}>
                {selectedNode.data.layer === 'layer1' ? '核心目的' :
                 selectedNode.data.layer === 'layer2' ? '主要目标' : '基础'}
              </div>
            </label>
          </div>

          {selectedNode.data.weight !== undefined && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                权重
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
                if (window.confirm('确定要删除这个节点吗？')) {
                  deleteNode(selectedNode.id)
                }
              }}
            >
              删除节点
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}