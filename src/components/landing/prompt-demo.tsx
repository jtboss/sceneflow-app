"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, Film, Loader2, MoveRight, Camera, Palette, Lightbulb, ArrowRight } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { NotionLogo, MilanoteLogo } from "@/components/ui/logos";
import Image from "next/image";

// Mouse position hook
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

// Highlighter components
interface HighlightGroupProps {
  children: React.ReactNode;
  className?: string;
  refresh?: boolean;
}

const HighlightGroup: React.FC<HighlightGroupProps> = ({
  children,
  className = "",
  refresh = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [boxes, setBoxes] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      setBoxes(
        Array.from(containerRef.current.querySelectorAll('div'))
          .filter(el => el.className.includes('overflow-hidden'))
          .map(el => el as HTMLElement)
      );
    }
  }, []);

  useEffect(() => {
    initContainer();
    window.addEventListener("resize", initContainer);

    return () => {
      window.removeEventListener("resize", initContainer);
    };
  }, []);

  useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition]);

  useEffect(() => {
    initContainer();
  }, [refresh]);

  const initContainer = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = containerSize.current;
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
        boxes.forEach((box) => {
          const boxX =
            -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
          const boxY =
            -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
          box.style.setProperty("--mouse-x", `${boxX}px`);
          box.style.setProperty("--mouse-y", `${boxY}px`);
        });
      }
    }
  };

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
};

interface HighlighterItemProps {
  children: React.ReactNode;
  className?: string;
}

const HighlighterItem: React.FC<HighlighterItemProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden p-px before:pointer-events-none before:absolute before:-left-48 before:-top-48 before:z-30 before:h-96 before:w-96 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-primary before:opacity-0 before:blur-[100px] before:transition-opacity before:duration-300 after:absolute after:inset-0 after:z-10 after:rounded-3xl after:opacity-0 after:transition-opacity after:duration-300 before:hover:opacity-30 after:group-hover:opacity-100 dark:before:bg-indigo-400/70 ${className}`}
    >
      {children}
    </div>
  );
};

// Particles component
interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition.x, mousePosition.y, mounted]);

  useEffect(() => {
    if (!mounted) return;
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, mounted]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + 1;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.3 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;
      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams();
        drawCircle(newCircle);
        // update the circle position
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha,
          },
          true,
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      {mounted && <canvas ref={canvasRef} />}
    </div>
  );
};

// TransitionPanel component
interface TransitionPanelProps {
  children: React.ReactNode[];
  className?: string;
  transition?: any;
  activeIndex: number;
  variants?: { enter: any; center: any; exit: any };
  custom?: any;
}

function TransitionPanel({
  children,
  className,
  transition,
  variants,
  activeIndex,
  custom,
  ...motionProps
}: TransitionPanelProps) {
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence initial={false} mode="popLayout" custom={custom}>
        <motion.div
          key={activeIndex}
          variants={variants}
          transition={transition}
          initial="enter"
          animate="center"
          exit="exit"
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Main component
interface SceneFlowDemoProps {
  className?: string;
}

export function PromptDemo({ className }: SceneFlowDemoProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [scope, animate] = useAnimate();
  const [inputValue] = useState("A morning routine vlog with coffee by the window");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const mousePosition = useMousePosition();
  const hasGenerated = useRef(false);

  // Animate results when generated
  useEffect(() => {
    if (showResults && scope.current) {
      const shotlistElement = scope.current.querySelector("#shotlist");
      const moodboardElement = scope.current.querySelector("#moodboard");
      
      if (shotlistElement && moodboardElement) {
        animate(
          [
            ["#shotlist", { opacity: 0, y: 20 }, { duration: 0 }],
            ["#moodboard", { opacity: 0, y: 20 }, { duration: 0 }],
            ["#shotlist", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.2 }],
            ["#moodboard", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.5 }],
          ],
          { ease: "easeOut" }
        );
      }
    }
  }, [showResults, animate]);

  const handleGenerateClick = () => {
    if (isGenerating) return;
    
    if (hasGenerated.current) {
      resetDemo();
      return;
    }
    
    setIsGenerating(true);
    setShowResults(false);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      hasGenerated.current = true;
    }, 2500);
  };

  const resetDemo = () => {
    setShowResults(false);
    setIsGenerating(false);
    hasGenerated.current = false;
  };

  return (
    <SectionContainer
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-24",
        className
      )}
      id="visual-teaser"
    >
      {/* Magic UI background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-400/5 blur-3xl" />
      </div>
      
      {/* Animated particles in background */}
      <div className="absolute inset-0 -z-10">
        <Particles
          className="h-full w-full"
          quantity={100}
          color="#6366f1" 
          staticity={40}
          ease={50}
          vy={-0.2}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Custom cursor */}
          <motion.div 
            className="fixed top-0 left-0 w-8 h-8 rounded-full bg-[#C86C5B]/30 pointer-events-none mix-blend-screen z-50 hidden md:block"
            style={{ 
              x: mousePosition.x - 16, 
              y: mousePosition.y - 16,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-3"
            >
              <div className="bg-[#2A2E45]/10 text-[#2A2E45] px-4 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
                <Film className="h-4 w-4" />
                <span>Visual Planning Tool</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              One Prompt → Complete Vision
            </motion.h2>
            
            <motion.p 
              className="mx-auto max-w-2xl text-muted-foreground text-lg"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transform written ideas into shotlists and visual moodboards in seconds
            </motion.p>
          </div>

          <HighlightGroup className="group h-full">
            <HighlighterItem className="rounded-3xl p-6">
              <Card className="relative z-20 overflow-hidden rounded-3xl border border-[#C86C5B]/20 shadow-xl backdrop-blur-sm">
                {/* Cinematic gradient background with film-inspired elements */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1A1A1A]/90 via-[#2A2E45]/95 to-[#1A1A1A]/90">
                  {/* Film grain texture */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-40 mix-blend-soft-light"></div>
                  
                  {/* Cinematic horizontal light streaks */}
                  <div className="absolute -top-48 -left-24 right-0 h-96 w-[200%] rotate-12 bg-gradient-to-r from-[#C86C5B]/0 via-[#C86C5B]/5 to-[#C86C5B]/0 mix-blend-plus-lighter"></div>
                  <div className="absolute -bottom-48 -right-24 left-0 h-96 w-[200%] -rotate-12 bg-gradient-to-r from-[#D2B48C]/0 via-[#D2B48C]/5 to-[#D2B48C]/0 mix-blend-plus-lighter"></div>
                  
                  {/* Subtle lens flare effect */}
                  <div className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-[#2A2E45]/10 blur-xl"></div>
                  <div className="absolute top-1/3 left-1/3 h-16 w-16 rounded-full bg-[#C86C5B]/10 blur-xl"></div>
                </div>
                
                <div className="flex flex-col p-6 relative z-10">
                  {/* Input area */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Lightbulb className="h-5 w-5 text-[#D2B48C]" />
                        Your Creative Prompt
                      </h3>
                    </div>
                    
                    <div className="relative">
                      <div className="h-auto w-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm text-white">
                        <div className="flex items-center mb-3">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#C86C5B]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#D2B48C]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#2A2E45]"></div>
                          </div>
                          <div className="ml-4 text-xs text-white/50 font-mono">prompt.md</div>
                        </div>
                        
                        <div className="font-medium text-lg">
                          <span className="text-[#D2B48C]">"</span>
                          <motion.span 
                            className="text-white/90"
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{
                              backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 25%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0.9) 100%)",
                              backgroundSize: "200% auto",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              display: "inline-block"
                            }}
                          >
                            {inputValue}
                          </motion.span>
                          <span className="text-[#D2B48C]">"</span>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <div className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/70 flex items-center">
                            <Camera className="h-3 w-3 mr-1" />
                            <span>Camera: 50mm lens</span>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/70 flex items-center">
                            <Palette className="h-3 w-3 mr-1" />
                            <span>Style: warm, cinematic</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm text-white/80">
                          <NotionLogo className="h-4 w-4 text-white" />
                          <span className="font-medium">Notion</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm text-white/80">
                          <MilanoteLogo className="h-4 w-4 text-white" />
                          <span className="font-medium">Milanote</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="clay"
                        size="lg"
                        onClick={handleGenerateClick}
                        disabled={isGenerating}
                        className="relative h-14 px-8 overflow-visible group"
                      >
                        {/* Magic UI ambient light effect behind button */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#C86C5B] rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:blur-xl"></div>
                        
                        {/* Film grain texture overlay */}
                        <div className="absolute inset-0 bg-black opacity-[0.03] mix-blend-multiply pointer-events-none"></div>
                        
                        {/* Button background with slight gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2E45] via-[#2A2E45]/90 to-[#2A2E45] rounded-md shadow-xl"></div>
                        
                        {/* Subtle highlight edge */}
                        <div className="absolute inset-px rounded-md overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2E45]/90 to-[#2A2E45]"></div>
                          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                        </div>
                        
                        {/* Magic UI shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/20 to-indigo-500/0 bg-size-200 animate-shimmer-slow rounded-md"></div>
                        </div>
                        
                        {/* Button content with icon and text */}
                        <div className="relative flex items-center justify-center gap-2 text-white font-medium text-base px-6 py-3 z-10">
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              <span>Building Visual Plan</span>
                            </>
                          ) : (
                            <>
                              <span>{hasGenerated.current ? "Reset Demo" : "See The Results"}</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Results area */}
                  <AnimatePresence mode="wait">
                    {showResults && (
                      <motion.div 
                        className="space-y-8 border-t border-white/10 pt-6" 
                        ref={scope}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div id="shotlist" className="opacity-0">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                              <Camera className="h-5 w-5 text-[#D2B48C]" />
                              Shotlist in Notion
                            </h3>
                            <div className="flex items-center space-x-2 text-white/70">
                              <NotionLogo className="h-5 w-5 text-white/90" />
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <ul className="space-y-3">
                              {[
                                "Overhead shot of person waking up, soft morning light filtering through curtains",
                                "Close-up of coffee brewing, steam rising with shallow depth of field",
                                "Medium shot by window, person sipping coffee with sunlight creating rim lighting",
                                "Close-up of coffee cup being placed on windowsill, rack focus to outside view",
                                "Wide establishing shot of entire morning routine setting with natural framing"
                              ].map((shot, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + 0.2 }}
                                  className="flex items-start gap-3"
                                >
                                  <span className="flex-shrink-0 mt-1 rounded-full bg-[#C86C5B]/15 px-2 py-0.5 text-xs font-medium text-[#C86C5B]">
                                    Shot {index + 1}
                                  </span>
                                  <span className="text-sm text-white/80">{shot}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                          
                        <div id="moodboard" className="opacity-0">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                              <Palette className="h-5 w-5 text-[#D2B48C]" />
                              Moodboard in Milanote
                            </h3>
                            <div className="flex items-center space-x-2 text-white/70">
                              <MilanoteLogo className="h-5 w-5 text-white/90" />
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                src: "/images/moodboard/morning-selfie.jpg",
                                alt: "Morning selfie with camera",
                                label: "Self portrait",
                                fallbackColor: "bg-gradient-to-br from-amber-800/90 to-amber-600/90"
                              },
                              {
                                src: "/images/moodboard/window-silhouette.jpg",
                                alt: "Silhouette by window with coffee",
                                label: "Morning light",
                                fallbackColor: "bg-gradient-to-br from-blue-900/90 to-blue-700/90"
                              },
                              {
                                src: "/images/moodboard/washing-hands.jpg",
                                alt: "Washing hands in sink",
                                label: "Morning routine",
                                fallbackColor: "bg-gradient-to-br from-amber-700/90 to-orange-500/90"
                              },
                              {
                                src: "/images/moodboard/coffee-closeup.jpg",
                                alt: "Close-up of coffee cup by window",
                                label: "Morning coffee",
                                fallbackColor: "bg-gradient-to-br from-green-800/90 to-green-600/90"
                              }
                            ].map((image, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className={cn(
                                  "aspect-square rounded-lg shadow-md overflow-hidden relative group"
                                )}
                              >
                                <div className="absolute inset-0 bg-black/20 z-10"></div>
                                
                                {/* Image with fallback */}
                                <div className={cn("relative w-full h-full", image.fallbackColor)}>
                                  <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority={index < 2}
                                    onError={(e) => {
                                      // Hide the image element when it fails to load
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                
                                {/* Film grain overlay */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjE1Ii8+PC9zdmc+')] opacity-30 mix-blend-soft-light z-20"></div>
                                
                                {/* Cinematic vignette effect */}
                                <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-black/0 via-transparent to-black/60 z-30"></div>
                                
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-40" />
                                <div className="absolute bottom-0 left-0 right-0 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/40 text-white backdrop-blur-sm z-50">
                                  {image.label}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </HighlighterItem>
          </HighlightGroup>
          
          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              SceneFlow integrates directly with your favorite tools, making content planning seamless
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
} 