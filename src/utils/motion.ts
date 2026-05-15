/**
 * Reusable motion configurations for ReleaseHub
 */

export const transitions = {
  default: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },
  smooth: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1]
  }
};

export const pageVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};
