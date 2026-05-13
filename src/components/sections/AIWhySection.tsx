"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { Zap, Shield, Cpu, Globe, Rocket, Heart } from "lucide-react";
import { motion } from "framer-motion";

const REASONS = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Instant Intelligence",
    desc: "Powered by Groq's high-speed inference engine, get answers and content in milliseconds, not minutes.",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    desc: "Your data is used only for your sessions. We never train our models on your private learning history.",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Accelerated Learning",
    desc: "Students using our AI features report a 40% increase in concept retention and faster course completion.",
    color: "bg-violet-500/10 text-violet-500"
  }
];

export function AIWhySection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <SectionHeader
              centered={false}
              label="The SkillBridge Advantage"
              title={<>Why we built the <span className="gradient-text">AI Lab</span></>}
              subtitle="Education is changing. Our goal is to augment the human experience, not replace it. Our AI tools act as personal tutors available 24/7."
            />
            
            <div className="space-y-8 mt-10">
              {REASONS.map((reason, i) => (
                <motion.div 
                  key={reason.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-5"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-2xl ${reason.color} flex items-center justify-center`}>
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-1">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            {/* Visual representation of AI speed/power */}
            <div className="relative rounded-[32px] border border-border bg-background p-8 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-widest">System Load: 2%</div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Model Inference Speed</span>
                  <span className="text-sm font-bold text-emerald-500">Fastest</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "95%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="glass-card p-4 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Latency</span>
                    <span className="text-2xl font-display font-bold text-foreground">~250ms</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Tokens/sec</span>
                    <span className="text-2xl font-display font-bold text-foreground">140+</span>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Live Performance Metrics</span>
                  </div>
                  <div className="flex gap-1 h-20 items-end">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75, 60, 80].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-emerald-500/20 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-card p-4 shadow-xl border-emerald-500/30 z-20"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold">Global Inference</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
