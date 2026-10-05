"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function MotionDiv({ children, className, initial, animate, transition, whileInView, viewport }: {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  whileInView?: any;
  viewport?: any;
}) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      whileInView={whileInView}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function MotionArticle({ children, className, initial, animate, transition }: {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
}) {
  return (
    <motion.article className={className} initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.article>
  );
}
