import type { Node, Edge } from "reactflow";
import type { NodeData } from "./flow";

//structure type
export interface Structure {
    id: string;
    timestamp: number;
    createdAt: string;
    name: string;
    status: string;
    nodes: Node<NodeData>[]
    edges: Edge[]
}

// Flow snapshot type
export interface FlowSnapshot {
  id: string;
  timestamp: number;
  createdAt: string
  structure: Structure;
}