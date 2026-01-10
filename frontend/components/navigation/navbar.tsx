"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "../ui/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Newsletter", href: "/newsletters" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  useGSAP(() => {
    if (isOpen && mobileMenuRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        mobileMenuRef.current,
        { clipPath: "circle(0% at 100% 0%)" },
        {
          clipPath: "circle(150% at 100% 0%)",
          duration: 0.8,
          ease: "power4.inOut",
        },
      );

      const items = menuItemsRef.current?.querySelectorAll(".mobile-nav-item");
      if (items) {
        tl.from(
          items,
          {
            x: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4",
        );
      }
    } else if (!isOpen && mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong shadow-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container-padding mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href={"/"}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="default" asChild>
                <Link href={"/sign-in"}>Sign In</Link>
              </Button>
              <Button size="default" className="group">
                <Link href={"/sign-up"}>Get Started</Link>
              </Button>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-linear-to-br from-background-dark via-surface-dark to-background-dark z-40 md:hidden"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <div
          ref={menuItemsRef}
          className="flex flex-col items-center justify-center h-full space-y-8 p-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={toggleMenu}
              className="mobile-nav-item text-3xl font-bold text-white/90 hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          <div className="mobile-nav-item pt-8 flex flex-col gap-4 w-full max-w-xs">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={toggleMenu}
            >
              Sign In
            </Button>
            <Button size="lg" className="w-full group" onClick={toggleMenu}>
              Get Started
            </Button>
          </div>

          <div className="mobile-nav-item absolute bottom-8 left-0 right-0 text-center">
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <p className="text-xs text-text-secondary mt-2">
              Newsletter Advertising Made Simple
            </p>
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283915_1px,transparent_1px),linear-gradient(to_bottom,#2e283915_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </>
  );
}
