import { useFlowStore } from '../stores/useFlowStore'

export default function Inspector() {
  const selectedId = useFlowStore((s) => s.selectedId)
  const nodes = useFlowStore((s) => s.nodes)
  const updateNode = useFlowStore((s) => s.updateNode)
  const deleteNode = useFlowStore((s) => s.deleteNode)

  if (!selectedId) return null

  const node = nodes.find((n) => n.id === selectedId)
  if (!node) return null

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 20,
        background: '#fff',
        padding: 12,
        borderRadius: 6,
        minWidth: 220,
      }}
    >
      <h4>节点属性</h4>
      <div>ID：{node.id}</div>

      <label style={{ display: 'block', marginTop: 8 }}>
        标题：
        <input
          value={node.data.title}
          onChange={(e) =>
            updateNode(node.id, { title: e.target.value })
          }
          style={{ width: '100%', marginTop: 4 }}
        />

      </label>
      <label style={{ display: 'block', marginTop: 8 }}>
        描述：
        <textarea
          value={node.data.description || ''}
          onChange={(e) =>
            updateNode(node.id, { description: e.target.value })
          }
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>
      <button
        style={{
          marginTop: 12,
          background: '#ff4d4f',
          color: '#fff',
          border: 'none',
          padding: '6px 10px',
          borderRadius: 4,
          cursor: 'pointer',
        }}
        onClick={() => deleteNode(node.id)}
      >
        删除节点
      </button>

    </div>

  )
}
