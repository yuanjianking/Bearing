import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

export default function ActionToActionEdge(props: EdgeProps) {
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
        stroke: '#ff9f43', // 橙色
        strokeWidth: 1.5,
        strokeDasharray: '3,3', // 点虚线
      }}
    />
  );
}