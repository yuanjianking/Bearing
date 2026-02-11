import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { NodeData } from '../../types/flow';
import styles from './WeightNode.module.css';

export default function WeightNode({ data, selected }: NodeProps<NodeData>) {
  // Ensure weight has default value
  const weight = data.weight || 1;
  const safeWeight = Math.max(1, Math.min(10, weight)); // Ensure within 1-10 range

  // Determine style based on node type and weight
  const getNodeStyle = () => {
    // Base style - now 50px height
    const baseStyle = {
      borderColor: selected ? '#1677ff' : '#999',
      width: '160px',
      height: '50px',
    };

    // Determine color based on type
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
        {/* Node Header - Type label and weight */}
        <div className={styles.nodeHeader}>
          <span className={styles.typeBadge}>
            {data.type === 'goal' ? 'Core' :
             data.type === 'task' ? 'Goal' :
             data.type === 'constraint' ? 'Constraint' : 'Resource'}
          </span>
          <span className={styles.weightBadge}>
            {safeWeight}
          </span>
        </div>

        {/* Title Area */}
        <div className={styles.titleContainer}>
          <span className={styles.title}>
            {data.title}
          </span>
        </div>

        {/* Weight Indicator Bar */}
        <div className={styles.weightBarContainer}>
          <div
            className={styles.weightBar}
            style={{
              width: `${safeWeight * 10}%`,
              backgroundColor: style.borderLeftColor
            }}
          />
        </div>

        {/* Handles */}
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

      {/* Description tooltip when selected */}
      {selected && data.description && data.description !== '(No description)' && (
        <div className={styles.descriptionTooltip}>
          {data.description}
        </div>
      )}
    </div>
  );
}