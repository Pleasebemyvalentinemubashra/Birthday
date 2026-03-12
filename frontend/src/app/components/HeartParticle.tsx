import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface HeartParticleProps {
  delay?: number;
  duration?: number;
  left?: string;
}

export function HeartParticle({ delay = 0, duration = 8, left = '50%' }: HeartParticleProps) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{ left }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: '100vh',
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <motion.div
        animate={{
          x: [0, 20, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Heart className="w-4 h-4 fill-[#f7c6d9] text-[#e89ab3] opacity-60" />
      </motion.div>
    </motion.div>
  );
}
