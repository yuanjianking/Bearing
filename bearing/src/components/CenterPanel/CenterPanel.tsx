import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  useEdgesState,
  applyNodeChanges,
  // Background,
  type NodeChange,
  // Panel,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './CenterPanel.module.css';

const initialNodes: Node[] = [
  {
    id: 'n1',
    data: { label: '核心节点', layer: 'layer1' },
    position: { x: 120, y: 40 },
    draggable: true,
  },
  {
    id: 'n2',
    data: { label: '目标节点', layer: 'layer2' },
    position: { x: 140, y: 220 },
    draggable: true,
  },
  {
    id: 'n3',
    data: { label: '基础节点1', layer: 'layer3' },
    position: { x: 160, y: 400 },
    draggable: true,
  },
  {
    id: 'n4',
    data: { label: '基础节点2', layer: 'layer3' },
    position: { x: 300, y: 380 },
    draggable: true,
  },
];

const initialEdges: Edge[] = [];

const CenterPanelInner: React.FC = () => {
  const layersRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // 添加状态存储容器尺寸
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

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
        resizeObserver.unobserve(layersRef.current);
      }
    };
  }, []);

  // 计算每层的边界 - 基于flex比例
  const layerBounds = useMemo(() => {
    const totalHeight = containerSize.height;
    // 按照flex比例分配：1:2:3
    const layer1Height = totalHeight * (1 / 6);    // 1份
    const layer2Height = totalHeight * (2 / 6);    // 2份
    // const layer3Height = totalHeight * (3 / 6);    // 3份

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

  // 节点变化处理，确保节点在所属层内
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

        return updatedNodes.map((node) => {
          const layer = node.data.layer;
          const bounds = layerBounds[layer as keyof typeof layerBounds] as {
            yStart: number;
            yEnd: number;
            minY: number;
            maxY: number;
          };


          if (!bounds || !node.draggable) return node;

          let { x, y } = node.position;

          // 限制x坐标
          x = Math.max(layerBounds.minX, Math.min(layerBounds.maxX, x));

          // 限制y坐标在所属层内
          y = Math.max(bounds.minY, Math.min(bounds.maxY, y));

          // 只有当位置发生变化时才更新
          if (x !== node.position.x || y !== node.position.y) {
            return {
              ...node,
              position: { x, y },
            };
          }

          return node;
        });
      });
    },
    [layerBounds]
  );

  // // 自定义节点样式
  // const nodeTypes = useMemo(() => ({
  //   default: ({ data }: { data: any }) => (
  //     <div style={{
  //       padding: '10px',
  //       backgroundColor: '#fff',
  //       border: '1px solid #3a5ca9',
  //       borderRadius: '5px',
  //       fontSize: '12px',
  //       minWidth: '100px',
  //       textAlign: 'center',
  //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  //       cursor: 'move',
  //     }}>
  //       {data.label}
  //     </div>
  //   ),
  // }), []);

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
              // nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}

              // 关键：完全禁用视窗拖拽，只允许节点拖拽
              panOnDrag={false}          // 禁用视窗拖拽
              panOnScroll={false}        // 禁用滚轮平移

              // 允许缩放
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}

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
            >
              {/* <Background /> */}

              {/* 可选：添加控制面板 */}
              {/* <Panel position="top-right">
                <div style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}>
                  节点数量: {nodes.length}
                </div>
              </Panel> */}
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterPanelInner;