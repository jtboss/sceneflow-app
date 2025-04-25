"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseenter", onMouseEnter);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const handleLinkHoverEvents = () => {
      document.querySelectorAll("a, button, input, textarea, select, [role='button']").forEach(el => {
        el.addEventListener("mouseenter", () => setLinkHovered(true));
        el.addEventListener("mouseleave", () => setLinkHovered(false));
      });
    };

    addEventListeners();
    handleLinkHoverEvents();

    return () => {
      removeEventListeners();
    };
  }, []);

  // Detect touch device
  useEffect(() => {
    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    
    if (isTouchDevice()) {
      setHidden(true);
    }
  }, []);

  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      opacity: hidden ? 0 : 1,
      height: 32,
      width: 32,
      backgroundColor: "rgba(13, 13, 13, 0.1)",
      mixBlendMode: "difference" as const,
      border: "2px solid rgba(255, 255, 255, 0.4)",
      transition: {
        type: "spring",
        mass: 0.6
      }
    },
    hover: {
      x: position.x - 20,
      y: position.y - 20,
      height: 40,
      width: 40,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference" as const,
      border: "2px solid rgba(255, 255, 255, 0.8)",
    },
    click: {
      x: position.x - 16,
      y: position.y - 16,
      height: 24,
      width: 24,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      mixBlendMode: "difference" as const,
      border: "2px solid rgba(255, 255, 255, 1)",
    }
  };

  const cursorDotVariants = {
    default: {
      x: position.x - 4,
      y: position.y - 4,
      opacity: hidden ? 0 : 1,
      height: 8,
      width: 8,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      mixBlendMode: "difference" as const,
    },
    hover: {
      x: position.x - 6,
      y: position.y - 6,
      height: 12,
      width: 12,
      backgroundColor: "rgba(255, 255, 255, 1)",
      mixBlendMode: "difference" as const,
    },
    click: {
      x: position.x - 3,
      y: position.y - 3,
      height: 6,
      width: 6,
      backgroundColor: "rgba(255, 255, 255, 1)",
      mixBlendMode: "difference" as const,
    }
  };

  return (
    <>
      <motion.div
        className="cursor-outer fixed top-0 left-0 z-50 pointer-events-none rounded-full"
        variants={cursorVariants}
        animate={clicked ? "click" : linkHovered ? "hover" : "default"}
      />
      <motion.div
        className="cursor-dot fixed top-0 left-0 z-50 pointer-events-none rounded-full"
        variants={cursorDotVariants}
        animate={clicked ? "click" : linkHovered ? "hover" : "default"}
      />
    </>
  );
} 