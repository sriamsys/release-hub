export const TRANSITIONS = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4
  },
  easing: {
    standard: [0.4, 0, 0.2, 1],
    decelerate: [0, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],
    sharp: [0.4, 0, 0.6, 1]
  }
};

export const SPRINGS = {
  tight: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 1
  } as const,
  gentle: {
    type: 'spring',
    stiffness: 260,
    damping: 26,
    mass: 1
  } as const,
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
    mass: 1
  } as const
};

export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideInRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  },
  scaleUp: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  },
  drawerRight: {
    initial: { x: 350, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 350, opacity: 0 }
  }
};
