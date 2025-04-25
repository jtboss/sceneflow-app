"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  useHeroStyle?: boolean;
  children: React.ReactNode;
  includeGlow?: boolean;
  delay?: number;
  useAnimations?: boolean;
}

export function SectionContainer({
  className,
  useHeroStyle = false,
  children,
  includeGlow = true,
  delay = 0,
  useAnimations = true,
  ...props
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-24",
        className
      )}
      {...props}
    >
      {/* Background glow if enabled */}
      {includeGlow && (
        <div className="hero-background-glow">
          <div className="absolute top-0 left-1/2 z-0 h-72 w-72 -translate-x-1/2 transform rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-32 right-12 z-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute top-24 left-12 z-0 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
      )}

      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {useAnimations ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: delay, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className={cn(
              useHeroStyle ? "hero-style p-6 md:p-10" : "",
            )}
          >
            {children}
          </motion.div>
        ) : (
          <div className={cn(useHeroStyle ? "hero-style p-6 md:p-10" : "")}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function HeroTitle({ 
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn("hero-title", className)} 
      {...props}
    >
      {children}
    </h2>
  );
}

export function HeroSubtitle({ 
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn("hero-subtitle", className)} 
      {...props}
    >
      {children}
    </p>
  );
} 