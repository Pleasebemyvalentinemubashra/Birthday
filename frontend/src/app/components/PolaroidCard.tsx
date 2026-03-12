import { motion } from 'motion/react';
import { TapeDecoration } from './TapeDecoration';

interface PolaroidCardProps {
  image: string;
  caption?: string;
  rotation?: number;
  delay?: number;
}

export function PolaroidCard({ image, caption, rotation = 0, delay = 0 }: PolaroidCardProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -12, 
        rotate: 0,
        transition: { duration: 0.3 }
      }}
      style={{ rotate: rotation }}
    >
      <div className="bg-white p-3 pb-12 shadow-xl relative">
        <TapeDecoration className="-top-2 left-1/2 -translate-x-1/2" rotation={-5} />
        
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={caption || 'Memory'}
            className="w-full h-full object-cover"
          />
        </div>
        
        {caption && (
          <p 
            className="absolute bottom-4 left-0 right-0 text-center text-sm px-4"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            {caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
