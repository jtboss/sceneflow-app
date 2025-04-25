"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 py-4 transition-all duration-200 ${
        scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="relative mr-2 w-8 h-8">
                  {/* Simple, iconic camera aperture logo */}
                  <svg 
                    viewBox="0 0 48 48" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Outer circle */}
                    <circle cx="24" cy="24" r="22" className="fill-[#2A2E45]" />
                    
                    {/* Middle circle */}
                    <circle cx="24" cy="24" r="16" className="fill-[#C86C5B]" />
                    
                    {/* Aperture shape */}
                    <path d="M24 8 L27 15 L34 18 L27 21 L24 28 L21 21 L14 18 L21 15 Z" 
                      className="fill-[#F5EBDD]" 
                    />
                    
                    {/* Inner circles */}
                    <circle cx="24" cy="24" r="8" className="fill-[#2A2E45]" />
                    <circle cx="24" cy="24" r="4" className="fill-[#D2B48C]" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]">
                  SceneFlow
                </span>
              </div>
            </motion.div>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <nav className="relative flex items-center gap-4">
              <Link 
                href="#visual-teaser"
                className="text-sm font-medium text-zinc-900 dark:text-white hover:text-primary transition-colors px-3 py-1"
              >
                How It Works
              </Link>
              <Link href="#join-waitlist">
                <Button 
                  size="sm" 
                  className="relative px-4 py-2 overflow-hidden"
                >
                  <span>Join Waitlist</span>
                  <span className="absolute inset-0 -z-10 animate-pulse rounded-md bg-primary/20 blur-sm"></span>
                </Button>
              </Link>
            </nav>
          </motion.div>
        </div>
      </div>
    </header>
  );
} 