"use client";

import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { name: "Startseite", href: "/" },
    { name: "Leistungen", href: "/leistungen" },
    { name: "Über uns", href: "/uber-uns" },
    { name: "Magazin", href: "/magazin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-[20px] supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/RK-Logo-02.png"
            alt="R&K-Gaggenau Logo"
            width={200}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            R&K-GAGGENAU
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            // Precise active matching
            const isActive = link.href === "/" 
              ? pathname === "/" 
              : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-1 font-bold" 
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link href="/kontakt" className={cn(buttonVariants({ variant: "default" }), "bg-linear-to-br from-primary/90 to-primary text-primary-foreground rounded-md px-6")}>
            Angebot anfordern
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="text-foreground" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menü umschalten</span>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-[20px]">
              <nav className="flex flex-col items-center gap-8 mt-16 text-center">
                {links.map((link) => {
                  const isActive = link.href === "/" 
                    ? pathname === "/" 
                    : pathname?.startsWith(link.href);
                    
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-xl font-medium transition-colors hover:text-primary ${
                        isActive 
                          ? "text-primary border-b-2 border-primary pb-1 font-bold" 
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link href="/kontakt" className={cn(buttonVariants({ variant: "default" }), "mt-6 bg-linear-to-br from-primary/90 to-primary text-primary-foreground px-10 rounded-full")}>
                  Angebot anfordern
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
