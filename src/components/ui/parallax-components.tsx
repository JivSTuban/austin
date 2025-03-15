import React from 'react';
import { motion, useInView } from 'framer-motion';

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className, speed = 0.5 }) => {
  return (
    <div className={`${className || ''} overflow-hidden`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          scale: 1.2,
        }}
        whileInView={{
          y: [0, -30 * speed],
          transition: {
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
      />
    </div>
  );
};

type FadeInWhenVisibleProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeInWhenVisible: React.FC<FadeInWhenVisibleProps> = ({ children, className, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};
