import { motion } from 'motion/react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function CTAButton({ children, onClick, variant = 'primary' }: CTAButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        px-8 py-4 rounded-full shadow-lg transition-all
        ${isPrimary 
          ? 'bg-gradient-to-r from-[#e89ab3] to-[#d9c6f7] text-white' 
          : 'bg-white text-[#e89ab3] border-2 border-[#e89ab3]'
        }
      `}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(232, 154, 179, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        fontFamily: 'var(--font-serif)',
      }}
    >
      {children}
    </motion.button>
  );
}
