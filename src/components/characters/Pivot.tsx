/**
 * Rotate/translate SVG children around a fixed joint (x, y) with a slow,
 * natural CSS transition — shoulders, necks and elbows of the characters.
 */
export default function Pivot({
  x,
  y,
  rotate = 0,
  tx = 0,
  ty = 0,
  dur = 2.2,
  className,
  children,
}: {
  x: number;
  y: number;
  rotate?: number;
  tx?: number;
  ty?: number;
  dur?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className={className}
        style={{
          transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
          transition: `transform ${dur}s cubic-bezier(0.45, 0.05, 0.2, 1)`,
          transformBox: "view-box",
          transformOrigin: "0 0",
        }}
      >
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </g>
    </g>
  );
}
