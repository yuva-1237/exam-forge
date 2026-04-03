import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 24); // 24 is half the width (w-12 = 48px)
      cursorY.set(e.clientY - 24);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide cursor on touch devices to prevent mobile clunkiness
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[10000] flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
        background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.05) 100%)',
        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.6), inset 2px 2px 5px rgba(255,255,255,0.9), inset -4px -4px 10px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
        WebkitBackdropFilter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <motion.div 
        className="absolute top-[15%] left-[15%] w-2 h-2 rounded-full bg-white blur-[1px]" 
        animate={{ opacity: isHovering ? 0 : 0.8 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
