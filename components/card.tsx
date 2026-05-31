import Link from "fumadocs-core/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export function Cards(
  props: HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", props.className)}
    >
      {props.children}
    </div>
  );
}

export type CardProps = HTMLAttributes<HTMLElement> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;

  href?: string;
  external?: boolean;
};

export function Card({
  icon,
  title,
  description,
  ...props
}: CardProps): React.ReactElement {
  const E = props.href ? Link : "div";

  return (
    <E
      {...props}
      data-card
      className={cn(
        "relative group border rounded-lg overflow-hidden bg-card hover:bg-accent transition-all duration-300 hover:border-border hover:border-blue-500",
        props.className
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-card" />
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-[#0066FF]/20 to-transparent" />
      </div>

      <div className="relative block p-5">
        {icon && (
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-7 h-7 rounded-full overflow-hidden">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-[15px] font-medium text-card-foreground/90">
          {title}
        </h3>
        {description && (
          <p className="text-[13.5px] leading-[1.4] text-card-foreground/60 mt-3">
            {description}
          </p>
        )}
        {props.children && (
          <div className="text-[13.5px] leading-[1.4] text-card-foreground/60">
            {props.children}
          </div>
        )}
      </div>
    </E>
  );
}
