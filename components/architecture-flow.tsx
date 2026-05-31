"use client";

import {
  ArrowRight,
  Cpu,
  Database,
  Image as ImageIcon,
  Store,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: "client",
      label: "Customer Request",
      icon: User,
      description: "App requests signed URL",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: "cachemiss",
      label: "Load from CDN cache",
      icon: Store,
      description: "Load from cache whether hit or miss",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      id: "origin",
      label: "Fetch Source",
      icon: Database,
      description: "Downloads from Origin",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: "process",
      label: "Processing",
      icon: Cpu,
      description: "Resize, Crop, Optimize",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: ImageIcon,
      description: "Served & Cached",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
    },
  ];

  return (
    <div className="w-full my-12 p-6 rounded-2xl border border-fd-border bg-fd-card/50 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-fd-border -z-10 transform -translate-y-1/2" />

        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-col items-center text-center transition-all duration-500 ease-in-out z-10 w-full md:w-auto",
                isActive ? "scale-105 opacity-100" : "opacity-60 scale-95",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 mb-3 shadow-lg",
                  isActive
                    ? `${step.bgColor} ${step.borderColor} ${step.color} shadow-${step.color}/20`
                    : "bg-fd-card border-fd-border text-fd-muted-foreground shadow-none",
                )}
              >
                <Icon className={cn("w-7 h-7", isActive && "animate-pulse")} />
              </div>

              <div className="space-y-1 max-w-[120px]">
                <h3
                  className={cn(
                    "text-sm font-bold transition-colors duration-300",
                    isActive
                      ? "text-fd-foreground"
                      : "text-fd-muted-foreground",
                  )}
                >
                  {step.label}
                </h3>
                <p className="text-xs text-fd-muted-foreground leading-tight hidden md:block">
                  {step.description}
                </p>
              </div>

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <ArrowRight className="md:hidden absolute -bottom-6 text-fd-border w-4 h-4" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-fd-muted/50 border border-fd-border text-sm font-mono text-center text-fd-muted-foreground transition-all duration-300">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        Status:{" "}
        <span className="text-fd-foreground font-semibold">
          {steps[activeStep].description}
        </span>
      </div>
    </div>
  );
}
