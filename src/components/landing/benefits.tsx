"use client";

import React from "react";
import { useId } from "react";
import { Camera, Lightbulb, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SectionContainer, HeroTitle, HeroSubtitle } from "@/components/ui/section-container";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Benefit: React.FC<BenefitProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative bg-warm p-6 rounded-3xl overflow-hidden"
    >
      <Grid size={20} />
      <div className="flex items-center gap-3 mb-3 relative z-20">
        <div className="p-2 bg-accent/10 rounded-full text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground mt-2 text-base font-normal relative z-20">
        {description}
      </p>
    </motion.div>
  );
};

export function Benefits() {
  return (
    <SectionContainer useHeroStyle={true} className="py-20 lg:py-32 bg-background">
      <div className="relative">
        {/* Decorative corner elements */}
        <motion.div
          initial={{ rotate: 0, x: -10, y: -10 }}
          animate={{ rotate: 45, x: -12, y: -12 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -left-3 -top-3"
        >
          <Zap className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          initial={{ rotate: 135, x: 10, y: -10 }}
          animate={{ rotate: 90, x: 12, y: -12 }}
          transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -right-3 -top-3"
        >
          <Zap className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          initial={{ rotate: -45, x: -10, y: 10 }}
          animate={{ rotate: -90, x: -12, y: 12 }}
          transition={{ duration: 1, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -left-3 -bottom-3"
        >
          <Zap className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          initial={{ rotate: 225, x: 10, y: 10 }}
          animate={{ rotate: 270, x: 12, y: 12 }}
          transition={{ duration: 1, delay: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -right-3 -bottom-3"
        >
          <Zap className="h-10 w-10 text-primary" />
        </motion.div>
        
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              variant="tan" 
              className="relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Lightbulb className="h-4 w-4 text-primary" />
              </motion.div>
              <span>For Creators</span>
            </Badge>
          </motion.div>
          
          <HeroTitle className="mt-4 mb-3">
            <span className="bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C] bg-clip-text text-transparent animate-gradient">
              Why Creators Love SceneFlow
            </span>
            <motion.div 
              className="absolute -bottom-1 left-1/2 h-1 w-0 -translate-x-1/2 bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]"
              initial={{ width: '0%' }}
              whileInView={{ width: '40%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </HeroTitle>
          
          <HeroSubtitle>
            Join thousands of creators who are elevating their content with SceneFlow's powerful tools
          </HeroSubtitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          <Benefit
            icon={<Camera className="w-5 h-5" />}
            title="Look Professional"
            description="Plan cinematic shots like a pro director with our intuitive storyboarding tools. Elevate your content quality instantly."
          />
          <Benefit
            icon={<Clock className="w-5 h-5" />}
            title="Save Hours"
            description="What used to take days now takes minutes. Our quick planning tools streamline your pre-production workflow."
          />
          <Benefit
            icon={<Lightbulb className="w-5 h-5" />}
            title="Get Inspired"
            description="Never run out of ideas with our AI-generated shot suggestions and creative prompts tailored to your content."
          />
        </div>

        <div className="mt-12 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="ink" className="font-medium relative overflow-hidden">
              <span>Join the Waitlist</span>
              <span className="absolute inset-0 -z-10 animate-pulse rounded-md bg-primary/20 blur-sm"></span>
            </Button>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
}

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
} 