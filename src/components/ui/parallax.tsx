import React, { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type ScrollProps = {
  backgroundY: any;
  backgroundScale: any;
  watermarkY: any;
  watermarkOpacity: any;
}

type ParallaxContainerProps = {
  children: (props: ScrollProps) => ReactNode;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children }) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);
  const backgroundScale = useTransform(scrollY, [0, 1000], [1.1, 1.3]);
  const watermarkY = useTransform(scrollY, [0, 1000], [-100, 50]);
  const watermarkOpacity = useTransform(scrollY, [0, 300], [0.2, 0]);

  return <>{children({ backgroundY, backgroundScale, watermarkY, watermarkOpacity })}</>;
};

export const useForegroundParallax = () => {
  const { scrollY } = useScroll();
  return {
    y: useTransform(scrollY, [0, 500], [0, 100]),
    scale: useTransform(scrollY, [0, 500], [1, 0.8]),
    opacity: useTransform(scrollY, [0, 300], [1, 0])
  };
};

export { ParallaxImage, FadeInWhenVisible } from './parallax-components';
