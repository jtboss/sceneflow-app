"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import { Sparkles, Rocket, Zap } from "lucide-react";
import { SectionContainer, HeroTitle, HeroSubtitle } from "@/components/ui/section-container";
import { NotionLogo, MilanoteLogo } from "@/components/ui/logos";

interface ParticleProps {
  className?: string;
}

const Particle: React.FC<ParticleProps> = ({ className }) => {
  // Use a client-side only effect for animation to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the animation at all during SSR
  if (!mounted) {
    return <div className={`absolute rounded-full bg-primary/20 ${className}`} />;
  }
  
  return (
    <motion.div
      className={`absolute rounded-full bg-primary/20 ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0.5]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: Math.random() * 2, // This is okay now because it only runs client-side after hydration
      }}
    />
  );
};

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function CTA() {
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
    <SectionContainer 
      useHeroStyle={true}
      className="py-16 bg-background"
      id="join-waitlist"
    >
      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { width: 9, height: 8, top: 67, left: 90 },
          { width: 8, height: 4, top: 59, left: 2 },
          { width: 9, height: 2, top: 74, left: 98 },
          { width: 5, height: 3, top: 33, left: 78 },
          { width: 5, height: 3, top: 92, left: 78 },
          { width: 5, height: 8, top: 31, left: 47 },
          { width: 3, height: 6, top: 41, left: 54 },
          { width: 3, height: 4, top: 56, left: 4 },
          { width: 9, height: 4, top: 26, left: 48 },
          { width: 3, height: 2, top: 22, left: 28 },
        ].map((config, i) => (
          <Particle 
            key={i} 
            className={`w-${config.width} h-${config.height} top-[${config.top}%] left-[${config.left}%]`} 
          />
        ))}
        
        {/* Decorative circles */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-80 h-80 border border-primary/20 rounded-full opacity-30"
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 -bottom-20 w-80 h-80 border border-primary/20 rounded-full opacity-30"
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="clay" 
            className="relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="h-4 w-4 text-white" />
            </motion.div>
            <span>Limited Spots Available</span>
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6"
        >
          <HeroTitle className="mb-3">
            <span className="bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C] bg-clip-text text-transparent animate-gradient">
              Get Early Access
            </span>
            <motion.div 
              className="absolute -bottom-1 left-1/2 h-1 w-0 -translate-x-1/2 bg-gradient-to-r from-[#C86C5B] via-[#2A2E45] to-[#D2B48C]"
              initial={{ width: '0%' }}
              whileInView={{ width: '30%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </HeroTitle>
          <HeroSubtitle>
            Join our waitlist now to transform your content creation workflow with Notion and Milanote integration.
          </HeroSubtitle>
        </motion.div>
        
        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 flex items-center justify-center gap-4 mb-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1 backdrop-blur-sm">
            <NotionLogo className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium">Shotlists</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1 backdrop-blur-sm">
            <MilanoteLogo className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium">Moodboards</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto w-full mt-6"
        >
          <div className="relative">
            <motion.div
              initial={{ rotate: 45, x: -10, y: -10 }}
              animate={{ rotate: 0, x: -12, y: -12 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="absolute -left-3 -top-3"
            >
              <Zap className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.div
              initial={{ rotate: 315, x: 10, y: -10 }}
              animate={{ rotate: 360, x: 12, y: -12 }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute -right-3 -top-3"
            >
              <Zap className="h-8 w-8 text-primary" />
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="h-14 text-base bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-all duration-300" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  variant="clay"
                  disabled={isSubmitting}
                  className="h-14 px-8 text-base font-medium w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>{isSubmitting ? "Joining..." : "Join Waitlist"}</span>
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-muted-foreground mt-4 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4 mr-2 text-primary"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          We respect your privacy. No spam, ever.
        </motion.p>
      </div>
    </SectionContainer>
  );
} 