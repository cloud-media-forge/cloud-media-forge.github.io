import { Card } from "@/components/ui/card";
import Image from "next/image";

interface LinkCardProps {
  title: string;
  description: string;
  icon?: string;
  href?: string;
}

export function LinkCard({ title, description, icon, href }: LinkCardProps) {
  return (
    <Card className="relative group overflow-hidden bg-card hover:bg-accent transition-all duration-300 hover:border-border hover:border-blue-500">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-card" />
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-[#0066FF]/20 to-transparent" />
      </div>

      <a href={href} className="relative block p-5 no-underline">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden">
              <Image
                src={icon}
                alt={`${title} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h3 className="text-[15px] font-medium text-card-foreground/90">
            {title}
          </h3>
        </div>
        <p className="text-[13.5px] leading-[1.4] text-card-foreground/60">
          {description}
        </p>
      </a>
    </Card>
  );
}

export function LinkCards({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
