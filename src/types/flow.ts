export interface NodeData {
  title: string
  layer?: string
  description?: string
  type?: 'goal' | 'task' | 'constraint' | 'resource'
  weight?: number
}
