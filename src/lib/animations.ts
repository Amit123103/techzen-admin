import { Variants } from "framer-motion";

// ========================================
// Framer Motion Animation Presets
// ========================================

const customEase: [number, number, number, number] = [0.25, 1, 0.5, 1]; // Premium cubic bezier

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: customEase },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: customEase },
  },
};

// ========================================
// Micro-interactions
// ========================================

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: customEase } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: customEase } 
  }
};

export const buttonHover = {
  hover: { scale: 1.02, transition: { duration: 0.2, ease: customEase } },
  tap: { scale: 0.98, transition: { duration: 0.1, ease: customEase } }
};

export const linkHover = {
  initial: { width: "0%" },
  hover: { width: "100%", transition: { duration: 0.3, ease: customEase } }
};

export const successCheck: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: customEase }
  }
};
