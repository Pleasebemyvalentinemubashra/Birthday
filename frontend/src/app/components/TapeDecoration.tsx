interface TapeDecorationProps {
  className?: string;
  rotation?: number;
}

export function TapeDecoration({ className = '', rotation = -15 }: TapeDecorationProps) {
  return (
    <div
      className={`absolute w-16 h-6 bg-white/40 border border-white/60 shadow-sm ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        backdropFilter: 'blur(2px)',
      }}
    />
  );
}
