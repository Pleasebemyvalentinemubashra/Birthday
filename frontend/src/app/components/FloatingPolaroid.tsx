import { motion } from 'motion/react';
import { TapeDecoration } from './TapeDecoration';

interface FloatingPolaroidProps {
  image: string;
  rotation?: number;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: number;
}

export function FloatingPolaroid({ image, rotation = 0, position, delay = 0 }: FloatingPolaroidProps) {
  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ ...position }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: rotation,
        y: [0, -15, 0],
      }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div className="bg-white p-2 pb-8 shadow-2xl w-48 relative">
        <TapeDecoration className="-top-2 left-1/2 -translate-x-1/2" rotation={-8} />
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt="Floating memory"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
