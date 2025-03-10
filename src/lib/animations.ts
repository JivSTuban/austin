
import { useState, useEffect } from 'react';
import React from 'react';

// Custom hook for fade-in animation on element mount
export function useFadeIn(delay = 0, duration = 300) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
  };
}

// Custom hook for staggered animations of multiple elements
export function useStaggeredFadeIn(itemCount: number, baseDelay = 100, staggerDelay = 50) {
  const getStyle = (index: number) => {
    return {
      opacity: 0,
      transform: 'translateY(20px)',
      animation: `fade-in 300ms ease forwards ${baseDelay + index * staggerDelay}ms`,
    };
  };

  return { getStyle };
}

// Page transition animation wrapper
export function pageTransition(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
      return () => setIsVisible(false);
    }, []);

    // Instead of using JSX directly, use React.createElement
    return React.createElement(
      'div',
      {
        style: {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 350ms ease, transform 350ms ease',
        },
      },
      React.createElement(Component, props)
    );
  };
}

// Image lazy loading with blur-up effect
export function useImageLoad() {
  const [loaded, setLoaded] = useState(false);

  const onLoad = () => {
    setLoaded(true);
  };

  return {
    imageStyle: {
      opacity: loaded ? 1 : 0,
      filter: loaded ? 'blur(0)' : 'blur(10px)',
      transition: 'opacity 500ms ease, filter 500ms ease',
    },
    onLoad,
    loaded,
  };
}
