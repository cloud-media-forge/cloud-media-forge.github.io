import Link from "next/link";
import {ArrowRight, Github} from "lucide-react";
import Image from "next/image";
import Book from "@/public/images/icons/book.svg";
import BracketsAngle from "@/public/images/icons/bracketsAngle.svg";
import SquaresFour from "@/public/images/icons/squaresFour.svg";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 pt-[120px] md:pt-[268px] pb-12 md:pb-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 flex items-center justify-center gap-2 md:gap-4 text-4xl md:text-[50px] font-semibold tracking-[-1px] md:tracking-[-2.4px] leading-[110%] font-['Inter']">
            <span className="text-foreground">High-Performance Multi-Media Forge Engine in REST API</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-muted-foreground pt-4 md:pt-[42px]">
            A easy to deploy, high-performance, costing saving multi-media processing engine built on GraphicsMagick/FFmpeg.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-fd-primary/25"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/cloud-media-forge/imgFlux"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-fd-card border border-fd-border text-fd-foreground hover:bg-fd-accent/50 transition-all"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 pb-16 flex-grow">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Getting Started */}
          <div className="h-[251px] p-6 bg-card rounded-xl border border-border flex-col justify-start items-start gap-4 inline-flex hover:border-blue-500">
            <div className="w-8 h-8 relative">
              <Image src={Book} alt="Welcome to MediaForge" />
            </div>
            <div className="self-stretch text-foreground text-2xl font-semibold font-['Inter'] leading-[28.80px]">
              ImgFlux
            </div>
            <div className="self-stretch text-muted-foreground text-base font-medium font-['Inter'] leading-relaxed">
              Remove background, Resize, Compress, Extend, Trim, Convert images with simple URLs.
            </div>
            <div className="home-card-button justify-start items-center inline-flex">
              <Link href="/docs/imgFlux">
                <div className="h-[42px] rounded-[10px] justify-center items-center flex group">
                  <div className="grow shrink basis-0 h-[42px] px-4 py-2 rounded-[10px] border border-border dark:border-white justify-center items-center gap-2 flex hover:bg-accent">
                    <div className="text-center text-foreground text-base font-medium font-['Inter'] leading-relaxed">
                      Get Started
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
              <Link
                href="https://github.com/cloud-media-forge/imgFlux"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-card border border-fd-border text-fd-foreground hover:bg-fd-accent/45 transition-all"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </Link>
            </div>
          </div>

          {/* Developer Guide */}
          <div className="h-[251px] p-6 bg-card rounded-xl border border-border flex-col justify-start items-start gap-4 inline-flex hover:border-blue-500">
            <div className="w-8 h-8 relative">
              <Image src={BracketsAngle} alt="Developer Guide" />
            </div>
            <div className="self-stretch text-foreground text-2xl font-semibold font-['Inter'] leading-[28.80px]">
              videoFlux
            </div>
            <div className="self-stretch text-muted-foreground text-base font-medium font-['Inter'] leading-relaxed">
              Compress, Convert video formats and upload to cloud storage and CDN.
            </div>
            <div className="home-card-button justify-start items-center inline-flex">
              <Link href="/docs/videoFlux">
                <div className="h-[42px] rounded-[10px] justify-center items-center flex group">
                  <div className="grow shrink basis-0 h-[42px] px-4 py-2 rounded-[10px] border border-border dark:border-white justify-center items-center gap-2 flex hover:bg-accent">
                    <div className="text-center text-foreground text-base font-medium font-['Inter'] leading-relaxed">
                      Get Started
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
              <Link
                href="https://github.com/cloud-media-forge/videoFlux"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-card border border-fd-border text-fd-foreground hover:bg-fd-accent/45 transition-all"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </Link>
            </div>
          </div>

          {/* Protocol Specs */}
          <div className="h-[251px] p-6 bg-card rounded-xl border border-border flex-col justify-start items-start gap-4 inline-flex hover:border-blue-500">
            <div className="w-8 h-8 relative">
              <Image src={SquaresFour} alt="Protocol Specs" />
            </div>
            <div className="self-stretch text-foreground text-2xl font-semibold font-['Inter'] leading-[28.80px]">
              voiceFlux
            </div>
            <div className="self-stretch text-muted-foreground text-base font-medium font-['Inter'] leading-relaxed">
              Voice to text, text to voice, voice conversion and more.
            </div>
            <div className="home-card-button justify-start items-center inline-flex">
              <Link href="/docs/voiceFlux">
                <div className="h-[42px] rounded-[10px] justify-center items-center flex group">
                  <div className="grow shrink basis-0 h-[42px] px-4 py-2 rounded-[10px] border border-border dark:border-white justify-center items-center gap-2 flex hover:bg-accent">
                    <div className="text-center text-foreground text-base font-medium font-['Inter'] leading-relaxed">
                      Get Started
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <div className="text-sm text-gray-400">
            © 2026 Media Forge. All rights reserved.
          </div>
          <div className="flex gap-4">
          </div>
        </div>
      </footer>
    </div>
  );
}
