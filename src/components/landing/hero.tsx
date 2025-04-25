"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NotionLogo, MilanoteLogo } from "@/components/ui/logos";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
  icon?: React.ReactNode;
}

interface HeroProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    action?: {
      text: string;
      href: string;
    };
  };
  actions?: HeroAction[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
  className?: string;
}

// Canvas animation related types
interface CanvasNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface CanvasLine {
  spring: number;
  friction: number;
  nodes: CanvasNode[];
  init: (e: any) => void;
  update: () => void;
  draw: () => void;
}

interface WaveGenerator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  init: (e: any) => void;
  update: () => number;
  value: () => number;
}

const HeroComponent = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      title,
      subtitle,
      badge,
      actions,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      ...props
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    
    React.useEffect(() => {
      setIsMounted(true);
      
      // Initialize canvas with automatic animation
      const initializeCanvas = () => {
        renderCanvas();
        
        // Trigger auto movement immediately
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if (canvas) {
          const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
          });
          document.dispatchEvent(event);
        }
      };
      
      // Short delay to ensure DOM is ready
      setTimeout(initializeCanvas, 100);
      
      // Add cursor styling for better visual indication
      const canvas = document.getElementById("canvas");
      if (canvas) {
        document.body.style.cursor = "none";
        
        // Create custom cursor element
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        cursor.style.position = "fixed";
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        cursor.style.borderRadius = "50%";
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
        cursor.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.5)";
        cursor.style.transform = "translate(-50%, -50%)";
        cursor.style.pointerEvents = "none";
        cursor.style.zIndex = "9999";
        cursor.style.transition = "transform 0.1s ease";
        document.body.appendChild(cursor);
        
        // Create film style frame markers around cursor for cinematic feel
        const createFrameMarker = () => {
          const marker = document.createElement("div");
          marker.className = "frame-marker";
          marker.style.position = "fixed";
          marker.style.border = "1px solid rgba(255, 255, 255, 0.6)";
          marker.style.width = "40px";
          marker.style.height = "40px";
          marker.style.pointerEvents = "none";
          marker.style.zIndex = "9998";
          marker.style.transform = "translate(-50%, -50%)";
          marker.style.mixBlendMode = "difference";
          return marker;
        };
        
        // Create 4 corner frame markers
        const topLeft = createFrameMarker();
        topLeft.style.borderRight = "none";
        topLeft.style.borderBottom = "none";
        
        const topRight = createFrameMarker();
        topRight.style.borderLeft = "none";
        topRight.style.borderBottom = "none";
        
        const bottomLeft = createFrameMarker();
        bottomLeft.style.borderRight = "none";
        bottomLeft.style.borderTop = "none";
        
        const bottomRight = createFrameMarker();
        bottomRight.style.borderLeft = "none";
        bottomRight.style.borderTop = "none";
        
        document.body.appendChild(topLeft);
        document.body.appendChild(topRight);
        document.body.appendChild(bottomLeft);
        document.body.appendChild(bottomRight);
        
        // Update cursor and frame position
        const updateCursor = (e: MouseEvent) => {
          const x = e.clientX;
          const y = e.clientY;
          
          cursor.style.left = `${x}px`;
          cursor.style.top = `${y}px`;
          cursor.style.transform = "translate(-50%, -50%) scale(1)";
          
          // Position frame corners around the cursor
          topLeft.style.left = `${x - 15}px`;
          topLeft.style.top = `${y - 15}px`;
          
          topRight.style.left = `${x + 15}px`;
          topRight.style.top = `${y - 15}px`;
          
          bottomLeft.style.left = `${x - 15}px`;
          bottomLeft.style.top = `${y + 15}px`;
          
          bottomRight.style.left = `${x + 15}px`;
          bottomRight.style.top = `${y + 15}px`;
        };
        
        document.addEventListener("mousemove", updateCursor);
        document.addEventListener("mousedown", () => {
          cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
          // Animate the frame to look like a camera focus
          [topLeft, topRight, bottomLeft, bottomRight].forEach(marker => {
            marker.style.width = "36px";
            marker.style.height = "36px";
            marker.style.border = "2px solid rgba(255, 255, 255, 0.8)";
          });
        });
        document.addEventListener("mouseup", () => {
          cursor.style.transform = "translate(-50%, -50%) scale(1)";
          // Return to normal frame
          [topLeft, topRight, bottomLeft, bottomRight].forEach(marker => {
            marker.style.width = "40px";
            marker.style.height = "40px";
            marker.style.border = "1px solid rgba(255, 255, 255, 0.6)";
          });
        });
        
        return () => {
          document.body.style.cursor = "auto";
          document.removeEventListener("mousemove", updateCursor);
          document.removeEventListener("mousedown", () => {});
          document.removeEventListener("mouseup", () => {});
          // Clean up all created elements
          [cursor, topLeft, topRight, bottomLeft, bottomRight].forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        };
      }
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
      },
    });
  
    const onSubmit = async (data: FormValues) => {
      setIsSubmitting(true);
      try {
        console.log('Submitting waitlist form with email:', data.email);
        
        // Get the base URL dynamically to work in all environments
        const baseUrl = window.location.origin;
        
        // Call our API endpoint to process the waitlist submission
        const response = await fetch(`${baseUrl}/api/waitlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email }),
        });
        
        console.log('API response status:', response.status);
        const result = await response.json();
        console.log('API response data:', result);
        
        if (response.ok && result.success) {
          toast.success("Thanks for joining our waitlist! We'll be in touch soon.");
          form.reset();
        } else {
          console.error('API error:', result);
          toast.error(result.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 min-h-[85vh] w-full overflow-hidden bg-background hero-background-animation",
          className
        )}
        {...props}
      >
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 z-0 h-96 w-96 -translate-x-1/2 transform rounded-full bg-[#C86C5B]/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-12 z-0 h-80 w-80 rounded-full bg-[#2A2E45]/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-24 left-12 z-0 h-72 w-72 rounded-full bg-[#D2B48C]/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-64 left-32 z-0 h-64 w-64 rounded-full bg-[#F3F0EC]/40 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Main content */}
        <div className="animation-delay-8 animate-fadeIn relative z-10 flex flex-col items-center justify-center px-4 pt-16 text-center md:pt-24">
          {/* Badge with enhanced animation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="z-10 mb-4 mt-8 sm:justify-center md:mb-6"
          >
            <Badge
              variant="warm"
              className="relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.1)]"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Integrates with Notion & Milanote</span>
            </Badge>
          </motion.div>

          {/* Title container with enhanced animated border */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 mt-2 md:mt-4"
          >
            <div className="px-2">
              <div className="relative mx-auto h-full max-w-4xl overflow-hidden rounded-xl border border-primary/30 bg-background/50 p-6 backdrop-blur-sm md:px-10 md:py-12 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
                {/* Enhanced corner decorations with animation */}
                <motion.div
                  animate={{ 
                    rotate: [45, 90, 45],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -left-3 -top-3"
                >
                  <Zap className="h-10 w-10 text-primary drop-shadow-md" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: [-45, -90, -45],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-3 -left-3"
                >
                  <Zap className="h-10 w-10 text-primary drop-shadow-md" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: [135, 180, 135],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute -right-3 -top-3"
                >
                  <Zap className="h-10 w-10 text-primary drop-shadow-md" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: [225, 270, 225],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                  }}
                  className="absolute -bottom-3 -right-3"
                >
                  <Zap className="h-10 w-10 text-primary drop-shadow-md" />
                </motion.div>

                {/* Animated title with text glow effect and gradient */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="select-none bg-clip-text px-3 py-2 text-center text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl text-glow"
                >
                  <span className="bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C] bg-clip-text text-transparent animate-gradient">
                    AI-Powered Scene Planning for Cinematic Content
                  </span>
                </motion.h1>

                {/* Live indicator with enhanced animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-4 flex items-center justify-center gap-2"
                >
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-sm font-medium text-green-500">Join the exclusive waitlist now</p>
                </motion.div>
              </div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto mt-6 max-w-2xl px-6 text-lg text-muted-foreground sm:px-6 md:max-w-3xl md:px-8"
            >
              Transform your written ideas into complete shotlists in Notion and visual moodboards in Milanote
            </motion.p>

            {/* Integration logos */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mx-auto mt-4 flex items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1 backdrop-blur-sm">
                <NotionLogo className="h-5 w-5 text-foreground" />
                <span className="text-xs font-medium">Notion</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1 backdrop-blur-sm">
                <MilanoteLogo className="h-5 w-5 text-foreground" />
                <span className="text-xs font-medium">Milanote</span>
              </div>
            </motion.div>

            {/* Enhanced email signup form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 max-w-md mx-auto relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-10 h-20 w-20 rounded-full bg-blue-500/10 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-purple-500/10 blur-xl"></div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 relative z-10">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            className="h-14 backdrop-blur-sm bg-background/50 border-primary/20 hover:border-primary/50 transition-colors shadow-sm text-base" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-6 left-0 text-sm" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    variant="clay"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto relative overflow-hidden h-14 px-6 hover:shadow-primary/20 hover:shadow-xl"
                  >
                    <span className="relative z-10 flex items-center gap-2">{isSubmitting ? "Joining..." : "Join Waitlist"} {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}</span>
                    <span className="absolute inset-0 -z-10 animate-pulse rounded-md bg-primary/20 blur-md"></span>
                  </Button>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        </div>

        {/* Interactive canvas background - only render on client */}
        {isMounted && (
          <canvas
            className="pointer-events-none absolute inset-0 z-0 mx-auto"
            id="canvas"
          ></canvas>
        )}
      </section>
    );
  }
);

HeroComponent.displayName = "Hero";

// Canvas animation implementation
function renderCanvas() {
  let e = 0;
  let pos: { x: number; y: number } = { x: 0, y: 0 };
  let lines: any[] = [];
  let ctx: any;
  let f: any;
  let isAutoMoving = true; // Start with auto movement
  let autoMoveTimer: any = null;
  let autoMoveAngle = 0;
  let autoMoveRadius = 100;
  
  // Particles for additional visual effect
  let particles: {x: number, y: number, size: number, color: string, speed: number}[] = [];

  const E = {
    debug: false,
    friction: 0.35,      // Reduced even more for longer trails
    trails: 35,          // Increased for more dramatic effect
    size: 80,            // Larger size for more dramatic trails
    dampening: 0.008,    // Less dampening for more fluid movement
    tension: 0.95,       // Adjusted tension for more spiraling
  };

  // Create initial particles
  function createParticles(count: number) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        color: `hsla(${Math.random() * 360}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`,
        speed: Math.random() * 0.5 + 0.2
      });
    }
  }

  // Update and draw particles
  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speed;
      
      // Reset particles that go off screen
      if (p.y < 0) {
        p.y = window.innerHeight;
        p.x = Math.random() * window.innerWidth;
      }
      
      // Draw particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class WaveGen {
    phase: number;
    offset: number;
    frequency: number;
    amplitude: number;

    constructor(opts: { phase?: number; offset?: number; frequency?: number; amplitude?: number }) {
      this.phase = opts.phase || 0;
      this.offset = opts.offset || 0;
      this.frequency = opts.frequency || 0.001;
      this.amplitude = opts.amplitude || 1;
    }

    update() {
      this.phase += this.frequency;
      return (e = this.offset + Math.sin(this.phase) * this.amplitude);
    }

    value() {
      return e;
    }
  }

  class Node {
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
  }

  class Line {
    spring: number;
    friction: number;
    nodes: Node[];

    constructor(opts: { spring: number }) {
      this.spring = opts.spring + 0.1 * Math.random() - 0.05;
      this.friction = E.friction + 0.01 * Math.random() - 0.005;
      this.nodes = [];
      
      for (let i = 0; i < E.size; i++) {
        const node = new Node();
        node.x = pos.x;
        node.y = pos.y;
        this.nodes.push(node);
      }
    }

    update() {
      let spring = this.spring;
      let node = this.nodes[0];
      
      node.vx += (pos.x - node.x) * spring;
      node.vy += (pos.y - node.y) * spring;
      
      for (let i = 0, n = this.nodes.length; i < n; i++) {
        node = this.nodes[i];
        
        if (i > 0) {
          const prev = this.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * E.dampening;
          node.vy += prev.vy * E.dampening;
        }
        
        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        
        spring *= E.tension;
      }
    }

    draw() {
      let x = this.nodes[0].x, 
          y = this.nodes[0].y,
          a, b;
          
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      for (let i = 1, n = this.nodes.length - 2; i < n; i++) {
        a = this.nodes[i];
        b = this.nodes[i + 1];
        x = (a.x + b.x) * 0.5;
        y = (a.y + b.y) * 0.5;
        
        ctx.quadraticCurveTo(a.x, a.y, x, y);
      }
      
      a = this.nodes[this.nodes.length - 2];
      b = this.nodes[this.nodes.length - 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function startAutoMovement() {
    isAutoMoving = true;
    clearInterval(autoMoveTimer);
    
    // Create a more dynamic circular movement for the cursor when idle
    autoMoveTimer = setInterval(() => {
      if (isAutoMoving) {
        // More dynamic motion pattern with multiple frequencies
        autoMoveAngle += 0.03;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Create Lissajous patterns for more interesting motion
        const t = autoMoveAngle;
        const a = 2, b = 3; // Lissajous parameters
        
        pos.x = centerX + Math.sin(a * t) * autoMoveRadius * 1.2;
        pos.y = centerY + Math.sin(b * t + Math.PI/2) * autoMoveRadius * 0.8;
        
        // Occasionally change parameters for varied movement
        if (Math.random() < 0.005) {
          autoMoveRadius = 80 + Math.random() * 180;
        }
      }
    }, 20); // Faster interval for smoother animation
  }

  function onMousemove(e: any) {
    function initLines() {
      lines = [];
      for (let i = 0; i < E.trails; i++)
        lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
    }

    function updatePosition(e: any) {
      isAutoMoving = false; // Stop auto movement when user moves mouse
      clearTimeout(autoMoveTimer);
      
      if (e.touches) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      } else {
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      e.preventDefault();
      
      // Start auto movement after 3 seconds of inactivity
      clearTimeout(autoMoveTimer);
      autoMoveTimer = setTimeout(() => {
        startAutoMovement();
      }, 3000);
    }

    function handleTouchStart(e: any) {
      if (e.touches.length === 1) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      }
    }

    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("touchstart", onMousemove);
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("touchmove", updatePosition);
    document.addEventListener("touchstart", handleTouchStart);
    updatePosition(e);
    initLines();
    render();
  }

  function render() {
    if (ctx.running) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Draw particles first
      updateParticles();
      
      ctx.globalCompositeOperation = "lighter";
      
      // Super vibrant color effect
      const hue = Math.round(f.update());
      
      // Draw spiral with more vibrant, eye-catching colors
      
      // First layer - bold main spiral
      ctx.strokeStyle = `hsla(${hue},100%,60%,0.25)`;
      ctx.lineWidth = 8;
      
      for (let i = 0; i < E.trails; i++) {
        const line = lines[i];
        line.update();
        line.draw();
      }
      
      // Second layer - outer glow
      ctx.strokeStyle = `hsla(${(hue + 60) % 360},100%,75%,0.15)`;
      ctx.lineWidth = 20;
      
      for (let i = 0; i < E.trails; i += 2) {
        if (i < lines.length) {
          const line = lines[i];
          line.draw();
        }
      }
      
      // Third layer - bright highlight
      ctx.strokeStyle = `hsla(${(hue + 180) % 360},100%,80%,0.18)`;
      ctx.lineWidth = 3;
      
      for (let i = 1; i < E.trails; i += 2) {
        if (i < lines.length) {
          const line = lines[i];
          line.draw();
        }
      }
      
      // Fourth layer - thin ultra bright accents
      ctx.strokeStyle = `hsla(${(hue + 240) % 360},100%,90%,0.2)`;
      ctx.lineWidth = 1;
      
      for (let i = 3; i < E.trails; i += 3) {
        if (i < lines.length) {
          const line = lines[i];
          line.draw();
        }
      }
      
      ctx.frame++;
      window.requestAnimationFrame(render);
    }
  }

  function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) return;
  
  ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  ctx.running = true;
  ctx.frame = 1;
  
  // Create initial particles
  createParticles(50);
  
  f = new WaveGen({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 180,       // Increased for more dramatic color shifts
    frequency: 0.003,     // Faster color cycling
    offset: 160,          // Adjusted for more vibrant base colors
  });
  
  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("touchstart", onMousemove);
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  
  // Initialize auto movement
  startAutoMovement();
  
  // Make sure auto movement restarts when tab gets focus
  window.addEventListener("focus", () => {
    if (!ctx.running) {
      ctx.running = true;
      render();
    }
    startAutoMovement();
  });
  
  window.addEventListener("blur", () => {
    ctx.running = true;
  });
  
  resizeCanvas();
}

// Export the hero component
export function Hero() {
  return (
    <HeroComponent
      title="Turn Your Scene Ideas into Cinematic Shotlists"
      subtitle="AI-powered tool that helps creators plan shots and build moodboards in seconds."
    />
  );
} 