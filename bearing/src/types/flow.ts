export interface NodeData {
  title: string
  description?: string
  type?: 'goal' | 'task' | 'constraint' | 'resource'
  weight?: number
}
