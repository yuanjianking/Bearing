import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowStore } from './stores/useFlowStore'
import Inspector from './components/Inspector'
import { useState } from 'react'

import WeightNode from './nodes/WeightNode'
import type { NodeTypes } from 'reactflow'


const nodeTypes: NodeTypes = {
  weight: WeightNode,
}

export default function App() {
  const [snapshotTip, setSnapshotTip] = useState<string | null>(null)
  const [showSnapshots, setShowSnapshots] = useState(false)

  const nodes = useFlowStore((s) => s.nodes)
  const edges = useFlowStore((s) => s.edges)
  const onNodesChange = useFlowStore((s) => s.onNodesChange)
  const addNode = useFlowStore((s) => s.addNode)
  const setSelectedId = useFlowStore((s) => s.setSelectedId)
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange)
  const onConnect = useFlowStore((s) => s.onConnect)
  const saveSnapshot = useFlowStore((s) => s.saveSnapshot)
  const snapshots = useFlowStore((s) => s.snapshots)
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot)

  const handleSaveSnapshot = () => {
    saveSnapshot()
    setSnapshotTip('✅ 快照已记录')
    setTimeout(() => setSnapshotTip(null), 1500)
  }


  function formatSnapshotTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()

    const isSameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)

    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate()

    const time = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    if (isSameDay) {
      return `${time}（今日）`
    }

    if (isYesterday) {
      return `昨天 ${time}`
    }

    const date = d.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
    })

    return `${date} ${time}`
  }


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        zIndex: 10,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <button onClick={addNode}>＋ 新建承重节点</button>
        <button onClick={handleSaveSnapshot} >
          📸 记录快照
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowSnapshots((v) => !v)}>
            📂 快照 ▾
          </button>

          {showSnapshots && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 6,
                minWidth: 140,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 20,
              }}
            >
              {snapshots.length === 0 && (
                <div style={{ padding: 8, fontSize: 12, color: '#999' }}>
                  暂无快照
                </div>
              )}

              {snapshots.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '6px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => {
                    loadSnapshot(s.id)
                    setShowSnapshots(false)
                  }}
                >
                 {formatSnapshotTime(s.createdAt)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Inspector />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedId(node.id)}
        onEdgeClick={() => setSelectedId(null)}
        fitView

      >
        <Background />
      </ReactFlow>
      {snapshotTip && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(76, 175, 80, 0.5)',
              color: '#fff',
              borderRadius: 6,
              fontSize: 14,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {snapshotTip}
          </div>
        </div>
      )}
    </div>
  )
}
