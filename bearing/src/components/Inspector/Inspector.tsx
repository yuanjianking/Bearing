import { useFlowStore } from '../../stores/useFlowStore'
import styles from './Inspector.module.css' // 创建新的CSS模块

export default function Inspector() {
  const selectedId = useFlowStore((s) => s.selectedId)
  const nodes = useFlowStore((s) => s.nodes)
  const updateNode = useFlowStore((s) => s.updateNode)
  const deleteNode = useFlowStore((s) => s.deleteNode)

  if (!selectedId) {
    return (
      <div className={styles.noSelection}>
        <div className={styles.noSelectionIcon}>📌</div>
        <div className={styles.noSelectionTitle}>未选中节点</div>
        <div className={styles.noSelectionText}>
          请在画布中点击一个节点以查看和编辑其属性
        </div>
      </div>
    )
  }

  const node = nodes.find((n) => n.id === selectedId)
  if (!node) return null

  return (
    <div className={styles.inspector}>
      <div className={styles.header}>
        <h4 className={styles.title}>节点属性</h4>
        <div className={styles.nodeId}>ID: {node.id}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            标题
            <input
              type="text"
              className={styles.input}
              value={node.data.title}
              onChange={(e) =>
                updateNode(node.id, { title: e.target.value })
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
              value={node.data.description || ''}
              onChange={(e) =>
                updateNode(node.id, { description: e.target.value })
              }
              placeholder="输入节点描述"
              rows={3}
            />
          </label>
        </div>

        {node.data.weight !== undefined && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              权重
              <div className={styles.weightContainer}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className={styles.rangeInput}
                  value={node.data.weight || 1}
                  onChange={(e) =>
                    updateNode(node.id, { weight: parseInt(e.target.value) })
                  }
                />
                <span className={styles.weightValue}>{node.data.weight || 1}</span>
              </div>
            </label>
          </div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.deleteButton}
            onClick={() => {
              if (window.confirm('确定要删除这个节点吗？')) {
                deleteNode(node.id)
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