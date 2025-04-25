"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const socials = [
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
  },
];

export function Footer() {
  return (
    <footer className="relative mt-8 bg-background/80 border-t border-primary/10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container px-4 py-8 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="inline-block">
              <div className="flex items-center">
                <div className="relative mr-2 w-6 h-6">
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
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]">
                  SceneFlow
                </span>
              </div>
            </Link>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex gap-3"
            >
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2 rounded-full hover:bg-primary/5 transition-colors duration-300"
                >
                  <social.icon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs text-muted-foreground"
            >
              © {getCurrentYear()} SceneFlow
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
} 