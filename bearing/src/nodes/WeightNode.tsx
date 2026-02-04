import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types/flow'


export default function WeightNode({ data,selected}: NodeProps<NodeData>) {
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        background: '#fff',
        border: selected ? '2px solid #1677ff' : '1px solid #999',
        minWidth: 120,
        pointerEvents: 'all'
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {data.title}
      </div>

      <div
        style={{
          fontSize: 12,
          color: '#666',
          whiteSpace: 'pre-wrap',
        }}
      >
        {data.description || '（无描述）'}
      </div>

      {/* 连接点 */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  )
}
