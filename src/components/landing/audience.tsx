"use client";

import React from "react";
import { motion, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { Camera, Film, Video, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AudienceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const AudienceCard = ({ title, description, icon, className }: AudienceCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden p-6 border border-primary/10 bg-gradient-to-b from-background/90 to-muted/90 dark:from-background dark:to-muted dark:border-primary/10",
      "transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent/30",
      className
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="mb-4 p-3 bg-accent/10 rounded-full w-fit">{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const context = React.useRef<CanvasRenderingContext2D | null>(null);
  const circles = React.useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = React.useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  React.useEffect(() => {
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
  }, []);

  React.useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition.x, mousePosition.y]);

  React.useEffect(() => {
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

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
      <canvas ref={canvasRef} />
    </div>
  );
};

export function Audience() {
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#youtuber", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#youtuber", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#tiktoker", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#tiktoker", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#filmmaker", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#filmmaker", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#creator", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#creator", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
  }, [animate]);

  return (
    <section className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              variant="ink" 
              className="relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Users className="h-4 w-4 text-white" />
              </motion.div>
              <span>Target Audience</span>
            </Badge>
          </motion.div>
          <motion.h2 
            className="relative select-none px-3 py-2 text-center text-3xl font-bold leading-tight tracking-tight md:text-4xl mt-4 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C] bg-clip-text text-transparent animate-gradient">
              Who SceneFlow Is For
            </span>
            <motion.div 
              className="absolute -bottom-1 left-1/2 h-1 w-0 -translate-x-1/2 bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]"
              initial={{ width: '0%' }}
              whileInView={{ width: '40%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Designed for creators who want to elevate their visual storytelling
          </motion.p>
        </div>

        <div className="relative border border-primary/20 rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm">
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

          <div className="relative z-20 p-8">
            <Particles
              className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out hover:opacity-40"
              quantity={200}
              color="#555555"
              vy={-0.2}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <AudienceCard 
                  title="YouTubers"
                  description="Create professional cinematic videos that keep viewers engaged and coming back for more."
                  icon={<Video className="h-6 w-6 text-accent" />}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AudienceCard 
                  title="TikTokers"
                  description="Plan engaging short-form content that stands out with professional shot planning."
                  icon={<Camera className="h-6 w-6 text-accent" />}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <AudienceCard 
                  title="Filmmakers"
                  description="Streamline pre-production with automated shotlists and moodboards for efficient filming."
                  icon={<Film className="h-6 w-6 text-accent" />}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AudienceCard 
                  title="Content Creators"
                  description="Elevate your visual storytelling across platforms with professional shot planning."
                  icon={<Users className="h-6 w-6 text-accent" />}
                />
              </motion.div>
            </div>
            
            <div className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px] mt-6" ref={scope}>
              <div
                id="youtuber"
                className="absolute right-12 top-10 rounded-3xl border border-primary/30 bg-primary/5 px-2 py-1.5 text-xs opacity-50"
              >
                YouTubers
              </div>
              <div
                id="tiktoker"
                className="absolute left-2 top-20 rounded-3xl border border-primary/30 bg-primary/5 px-2 py-1.5 text-xs opacity-50"
              >
                TikTokers
              </div>
              <div
                id="filmmaker"
                className="absolute bottom-20 right-1 rounded-3xl border border-primary/30 bg-primary/5 px-2 py-1.5 text-xs opacity-50"
              >
                Filmmakers
              </div>
              <div
                id="creator"
                className="absolute bottom-12 left-14 rounded-3xl border border-primary/30 bg-primary/5 px-2 py-1.5 text-xs opacity-50"
              >
                Content Creators
              </div>

              <div id="pointer" className="absolute">
                <svg
                  width="16.8"
                  height="18.2"
                  viewBox="0 0 12 13"
                  className="fill-primary"
                  stroke="white"
                  strokeWidth="1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                  />
                </svg>
                <span className="bg-primary relative -top-1 left-3 rounded-3xl px-2 py-1 text-xs text-white">
                  SceneFlow
                </span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-lg text-muted-foreground">
                Join 1,000+ creators already transforming their visual content
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 