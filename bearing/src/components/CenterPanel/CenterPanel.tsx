import React, { useRef, useEffect, useCallback } from 'react';
import ReactFlow, {
  type NodeChange,
} from 'reactflow';
import type { NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './CenterPanel.module.css';
import WeightNode from '../../nodes/WeightNode';
import { useFlowStore } from '../../stores/useFlowStore';

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

              // 限制x坐标
              x = Math.max(layerBounds.minX, Math.min(layerBounds.maxX, x));

              // 限制y坐标在所属层内
              y = Math.max(bounds.minY, Math.min(bounds.maxY, y));

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