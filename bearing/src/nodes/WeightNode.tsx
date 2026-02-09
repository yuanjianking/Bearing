import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { NodeData } from '../types/flow';
import styles from './WeightNode.module.css';

export default function WeightNode({ data, selected }: NodeProps<NodeData>) {
  // 确保weight有默认值
  const weight = data.weight || 1;
  const safeWeight = Math.max(1, Math.min(10, weight)); // 确保在1-10范围内

  // 根据节点类型和权重确定样式
  const getNodeStyle = () => {
    // 基础样式 - 现在高度50px
    const baseStyle = {
      borderColor: selected ? '#1677ff' : '#999',
      width: '120px',
      height: '50px',
    };

    // 根据类型决定颜色
    switch (data.type) {
      case 'goal':
        return {
          ...baseStyle,
          borderLeftColor: '#ff6b6b',
          gradient: 'linear-gradient(135deg, #ffefef 0%, #ffffff 100%)',
          textColor: '#cc0000',
          bgColor: '#fff2f0',
        };
      case 'task':
        return {
          ...baseStyle,
          borderLeftColor: '#4dabf7',
          gradient: 'linear-gradient(135deg, #e7f5ff 0%, #ffffff 100%)',
          textColor: '#1971c2',
          bgColor: '#f0f9ff',
        };
      case 'constraint':
        return {
          ...baseStyle,
          borderLeftColor: '#40c057',
          gradient: 'linear-gradient(135deg, #ebfbee 0%, #ffffff 100%)',
          textColor: '#2b8a3e',
          bgColor: '#f6ffed',
        };
      case 'resource':
        return {
          ...baseStyle,
          borderLeftColor: '#f783ac',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffffff 100%)',
          textColor: '#c2255c',
          bgColor: '#fff0f6',
        };
      default:
        return {
          ...baseStyle,
          borderLeftColor: '#ced4da',
          gradient: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          textColor: '#495057',
          bgColor: '#f8f9fa',
        };
    }
  };

  const style = getNodeStyle();

  return (
    <div className={styles.weightNodeWrapper}>
      <div
        className={`${styles.weightNode} ${selected ? styles.selected : ''}`}
        style={{
          width: style.width,
          height: style.height,
          background: style.gradient,
          borderLeftColor: style.borderLeftColor,
          color: style.textColor,
          backgroundColor: style.bgColor,
        }}
        title={data.description}
      >
        {/* 节点头部 - 类型标签和权重 */}
        <div className={styles.nodeHeader}>
          <span className={styles.typeBadge}>
            {data.type === 'goal' ? '核心' :
             data.type === 'task' ? '目标' :
             data.type === 'constraint' ? '约束' : '资源'}
          </span>
          <span className={styles.weightBadge}>
            {safeWeight}
          </span>
        </div>

        {/* 标题区域 */}
        <div className={styles.titleContainer}>
          <span className={styles.title}>
            {data.title}
          </span>
        </div>

        {/* 权重指示条 */}
        <div className={styles.weightBarContainer}>
          <div
            className={styles.weightBar}
            style={{
              width: `${safeWeight * 10}%`,
              backgroundColor: style.borderLeftColor
            }}
          />
        </div>

        {/* 连接点 */}
        <Handle
          type="target"
          position={Position.Top}
          className={styles.handle}
          style={{
            backgroundColor: style.borderLeftColor,
            width: '8px',
            height: '8px',
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className={styles.handle}
          style={{
            backgroundColor: style.borderLeftColor,
            width: '8px',
            height: '8px',
          }}
        />
      </div>

      {/* 选中时的描述工具提示 */}
      {selected && data.description && data.description !== '（无描述）' && (
        <div className={styles.descriptionTooltip}>
          {data.description}
        </div>
      )}
    </div>
  );
}