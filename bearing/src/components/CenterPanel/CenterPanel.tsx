import React, { useRef, useEffect, useCallback } from 'react';
import ReactFlow, {
  type NodeChange,
} from 'reactflow';
import type { NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './CenterPanel.module.css';
import WeightNode from '../../nodes/WeightNode';
import { useFlowStore } from '../../stores/useFlowStore';
import { nanoid } from 'nanoid';

const nodeTypes: NodeTypes = {
  weight: WeightNode,
};

const CenterPanelInner: React.FC = () => {
  // 从 store 中获取真实数据和方法
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const setSelectedId = useFlowStore((s) => s.setSelectedId)

  const layersRef = useRef<HTMLDivElement>(null);

  // 添加状态存储容器尺寸
  const [containerSize, setContainerSize] = React.useState({ width: 800, height: 600 });

  // 使用 useEffect 监听容器尺寸变化
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

    // 初始更新
    updateSize();

    // 使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(layersRef.current);

    // 清理函数
    return () => {
      if (layersRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(layersRef.current);
      }
    };
  }, []);

  // 计算每层的边界 - 基于flex比例
  const layerBounds = React.useMemo(() => {
    const totalHeight = containerSize.height;
    // 按照flex比例分配：1:2:3
    const layer1Height = totalHeight * (1 / 6);    // 1份
    const layer2Height = totalHeight * (2 / 6);    // 2份

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
      maxX: containerSize.width - 160, // 考虑节点宽度
    };
  }, [containerSize]);

  // 创建包装的节点变化处理函数
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // 如果有节点拖拽变化，先应用边界限制
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

              // 节点实际尺寸
              const NODE_WIDTH = 120;
              const NODE_HEIGHT = 10;
              const MARGIN = 5; // 边距

              // 限制x坐标（考虑节点宽度和边距）
              const minX = MARGIN;
              const maxX = layerBounds.width - NODE_WIDTH - MARGIN;
              x = Math.max(minX, Math.min(maxX, x));

              // 限制y坐标（考虑节点高度和边距）
              const minY = bounds.minY + MARGIN; // 增加边距
              const maxY = bounds.maxY - NODE_HEIGHT - MARGIN; // 考虑节点高度
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

      // 调用 store 中的 onNodesChange
      onNodesChange(filteredChanges);
    },
    [nodes, onNodesChange, layerBounds]
  );

  const handlePaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!layersRef.current) return;

      // 1. 获取相对于容器的坐标
      const rect = layersRef.current.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // 2. 判断属于哪一层
      let layer: 'layer1' | 'layer2' | 'layer3' | null = null;

      if (y >= layerBounds.layer1.yStart && y <= layerBounds.layer1.yEnd) {
        layer = 'layer1';
      } else if (y >= layerBounds.layer2.yStart && y <= layerBounds.layer2.yEnd) {
        layer = 'layer2';
      } else if (y >= layerBounds.layer3.yStart && y <= layerBounds.layer3.yEnd) {
        layer = 'layer3';
      }

      if (!layer) return;

      // 3. 位置修正（确保不越界）
      const bounds = layerBounds[layer];

      if (bounds) {
              // 节点实际尺寸
              const NODE_WIDTH = 120;
              const NODE_HEIGHT = 20;
              const MARGIN = 5; // 边距

              // 限制x坐标（考虑节点宽度和边距）
              const minX = MARGIN;
              const maxX = layerBounds.width - NODE_WIDTH - MARGIN;
              x = Math.max(minX, Math.min(maxX, x));

              // 限制y坐标（考虑节点高度和边距）
              const minY = bounds.minY + MARGIN; // 增加边距
              const maxY = bounds.maxY - NODE_HEIGHT - MARGIN; // 考虑节点高度
              y = Math.max(minY, Math.min(maxY, y));
      }
      const position = {
        x,
        y
      };

      // 4. 根据 layer 设置 title 和 type
      let title = '';
      let type: 'goal' | 'task' | 'constraint' | 'resource' = 'task'; // 默认值

      switch (layer) {
        case 'layer1':
          title = '新的核心节点';
          type = 'goal';
          break;
        case 'layer2':
          title = '新的目标节点';
          type = 'task';
          break;
        case 'layer3':
          title = '新的基础节点';
          type = 'constraint';
          break;
      }

      // 5. 创建新节点
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

      // 5. 添加节点到 store
      addNode(newNode);
    },
    [layerBounds, addNode]
  );

  return (
    <div className={`${styles.centerPanel} ${styles.panel}`}>
      <div className={styles.centerPanelContent}>
        <div ref={layersRef} className={styles.structureLayers}>
          {/* 三层结构 */}
          <div data-layer="layer1" className={`${styles.layer} ${styles.layer1}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>核心目的</div>
            </div>
          </div>
          <div data-layer="layer2" className={`${styles.layer} ${styles.layer2}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>主要目标</div>
            </div>
          </div>
          <div data-layer="layer3" className={`${styles.layer} ${styles.layer3}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>基础</div>
            </div>
          </div>

          {/* ReactFlow容器 */}
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
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              onEdgeClick={() => setSelectedId(null)}
              onDoubleClick={handlePaneDoubleClick}
              // 关键：完全禁用视窗拖拽，只允许节点拖拽
              panOnDrag={false}
              panOnScroll={false}

              // 禁止缩放
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}

              // 固定视窗范围
              translateExtent={[
                [0, 0],
                [containerSize.width, containerSize.height]
              ]}
              minZoom={0.5}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}

              // 其他配置
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

export default CenterPanelInner;