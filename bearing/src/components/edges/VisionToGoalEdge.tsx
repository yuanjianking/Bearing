import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

export default function VisionToGoalEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={props.markerEnd}
      style={{
        stroke: '#667eea', // 蓝色
        strokeWidth: 3,
        strokeDasharray: 'none',
      }}
    />
  );
}