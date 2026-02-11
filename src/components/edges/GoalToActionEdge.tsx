import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

export default function GoalToActionEdge(props: EdgeProps) {
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
        stroke: '#3db393',
        strokeWidth: 2,
        strokeDasharray: 'none',
      }}
    />
  );
}