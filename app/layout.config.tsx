import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import LogoSvg from "@/public/images/logo.svg";
/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Image src={LogoSvg} alt="MediaForge Logo" width={24} height={24} />
        <span>MediaForge</span>
      </div>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
  ],
};
