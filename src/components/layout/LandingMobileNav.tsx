"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Gewerblich", href: "/landing/gewerbereinigung" },
  { name: "Privat", href: "/landing/privatreinigung" },
  { name: "Grundreinigung", href: "/landing/grundreinigung" },
  { name: "Baureinigung", href: "/landing/baureinigung" },
  { name: "Institutionell", href: "/landing/spezialreinigung" },
  { name: "Saisonal", href: "/landing/saisonale-pflege" },
];

interface LandingMobileNavProps {
  /** The href of the currently active link, to highlight it */
  activePath: string;
}

export default function LandingMobileNav({ activePath }: LandingMobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount after hydration so createPortal works
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The overlay + drawer rendered via portal directly into document.body
  // This escapes any parent with backdrop-filter/transform that breaks fixed positioning
  const drawerPortal = mounted ? createPortal(
    <>
      {/* Backdrop overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* Slide-in drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigationsmenü"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          height: "100%",
          width: "300px",
          backgroundColor: "#ffffff",
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease-in-out",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827", letterSpacing: "-0.02em" }}>
            R&amp;K-GAGGENAU
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menü schließen"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "32px",
          paddingBottom: "32px",
          gap: "4px",
          flex: 1,
        }}>
          {links.map((link) => {
            const isActive = link.href === activePath;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: 600,
                  textDecoration: isActive ? "underline" : "none",
                  textDecorationColor: isActive ? "#047857" : "transparent",
                  textUnderlineOffset: "4px",
                  color: isActive ? "#047857" : "#1f2937",
                  transition: "color 200ms",
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div style={{
          padding: "24px",
          borderTop: "1px solid #e5e7eb",
        }}>
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "#047857",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
              transition: "background-color 200ms",
            }}
          >
            Jetzt buchen
          </Link>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
        aria-label="Menü öffnen"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Portal: backdrop + drawer rendered directly in <body> */}
      {drawerPortal}
    </>
  );
}
