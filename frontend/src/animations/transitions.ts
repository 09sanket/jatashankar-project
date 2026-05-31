import { Variants } from "framer-motion";

// Global spring transition presets
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const SMOOTH_EASE = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1.0],
  duration: 0.4,
} as const;

// Animation Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: SMOOTH_EASE
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: SMOOTH_EASE
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: SMOOTH_EASE
  }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING_TRANSITION
  }
};

// Container stagger variants for list layouts
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
});

// Card hover animation presets
export const cardHover = {
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};
