import React, { useRef, useEffect, useCallback } from 'react';
import ReactFlow, {
  type NodeChange,
} from 'reactflow';
import type { Connection, Edge, EdgeTypes, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './CenterPanel.module.css';
import WeightNode from '../nodes/WeightNode';
import { useFlowStore } from '../../stores/useFlowStore';
import { nanoid } from 'nanoid';
import VisionToGoalEdge from '../edges/VisionToGoalEdge';
import GoalToActionEdge from '../edges/GoalToActionEdge';
import ActionToActionEdge from '../edges/ActionToActionEdge';

const nodeTypes: NodeTypes = {
  weight: WeightNode,
};

const edgeTypes: EdgeTypes = {
  visionToGoal: VisionToGoalEdge,  // Vision → Goal (thick blue line)
  goalToAction: GoalToActionEdge,  // Goal → Action (medium green line)
  actionToAction: ActionToActionEdge, // Base → Base (orange dotted dashed line)
};

const CenterPanel: React.FC = () => {
  // Get actual data and methods from store
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const setSelectedId = useFlowStore((s) => s.setSelectedId);

  const layersRef = useRef<HTMLDivElement>(null);

  // State to store container dimensions
  const [containerSize, setContainerSize] = React.useState({ width: 800, height: 600 });

  // Use useEffect to listen to container size changes
  useEffect(() => {
    if (!layersRef.current) return;

    const updateSize = () => {
      if (layersRef.current) {
        const rect = layersRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial update
    updateSize();

    // Use ResizeObserver to listen to size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(layersRef.current);

    // Cleanup function
    return () => {
      if (layersRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(layersRef.current);
      }
    };
  }, []);

  // Calculate layer boundaries based on flex ratio
  const layerBounds = React.useMemo(() => {
    const totalHeight = containerSize.height;
    // Flex ratio distribution: 1:2:3
    const layer1Height = totalHeight * (1 / 6);    // 1 part
    const layer2Height = totalHeight * (2 / 6);    // 2 parts

    return {
      layer1: {
        yStart: 0,
        yEnd: layer1Height,
        minY: 10,
        maxY: layer1Height - 50
      },
      layer2: {
        yStart: layer1Height,
        yEnd: layer1Height + layer2Height,
        minY: layer1Height + 10,
        maxY: layer1Height + layer2Height - 50
      },
      layer3: {
        yStart: layer1Height + layer2Height,
        yEnd: totalHeight,
        minY: layer1Height + layer2Height + 10,
        maxY: totalHeight - 50
      },
      width: containerSize.width,
      minX: 10,
      maxX: containerSize.width - 160, // Consider node width
    };
  }, [containerSize]);

  // Wrapper for node change handling
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Apply boundary constraints for node drag changes
      const filteredChanges = changes.map(change => {
        if (change.type === 'position' && change.dragging && change.position) {
          const node = nodes.find(n => n.id === change.id);
          if (node && node.data.layer) {
            const layer = node.data.layer;
            const bounds = layerBounds[layer as keyof typeof layerBounds] as {
              minY: number;
              maxY: number;
            };

            if (bounds) {
              const { position } = change;
              let { x, y } = position;

              // Node dimensions
              const NODE_WIDTH = 120;
              const NODE_HEIGHT = 10;
              const MARGIN = 5;

              // Constrain x coordinate (consider node width and margin)
              const minX = MARGIN;
              const maxX = layerBounds.width - NODE_WIDTH - MARGIN;
              x = Math.max(minX, Math.min(maxX, x));

              // Constrain y coordinate (consider node height and margin)
              const minY = bounds.minY + MARGIN;
              const maxY = bounds.maxY - NODE_HEIGHT - MARGIN;
              y = Math.max(minY, Math.min(maxY, y));

              return {
                ...change,
                position: { x, y }
              };
            }
          }
        }
        return change;
      });

      // Call store's onNodesChange
      onNodesChange(filteredChanges);
    },
    [nodes, onNodesChange, layerBounds]
  );

  const handlePaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!layersRef.current) return;

      // 1. Get coordinates relative to container
      const rect = layersRef.current.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // 2. Determine which layer
      let layer: 'layer1' | 'layer2' | 'layer3' | null = null;

      if (y >= layerBounds.layer1.yStart && y <= layerBounds.layer1.yEnd) {
        layer = 'layer1';
      } else if (y >= layerBounds.layer2.yStart && y <= layerBounds.layer2.yEnd) {
        layer = 'layer2';
      } else if (y >= layerBounds.layer3.yStart && y <= layerBounds.layer3.yEnd) {
        layer = 'layer3';
      }

      if (!layer) return;

      // 3. Adjust position (ensure within boundaries)
      const bounds = layerBounds[layer];

      if (bounds) {
              // Node dimensions
              const NODE_WIDTH =  160;
              const NODE_HEIGHT = 20;
              const MARGIN = 5;

              // Constrain x coordinate (consider node width and margin)
              const minX = MARGIN;
              const maxX = layerBounds.width - NODE_WIDTH - MARGIN;
              x = Math.max(minX, Math.min(maxX, x));

              // Constrain y coordinate (consider node height and margin)
              const minY = bounds.minY + MARGIN;
              const maxY = bounds.maxY - NODE_HEIGHT - MARGIN;
              y = Math.max(minY, Math.min(maxY, y));
      }
      const position = {
        x,
        y
      };

      // 4. Set title and type based on layer
      let title = '';
      let type: 'goal' | 'task' | 'constraint' | 'resource' = 'task'; // Default value

      switch (layer) {
        case 'layer1':
          title = 'New Core Node';
          type = 'goal';
          break;
        case 'layer2':
          title = 'New Goal Node';
          type = 'task';
          break;
        case 'layer3':
          title = 'New Base Node';
          type = 'constraint';
          break;
      }

      // 5. Create new node
      const newNode = {
        id: nanoid(),
        type: 'weight' as const,
        position,
        data: {
          title,
          layer,
          description: '',
          type,
          weight: 1
        },
      };

      // 5. Add node to store
      addNode(newNode);
    },
    [layerBounds, addNode]
  );

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    let edgeType = 'default';

    if (sourceNode && targetNode) {
      const sourceLayer = sourceNode.data.layer;
      const targetLayer = targetNode.data.layer;

     // 1. Prevent same-layer connections (except layer3)
      if (sourceLayer === targetLayer && sourceLayer !== 'layer3') {
        return;
      }

      // Core purpose → Main goal
      if (sourceLayer === 'layer1' && targetLayer === 'layer2') {
        edgeType = 'visionToGoal';
      }
      // Main goal → Base
      else if (sourceLayer === 'layer2' && targetLayer === 'layer3') {
        edgeType = 'goalToAction';
      }
      // Base → Base (same layer connection)
      else if (sourceLayer === 'layer3' && targetLayer === 'layer3') {
        edgeType = 'actionToAction';
      }
      else {
        return;
    }
    }

    // Create new edge
    const edge: Edge = {
      id: nanoid(),
      type: edgeType,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || null,
      targetHandle: connection.targetHandle || null,
      animated: false,
    };
    onConnect(edge);
  }, [nodes, onConnect]);

  return (
    <div className={`${styles.centerPanel} ${styles.panel}`}>
      <div className={styles.centerPanelContent}>
        <div ref={layersRef} className={styles.structureLayers}>
          {/* Three-layer structure */}
          <div data-layer="layer1" className={`${styles.layer} ${styles.layer1}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>Core Purpose</div>
            </div>
          </div>
          <div data-layer="layer2" className={`${styles.layer} ${styles.layer2}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>Major Goals</div>
            </div>
          </div>
          <div data-layer="layer3" className={`${styles.layer} ${styles.layer3}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>Foundations</div>
            </div>
          </div>

          {/* ReactFlow Container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'auto',
              overflow: 'hidden',
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              onEdgeClick={(_, node) => setSelectedId(node.id)}
              onPaneClick={() => setSelectedId(null)}
              onDoubleClick={handlePaneDoubleClick}
              // Critical: Completely disable viewport dragging, only allow node dragging
              panOnDrag={false}
              panOnScroll={false}

              // Disable zoom
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}

              // Fixed viewport range
              translateExtent={[
                [0, 0],
                [containerSize.width, containerSize.height]
              ]}
              minZoom={0.5}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}

              // Other configurations
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              proOptions={{ hideAttribution: true }}
              fitView={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterPanel;